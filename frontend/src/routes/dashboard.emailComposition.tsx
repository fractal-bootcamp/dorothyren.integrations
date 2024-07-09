import { Link } from "react-router-dom";
import EmailBlastBuilder from "../components/EmailBlastBuilder";

//we will import some EmailComposition component here. 

//this page is used to compose and send emails to select lists
//maybe incorporate rich text markdown editor to construct emails 

export default function EmailComposition() {
    return (
        <>
            <h1>Email Composition and Sending</h1>
            <p>This is a protected page.</p>

            <ul>
                < EmailBlastBuilder />
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/">Return to index</Link></li>
            </ul>
        </>
    );
}