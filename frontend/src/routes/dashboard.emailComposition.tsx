import { Link } from "react-router-dom";
import EmailBlastBuilder from "../components/EmailBlastBuilder";

//we will import some EmailComposition component here. 

//this page is used to compose and send emails to select lists
//maybe incorporate rich text markdown editor to construct emails 

export default function EmailComposition() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw' }}>
            <div style={{ textAlign: 'center' }}>
                <h2>Email Composition and Sending</h2>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    <li style={{ marginBottom: '0.5rem' }}><EmailBlastBuilder /></li>
                    <li style={{ marginBottom: '0.5rem' }}><Link to="/dashboard">Dashboard</Link></li>
                    <li><Link to="/">Return to index</Link></li>
                </ul>
            </div>
        </div>
    );
}