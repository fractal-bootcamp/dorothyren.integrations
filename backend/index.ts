import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import cookieParser from 'cookie-parser';
import express from 'express';
import prisma from './utils/client';

import optionalAdminUser from './utils/mw-auth';
import cors from 'cors';

// import dotenv from 'dotenv';
// dotenv.config();

const app = express();

const FRONTEND_URL = 'http://localhost:5174';

// using middleware 
app.use(cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())
// allow urlencoded data to be submitted using middleware
app.use(express.urlencoded({ extended: true }))
//allow cookies to be interpreted 
app.use(cookieParser())
// clerk modifies the request by adding req.auth
// this takes the token and communicates with clerk to get user information
// which gets assigned to req.auth
app.use(ClerkExpressWithAuth())
//this is the clerk middleware we wrote for auth
app.use(optionalAdminUser)


//FOR THE SIGN-UP PAGE
//create a POST to create a new user
app.post('/sign-up', optionalAdminUser, async (req, res) => {
    const email = req.user?.email;
    const clerkId = req.user?.clerkId;
    //if either email or clerkId is not found, then 
    if (!email || !clerkId) {
        return res.status(400).json({error: 'User information is missing'})
    }
    try {
        const newUser = await prisma.adminUser.findFirst({
            where: {
                clerkId: clerkId,
            }
        });
        return res.json(newUser);
    } catch (error) {
        return res.status(500).json({ error: "Failed to create user" });
    }
});

//FOR THE MAILING LIST PAGE

//create route to GET all mailing lists
app.get('/mailinglist/all', async (req, res) => {
    try{
        const mailingListFeed = await prisma.mailingList.findMany({
            orderBy: {
                createdAt: 'desc' //returns the most recent first 
            },
        })
        res.json(mailingListFeed);
    }
    catch (error) {
        console.error('Error fetching mailing list', error);
        res.status(500).json({ error: 'An error occurred while fetching the mailing list' });
    }
})

//create route to GET specific mailing list
app.get('/mailinglist/:id', async (req, res) => {
    try{
        const mailingList = await prisma.mailingList.findUnique({
            where: {
                id: req.params.id
            }
        });
        if (!mailingList) {
            return res.status(404).json({ error: 'Mailing list not found' });
        }
        res.json(mailingList);
    }
    catch (error) {
        console.error('Error fetching mailing list', error);
        res.status(500).json({ error: 'An error occurred while fetching the mailing list' });
    }
})

//create route to DELETE a mailing list
app.delete('/mailinglist/:id', async (req, res) => {
    try{
        const deletedList = await prisma.mailingList.delete({
            where: {
                id: req.params.id
            },
        })
        res.status(200).json({ message: 'Mailing list deleted successfully' , deletedList});
    }
    catch (error) {
        console.error('Error deleting mailing list', error);
        res.status(500).json({ error: 'An error occurred while deleting the mailing list' });
    }
})

//create route to POST a new mailing list
app.post('/mailinglist', async (req, res) => {
    try{

    }
    catch (error) {
        console.error('Error creating mailing list', error);
        res.status(500).json({ error: 'An error occurred while creating the mailing list' });
    }
})

//create route to PUT a mailing list with recipients and remove a list of recipients
app.put('/mailinglist/:id', async (req, res) => {
    // body - addedRecipients, removedRecipients
    const { addedRecipients: addedRecipientIds, removedRecipients: removedRecipientIds } = req.body as { addedRecipients: string[], removedRecipients: string[] };

    // modify the mailing list
    // add recipients
    await prisma.recipientToMailingList.createMany({
        data: addedRecipientIds.map(recipient => ({
            recipientId: recipient,
            mailingListId: req.params.id
        }))
    })

    // this will delete all records from the recipientToMailingList table where the recipientId matches any ID in the removedRecipientIds array
    await prisma.recipientToMailingList.deleteMany({
        where: {
            recipientId: {
                in: removedRecipientIds  //the in operator checks if the recipeintId is in the array removedRecipientIds
            }
        }
    })

    return res.status(200).json({ message: 'Mailing list updated successfully' });

})

//create route to POST an email blast 
app.post('/blast/new', async (req, res) => {
    try{
        // Ensure the user is authenticated
        //UNDERSTAND THIS
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Validate input
        if (!req.body.name || !req.body.body) {
            return res.status(400).json({ error: 'Name and body are required' });
        }

        // Create the email blast
        const emailBlast = await prisma.emailBlast.create({
            data: {
                name: req.body.name,
                body: req.body.body,
                createdAt: new Date(),
                adminUserId: req.user?.id
            }
        });
        // Send successful response
        res.status(201).json({
            message: 'Email blast successfullycreated',
            emailBlast
        });

    } catch (error) {
        console.error('Error creating email blast:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

//create route to GET all email blasts
app.get('/blast/all', async (req, res) => {
    try{
        const emailBlasts = await prisma.emailBlast.findMany({
            orderBy: {
                createdAt: 'desc' //returns the most recent first 
            },
        })
        res.json(emailBlasts);
    }
    catch (error) {
        console.error('Error fetching email blasts', error);
        res.status(500).json({ error: 'An error occurred while fetching the email blasts' });
    }
})

app.listen(3000, () => {
  console.log('Server is running on port 3000, http://localhost:3000');
});