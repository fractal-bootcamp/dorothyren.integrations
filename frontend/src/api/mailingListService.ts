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

const EmailBlastSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  createdAt: z.string().datetime(),
  adminUserId: z.string().cuid(),
  TargetLists: z.array(z.object({
    emailBlastId: z.string().cuid(),
    mailingListId: z.string().cuid()
  })),
  messagesSent: z.array(z.object({
    id: z.string().cuid(),
    content: z.string(),
    isDelivered: z.boolean(),
    sentTime: z.string().datetime(),
    recipientId: z.string().cuid(),
    emailBlastId: z.string().cuid().optional()
  }))
});

export type EmailBlast = z.infer<typeof EmailBlastSchema>;


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
            console.error("Fetch error:", error.message);
        }
    }
}

