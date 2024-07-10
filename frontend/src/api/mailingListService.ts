const SERVER_URL = "http://localhost:3000"
import {z} from "zod"

const MailingListSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  createdAt: z.string().datetime(),
  Recipients: z.array(z.object({
    recipientId: z.string().cuid(),
    mailingListId: z.string().cuid()
  })),
  EmailBlasts: z.array(z.object({
    emailBlastId: z.string().cuid(),
    mailingListId: z.string().cuid()
  }))
});

export type MailingList = z.infer<typeof MailingListSchema>;

//this function searches for a specific mailing list by name query
export async function searchMailingLists(nameofList: string, token: string): Promise<MailingList[] | undefined> {
   try { const response = await fetch(SERVER_URL + `/mailinglist/search?nameofList=${nameofList}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const results = await response.json();
    const validSearch= z.array(MailingListSchema).parse(results);
    return validSearch
    } catch (error) {
    if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors);
    } else if (error instanceof Error) {
        console.error("Fetch error:", error.message);
        throw error;
    }
    else {
        console.error("Unknown error:", error);
        throw new Error("An unknown error occurred");
    }
    }
}

//This functions fetches all mailing lists
export async function getMailingLists() {
    try {
        const response = await fetch(SERVER_URL + '/mailinglist/all');
        // making a GET request to the index page
        // parse the response as json
        const results = await response.json();
        // validate the response using zod
        const parsedResults = z.array(MailingListSchema).parse(results);
        return parsedResults;
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Validation error:", error.errors);
        } else {
            console.error("Fetch error:", error);
        }
    }
}

//this function fetches a specific mailing list by id
export async function getMailingListById(id: string, token: string): Promise<MailingList | undefined> {
    try {
        const response = await fetch(SERVER_URL + `/mailinglist/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        const selectedMailingList = MailingListSchema.parse(result);
        return selectedMailingList;
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Validation error:", error.errors);
        } else if (error instanceof Error) {
            console.error("Fetch error:", error.message);
            throw error;
        } else {
            console.error("Unknown error:", error);
            throw new Error("An unknown error occurred");
        }
    }
}

//this function creates a mailing list
export async function createMailingList(name: string, token: string) {
try{
    //write a fetch
    const response = await fetch(SERVER_URL + "/mailinglist/new", {
    //make a POST request
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
        name: name
        }),
    });
    const result = await response.json();
    const newMailingList = MailingListSchema.parse(result)
    return newMailingList;   
}
catch (error) {
    if (error instanceof z.ZodError){
        console.error("Validation error:", error.errors);
    } else {
        console.error("Fetch error:", error)
    }
}
}

// This function deletes a mailing list by id
export async function softDeleteMailingList(id: string, token: string) {
    try {
        const response = await fetch(SERVER_URL + `/mailinglist/${id}/delete`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to delete mailing list. Server responded with status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.error("An error occurred while trying to delete the mailing list:", error.message);
            throw new Error(`Failed to delete mailing list: ${error.message}`);
        } else {
            console.error("An unexpected error occurred:", error);
            throw new Error("An unexpected error occurred while trying to delete the mailing list");
        }
    }
}

// This function adds a new recipient
export type RecipientResponse = {
    id: string,
    name: string,
    email: string,
    message: string,
} | {error : string} 

export async function addNewRecipient(name: string, email: string, token: string): Promise<RecipientResponse> {
    try {
        const response = await fetch(SERVER_URL + "/recipient/new", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: name,
                email: email
            }),
        });
        if (!response.ok) {
            throw new Error(`Failed to add new recipient. Server responded with status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.error("An error occurred while trying to add a new recipient:", error.message);
            throw new Error(`Failed to add new recipient: ${error.message}`);
        } else {
            console.error("An unexpected error occurred:", error);
            throw new Error("An unexpected error occurred while trying to add a new recipient");
        }
    }
}

// this function updates a mailing list with adding and removing recipients
export async function updateMailingList(id: string, token: string, addedRecipients: string[], removedRecipients: string[]) {
    try {
        const response = await fetch(SERVER_URL + `/mailinglist/${id}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                addedRecipients,
                removedRecipients
            }),
        });
        if (!response.ok) {
            throw new Error(`Failed to update mailing list. Server responded with status: ${response.status}`);
        }
        const result = await response.json();
        return {
            addedRecipients: result.addedRecipients,
            removedRecipients: result.removedRecipients
        };
        } catch (error) {
        if (error instanceof Error) {
            console.error("An error occurred while trying to update the mailing list:", error.message);
            throw new Error(`Failed to update mailing list: ${error.message}`);
        } else {
            console.error("An unexpected error occurred:", error);
            throw new Error("An unexpected error occurred while trying to update the mailing list");
        }
    }
}
