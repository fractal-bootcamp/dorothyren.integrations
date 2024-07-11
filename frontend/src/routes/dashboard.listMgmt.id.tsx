import { useEffect, useState } from "react";
import ControlRecipient from "../components/AddRecipient";
import { Recipient } from "../components/AddRecipient";
import { fetchRecipientList } from "../api/mailingListService";
import { addNewRecipient } from "../api/mailingListService";
import AddNewRecipient from "../components/AddNewRecipient";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate, useParams } from "react-router-dom";

// Mock function to simulate fetching recipients from a server
// TODO: Replace this with an actual API call in production
// async function fetchRecipientList(): Promise<Recipient[]> {
//     // Simulated data representing a list of recipients
//     const mockData: Recipient[] = [
//         {
//             id: "xyz",
//             name: "steven",
//             email: "steven@gmail.com"
//         },
//         {
//             id: "abc",
//             name: "dorothy",
//             email: "dorothy@gmail.com"
//         },
//     ]
//     return mockData;
// }
export default function ListManagementById() {
    // State to store and update the list of recipients
    // Initially an empty array, will be populated with data from fetchRecipientList
    const [recipientList, setRecipientList] = useState<Recipient[]>([]);
    const { getToken } = useAuth();
    let { listId } = useParams();
    const navigate = useNavigate();

    async function getRecipients() {
        const token = await getToken();
        if (!token) return;
        if (!listId) {
            return navigate("/");
        }
        fetchRecipientList(token, listId)
            .then(data => setRecipientList(data))
            .catch(error => {
                console.error("Error fetching recipient list:", error);
                navigate("/404");
            });
    }

    // Effect hook to fetch the recipient list when the component mounts
    useEffect(() => {
        getRecipients();
    }, []);

    // Function to handle email changes for a specific recipient
    // Parameters:
    // - recipientIndex: The index of the recipient in the array
    // - NewEmail: The updated email address
    function handleEmailChange(recipientIndex: number, NewEmail: string): void {
        // Create a deep copy of the current recipient list to avoid direct state mutation
        const newRecipientList = structuredClone(recipientList);

        // Update the email of the recipient at the specified index
        // This approach assumes the index corresponds directly to the array position
        newRecipientList[recipientIndex].email = NewEmail;

        // Update the state with the new recipient list
        setRecipientList(newRecipientList);
    }

    return (
        // JSX for rendering the component
        // Note: Changes made here are only reflected in the local state,
        // not in any database. An update to the database would need to be
        // implemented separately, typically triggered by a save or update button
        <>
            {/* Render the AddRecipient component, passing the current recipient list and the email change handler */}
            <ControlRecipient recipientList={recipientList} handleEmailChange={handleEmailChange} />
            {/* Button for adding new recipients (functionality not implemented in this snippet) */}
            <AddNewRecipient />
        </>
    )
}