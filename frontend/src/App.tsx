import './App.css';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";


function App() {

  return (
    <>
      <h3>This will be the home dashboard which will display a view of email blasts
        + there will be 2 routes from here:</h3>
      <div>
        <ul>
          Mailing List Management &
          Email Composition and Sending
        </ul>
      </div>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
}

export default App;
