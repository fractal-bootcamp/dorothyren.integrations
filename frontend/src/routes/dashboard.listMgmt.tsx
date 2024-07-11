import { Link } from "react-router-dom";
import AddNewRecipient from "../components/AddNewRecipient";

//this page nedes to perform CRUD on mailing lists
//eventually need to sync to google docs


// TODO: actually go get all the lists from the DB, map over them and give each one a link for management

export default function ListManagement() {
    return (
        <>
            <h1>Mailing List Management</h1>
            <p>This is a protected page.</p>

            <ul>
                <AddNewRecipient />
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/">Return to index</Link></li>
                <li><Link to="/dashboard/listmgmt/clyelic2p0003tu54c75ml6c2">clyelic2p0003tu54c75ml6c2</Link></li>
            </ul>
        </>
    );
}