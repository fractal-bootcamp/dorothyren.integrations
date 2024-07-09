import { SignUp, useAuth, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function SignUpPage() {
    const { getToken } = useAuth(); // Hook to get the authentication token 
    const { user, isLoaded } = useUser();
    const navigate = useNavigate();

    const createaAdminUserInDatabase = async () => {
        // url of our backend server
        const hostname = "http://localhost:3000" // this is the root URL of the backend server

        try {
            const token = await getToken(); //getting the auth token 
            const response = await fetch(hostname + '/sign-up', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('failed to create user in database');
            }
            //handle user creation
            const newUser = await response.json();
            console.log('user created in database', newUser);
        } catch (error) {
            console.error('Error creating user:', error);
            //handle error 
        }
    }

    //ensure we have user data before trying to create a database entry for a new user
    useEffect(() => {
        (async () => {
            if (user && isLoaded) {
                await createaAdminUserInDatabase(); // call function to create a user in the database
                navigate('/'); // redirect to home page
            }
        })()

    }, [isLoaded, user])

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                <h2>Sign Up</h2>
                <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" forceRedirectUrl="/sign-up" />
            </div>
        </div>
    );
}
