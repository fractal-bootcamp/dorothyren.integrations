import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import cookieParser from "cookie-parser";
import express from "express";
import prisma from "./utils/client";

import optionalAdminUser from "./utils/mw-auth";
import cors from "cors";

// import dotenv from 'dotenv';
// dotenv.config();

const app = express();

const FRONTEND_URLS = [
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177",
];

// using middleware
app.use(
  cors({
    origin: FRONTEND_URLS,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
// allow urlencoded data to be submitted using middleware
app.use(express.urlencoded({ extended: true }));
//allow cookies to be interpreted
app.use(cookieParser());
// clerk modifies the request by adding req.auth
// this takes the token and communicates with clerk to get user information
// which gets assigned to req.auth
app.use(ClerkExpressWithAuth());
//this is the clerk middleware we wrote for auth
app.use(optionalAdminUser);

//FOR THE SIGN-UP PAGE
//create a POST to create a new Adminuser
app.post("/sign-up", optionalAdminUser, async (req, res) => {
  const email = req.user?.email;
  const clerkId = req.user?.clerkId;
  //if either email or clerkId is not found, then
  if (!email || !clerkId) {
    return res.status(400).json({ error: "User information is missing" });
  }
  try {
    const newUser = await prisma.adminUser.findFirst({
      where: {
        clerkId: clerkId,
      },
    });
    return res.json(newUser);
  } catch (error) {
    return res.status(500).json({ error: "Failed to create user" });
  }
});

//FOR THE MAILING LIST PAGE

// Create route for GET endpoint to search for specific mailing list by name
app.get("/mailinglist/search", async (req, res) => {
  const { nameofList } = req.query; // Get the search query from the URL parameters
  if (!nameofList || typeof nameofList !== "string") {
    return res
      .status(400)
      .json({ error: "Name query parameter is required and must be a string" });
  }
  try {
    const mailingLists = await prisma.mailingList.findMany({
      where: {
        name: {
          contains: nameofList,
          mode: "insensitive", //case-insensitive search
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(mailingLists);
  } catch (error) {
    console.error("Error searching for mailing list", error);
    res.status(500).json({
      error: "An error occurred while searching for the mailing list",
    });
  }
});

//create route to GET all mailing lists
app.get("/mailinglist/all", async (req, res) => {
  try {
    const mailingListFeed = await prisma.mailingList.findMany({
      orderBy: {
        createdAt: "desc", //returns the most recent first
      },
    });
    res.json(mailingListFeed);
  } catch (error) {
    console.error("Error fetching mailing list", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the mailing list" });
  }
});

//create route to GET specific mailing list
app.get("/mailinglist/:id", async (req, res) => {
  try {
    const mailingList = await prisma.mailingList.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        Recipients: true,
        EmailBlasts: true,
      },
    });
    if (!mailingList) {
      return res.status(404).json({ error: "Mailing list not found" });
    }
    res.json(mailingList);
  } catch (error) {
    console.error("Error fetching mailing list", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the mailing list" });
  }
});

//create route to POST a new mailing list
app.post("/mailinglist/new", async (req, res) => {
  try {
    const newMailingList = await prisma.mailingList.create({
      data: {
        name: req.body.name,
        createdAt: new Date(),
      },
    });
    res
      .status(201)
      .json({ message: "Mailing list created successfully", newMailingList });
  } catch (error) {
    console.error("Error creating mailing list", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the mailing list" });
  }
});

//create route to DELETE/PUT a mailing list
app.put("/mailinglist/:id/delete", async (req, res) => {
  try {
    const deletedList = await prisma.mailingList.update({
      where: {
        id: req.params.id,
      },
      data: {
        isDeleted: new Date(), //setting the current time stamp
      },
    });
    res.status(200).json({ message: "Mailing list deleted", deletedList });
  } catch (error) {
    console.error("Error deleting mailing list", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the mailing list" });
  }
});

//create route to PUT a mailing list with recipients and remove a list of recipients
app.put("/mailinglist/:id/update", async (req, res) => {
  // body - addedRecipients, removedRecipients
  const {
    addedRecipients: addedRecipientIds,
    removedRecipients: removedRecipientIds,
  } = req.body as { addedRecipients: string[]; removedRecipients: string[] };

  // modify the mailing list
  // add recipients
  await prisma.recipientToMailingList.createMany({
    data: addedRecipientIds.map((recipient) => ({
      recipientId: recipient,
      mailingListId: req.params.id,
    })),
  });

  // this will delete all records from the recipientToMailingList table where the recipientId matches any ID in the removedRecipientIds array
  await prisma.recipientToMailingList.deleteMany({
    where: {
      recipientId: {
        in: removedRecipientIds, //the in operator checks if the recipeintId is in the array removedRecipientIds
      },
    },
  });
  return res.status(200).json({ message: "Mailing list updated successfully" });
});

//create a route to add recipients
//TO DO - create it to include a mailing list
app.post("/recipient/new", async (req, res) => {
  try {
    const newRecipient = await prisma.recipient.create({
      data: {
        name: req.body.name,
        email: req.body.email,
      },
    });
    res
      .status(201)
      .json({ message: "Recipient created successfully", newRecipient });
  } catch (error) {
    console.error("Error creating recipient", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the recipient" });
  }
});

//create route to fetch all recipients on a mailing list
app.get("/mailinglist/:id/recipients", async (req, res) => {
  try {
    const mailingListId = req.params.id;

    const mailingListRecipients = await prisma.mailingList.findUnique({
      where: {
        id: mailingListId,
      },
      include: {
        Recipients: {
          include: {
            recipient: true,
          },
        },
      },
    });
    if (!mailingListRecipients) {
      return res.status(404).json({ error: "Mailing List not found" });
    }
    const recipients = mailingListRecipients.Recipients.map((r) => r.recipient);

    res.json(recipients);
  } catch (error) {
    console.error("Error fetching mailing list recipients:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//create route to POST an email blast
app.post("/blast/new", async (req, res) => {
  try {
    // Ensure the user is authenticated
    //UNDERSTAND THIS
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Validate input
    if (!req.body.name || !req.body.body) {
      return res.status(400).json({ error: "Name and body are required" });
    }

    // Create the email blast
    const emailBlast = await prisma.emailBlast.create({
      data: {
        name: req.body.name,
        body: req.body.body,
        createdAt: new Date(),
        adminUserId: req.user?.id,
      },
    });
    // Send successful response
    res.status(201).json({
      message: "Email blast successfully created",
      emailBlast,
    });
  } catch (error) {
    console.error("Error creating email blast:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//create route to GET all email blasts
app.get("/blast/all", async (req, res) => {
  try {
    const emailBlasts = await prisma.emailBlast.findMany({
      orderBy: {
        createdAt: "desc", //returns the most recent first
      },
    });
    res.json(emailBlasts);
  } catch (error) {
    console.error("Error fetching email blasts", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the email blasts" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000, http://localhost:3000");
});
