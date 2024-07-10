import { useEffect, useState } from "react";
import AddRecipient, { Recipient } from "../components/AddRecipient";

//we need to replace with the actual fetch for all recipients
async function fetchRecipientList(): Promise<Recipient[]> {
    const mockData: Recipient[] = [
        {
            id: "xyz",
            name: "steven",
            email: "steven@gmail.com"
        },
        {
            id: "abc",
            name: "dorothy",
            email: "dorothy@gmail.com"
        },

    ]
    return mockData
}

export default function ListManagementByID() {
    const [recipientList, setRecipientList] = useState<Recipient[]>([])

    useEffect(() => {
        fetchRecipientList()
            .then(data => setRecipientList(data));
    }, [])

    function handleEmailChange(recipientIndex: number, NewEmail: string): void {
        const newRecipientList = structuredClone(recipientList)
        //take some number from the list and modify it
        //recipientToModify is the number is what we're putting into the square bracket
        // const recipientIndexToModify = newRecipientList.findIndex(recipient => recipient.id === recipientIndex)
        newRecipientList[recipientIndex].email = NewEmail;
        setRecipientList(newRecipientList);
    }

    return (
        //any operation that is performed on the recipient list is only performed on the local copy
        //nothing will happen on the db until we click the update button
        <>
            <AddRecipient recipientList={recipientList} handleEmailChange={handleEmailChange} />
            <button>Add</button>
        </>
    )
}