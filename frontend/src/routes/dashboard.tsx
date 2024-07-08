import { Link } from "react-router-dom";

export default function DashboardPage() {
    return (
        <>
            <h1>Dashboard page</h1>
            <p>This is a protected page.</p>

            <ul>
                <li><Link to="/dashboard/listmgmt">Mailing List Management</Link></li>
                <li><Link to="/dashboard/emailcomposition">Email Composition and Sending</Link></li>
                <li><Link to="/">Return to index</Link></li>
            </ul>
        </>
    );
}