import { Link } from "react-router-dom";
import MailingListBuilder from "../components/MailingListBuilder";

//this page nedes to perform CRUD on mailing lists
//eventually need to sync to google docs

export default function ListManagement() {
    return (
        <>
            <h1>Mailing List Management</h1>
            <p>This is a protected page.</p>

            <ul>
                <MailingListBuilder />
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/">Return to index</Link></li>
                <li><Link to="/dashboard/listmgmt/id">xx</Link></li>
            </ul>
        </>
    );
}