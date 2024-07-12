const SERVER_URL = "http://localhost:3000";
import { z } from "zod";

const MailingListSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  createdAt: z.string().datetime(),
  Recipients: z.array(
    z.object({
      recipientId: z.string().cuid(),
      mailingListId: z.string().cuid(),
    })
  ),
  EmailBlasts: z.array(
    z.object({
      emailBlastId: z.string().cuid(),
      mailingListId: z.string().cuid(),
    })
  ),
});

export type MailingList = z.infer<typeof MailingListSchema>;

export type RecipientResponse =
  | {
      id: string;
      name: string;
      email: string;
      message: string;
    }
  | { error: string };

type Recipient = {
  id: string;
  name: string;
  email: string;
};

//this function searches for a specific mailing list by name query
export async function searchMailingLists(
  nameofList: string,
  token: string
): Promise<MailingList[] | undefined> {
  try {
    const response = await fetch(
      SERVER_URL + `/mailinglist/search?nameofList=${nameofList}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const results = await response.json();
    const validSearch = z.array(MailingListSchema).parse(results);
    return validSearch;
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

type RequestConfig = Omit<RequestInit, "body"> & {
  token: string;
  body?: { [key: string]: any };
};

//generalized makeRequest function that can be used in any fetch request
//requires params of url route and config params
const makeRequest = async <T>(
  url: string,
  config: RequestConfig
): Promise<T> => {
  let results;

  console.log(url, config);
  const response = await fetch(SERVER_URL + url, {
    ...config,
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
      ...config.headers,
    },
    body: JSON.stringify(config.body),
  });
  // making a GET request to the index page
  // parse the response as json
  console.log("response:", response);
  results = await response.json();
  console.log("results:", results);
  return results;
};

export const getMailingLists = (token: string) => {
  return makeRequest<MailingList | undefined>("/mailinglist/all", { token });
};

export const getMailingListById = (token: string, id: string) => {
  return makeRequest<MailingList | undefined>(`/mailinglist/${id}`, { token });
};

export const createMailingList = (token: string, name: string) => {
  return makeRequest<MailingList | undefined>("/mailinglist/new", {
    method: "POST",
    token,
    body: { name: name },
  });
};

export const softDeleteMailingList = (id: string, token: string) => {
  return makeRequest<{ Success: boolean }>(`/mailinglist/${id}/delete`, {
    method: "PUT",
    token,
  });
};

export const addNewRecipient = (
  name: string,
  email: string,
  mailingListId: string,
  token: string
) => {
  return makeRequest<Recipient | undefined>("/recipient/new", {
    method: "POST",
    token,
    body: { name, email, mailingListId },
  });
};

const recipientSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

// This fetches all recipients associated with a specific mailing list
export const fetchRecipientList = async (token: string, id: string) => {
  const data = await makeRequest(`/mailinglist/${id}/recipients`, { token });

  console.log("data from request:", data);
  const recipientList = z.array(recipientSchema).parse(data);
  return recipientList;
};

// this function updates a mailing list with adding and removing recipients
export const updateMailingList = (
  token: string,
  id: string,
  addedRecipients: string[],
  removedRecipients: string[]
) => {
  return makeRequest(`/mailinglist/${id}/update`, {
    method: "PUT",
    token,
    body: { addedRecipients, removedRecipients },
  });
};

// export async function updateMailingList(
//   id: string,
//   token: string,
//   addedRecipients: string[],
//   removedRecipients: string[]
// ) {
//   try {
//     const response = await fetch(SERVER_URL + `/mailinglist/${id}/update`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         addedRecipients,
//         removedRecipients,
//       }),
//     });
//     if (!response.ok) {
//       throw new Error(
//         `Failed to update mailing list. Server responded with status: ${response.status}`
//       );
//     }
//     const result = await response.json();
//     return {
//       addedRecipients: result.addedRecipients,
//       removedRecipients: result.removedRecipients,
//     };
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error(
//         "An error occurred while trying to update the mailing list:",
//         error.message
//       );
//       throw new Error(`Failed to update mailing list: ${error.message}`);
//     } else {
//       console.error("An unexpected error occurred:", error);
//       throw new Error(
//         "An unexpected error occurred while trying to update the mailing list"
//       );
//     }
//   }
// }
