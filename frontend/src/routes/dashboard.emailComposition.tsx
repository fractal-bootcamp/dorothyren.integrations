import { Link } from "react-router-dom";

//this page is used to compose and send emails to select lists
//maybe incorporate rich text markdown editor to construct emails 

export default function EmailComposition() {
    return (
        <>
            <h1>Email Composition and Sending</h1>
            <p>This is a protected page.</p>

            <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/">Return to index</Link></li>
            </ul>
        </>
    );
}