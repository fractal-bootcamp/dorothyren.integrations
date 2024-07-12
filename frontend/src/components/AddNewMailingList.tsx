import { useAuth } from "@clerk/clerk-react";
import { createMailingList } from "../api/mailingListService";
import { useState } from "react";

export default function AddNewMailingList() {
    const { getToken } = useAuth();
    const [name, setName] = useState('')

    const handleAddMailingList = async (name: string): Promise<void> => {
        console.log("dsfdfsdfs")
        try {
            const token = await getToken();

            if (!token) {
                throw Error("no token found")
            }

            console.log('sdfddddd')
            const response = await createMailingList(token, name);
            console.log("new mailing list created", response)
        }
        catch (error) {
            console.log("error creating mailing list", error)
        }
    }
    return (
        <div style={{ border: "1px solid black" }}>
            <label>
                Create New Mailing List
            </label>
            <input
                type="text"
                placeholder="enter Mailing List Name here"
                value={name}
                onChange={(e) => setName(e.target.value)} />
            <button onClick={() => handleAddMailingList(name)}>Add</button>
        </div>
    )
}

