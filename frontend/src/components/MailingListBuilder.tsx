//create the buttons for the mailing list page

import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";
import { addNewRecipient } from "../api/mailingListService";

export default function MailingListBuilder() {
    const { getToken } = useAuth();
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')


    const handleAddRecipient = async (name: string, email: string) => {
        const token = await getToken();

        if (!token) {
            console.error("No token found");
            return;
        }
        try {
            const response = await addNewRecipient(name, email, token);
            console.log("new recipient created", response)
        }
        catch (error) {
            console.error("Error creating recipient", error)
        }
    }

    return (
        <>
            <h2> Add Recipient </h2>
            <label>Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} />
            <label>Email</label>
            <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
            <button onClick={() => handleAddRecipient(name, email)}>Add</button>
        </>
    )

}