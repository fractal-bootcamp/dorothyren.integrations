// Define the structure of a Recipient object
export interface Recipient {
    id: string,
    name: string,
    email: string,
}

// Define the props that this component expects to receive
interface ControlRecipientProps {
    // An array of Recipient objects, passed from the parent component
    recipientList: Recipient[];

    // A function to handle email changes, passed from the parent component
    // It takes two parameters:
    // - recipientId: number (index of the recipient in the array)
    // - NewEmail: string (the new email value)
    // The function doesn't return anything (void)
    handleEmailChange: (recipientId: number, NewEmail: string) => void;
}

// The main component function, receiving props of type ControlRecipientProps
export default function ControlRecipient(props: ControlRecipientProps) {
    return (
        <>
            {/* Map over the recipientList array to create UI elements for each recipient */}
            {props.recipientList.map((recipient, i) =>
                <div key={i}>
                    {/* Input field for the recipient's email */}
                    <input
                        value={recipient.email}
                        onChange={(e) => props.handleEmailChange(i, e.target.value)}
                    />
                    {/* Delete button (functionality not implemented in this snippet) */}
                    <button>Delete</button>
                </div>
            )}
        </>
    )
}