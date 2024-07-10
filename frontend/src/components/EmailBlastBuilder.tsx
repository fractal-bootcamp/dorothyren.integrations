import { useAuth, useUser } from "@clerk/clerk-react";
import { createEmailBlast } from "../api/emailCompositionService";
import { useState } from "react";

// create a function that has two parts:
// first part is the email control
// second part is the email drawer

export default function EmailBlastBuilder() {
    const { getToken } = useAuth();
    const { user } = useUser();
    const [name, setName] = useState<string>("");
    const [body, setBody] = useState<string>("");

    const handleEmailBlastSubmit = async (name: string, body: string, adminUserId: string) => {
        const token = await getToken();

        if (!token) {
            console.error("No token found");
            return;
        }
        try {
            const response = await createEmailBlast(name, body, adminUserId, token);
            console.log("new email blast:", response);
        }
        catch (error) {
            console.error("Error creating email blast:", error);
        }
    }

    function onFormSubmit() {
        if (!user) return;
        handleEmailBlastSubmit(name, body, user.id);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <h3>Email Blast Builder</h3>
            <form onSubmit={onFormSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="body">Body:</label>
                    <textarea
                        id="body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}