const SERVER_URL = "http://localhost:3000"
import { z } from "zod";

const emailBlastSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  body: z.string(),
  createdAt: z.date().default(() => new Date()),

  // relationships
  author: z.object({
    id: z.string(),
    // Add other fields from AdminUser if necessary
  }),
  adminUserId: z.string(),
  TargetLists: z.array(z.object({
    // Define the schema for EmailBlastToMailingList if necessary
  })),
  messagesSent: z.array(z.object({
    // Define the schema for Message if necessary
  })),
});

export type EmailBlast = z.infer<typeof emailBlastSchema>;

export async function getAllEmailBlasts() {
        try {
            const response = await fetch(SERVER_URL + '/blast/all');
            // making a GET request to the index page
            // parse the response as json
            const results = await response.json();
            // validate the response using zod
            const parsedResults = z.array(emailBlastSchema).parse(results);
            return parsedResults;
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error("Validation error:", error.errors);
            } else {
                console.error("Fetch error:", error.message);
            }
        }
    }

export async function createEmailBlast(name: string, body: string, adminUserId: string, token: string) : Promise<EmailBlast> {
    try {
        const response = await fetch(SERVER_URL + '/blast/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: name,
                body: body,
                adminUserId: adminUserId
            }),
        });
        const result = await response.json();
        const newEmailBlast = emailBlastSchema.parse(result);
        return newEmailBlast;
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Validation error:", error.errors);
        } else {
            console.error("Fetch error:", error.message);
        }
        return {error: 'Internal server error'};
    }
}



