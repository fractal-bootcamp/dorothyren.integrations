export interface Recipient {
    id: string,
    name: string,
    email: string,
}

interface AddRecipientProps {
    recipientList: Recipient[];
    //emailChanged is an arrow function
    //it has two parameters - both are strings. 
    //the return type is void
    //this is a function im passing down from the parent - the /mailinglist/id page
    handleEmailChange: (recipientId: number, NewEmail: string) => void;
}

export default function ControlRecipient(props: AddRecipientProps) {

    return (
        <>
            {props.recipientList.map((recipient, i) =>
                <div key={i}>
                    <input value={recipient.email} onChange={(e => props.handleEmailChange(i, e.target.value))} />
                    <button>Delete</button>
                </div>
            )}
        </>
    )
}

