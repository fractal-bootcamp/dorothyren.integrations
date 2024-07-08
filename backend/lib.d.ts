// Importing the LooseAuthProp type from the Clerk SDK
import type { LooseAuthProp } from "@clerk/clerk-sdk-node";

// Importing the Users type from Prisma client
import { AdminUser } from "@prisma/client";

// Defining a custom type that optionally includes a user property of type Users
type CustomUserProp = {
   user?: AdminUser
}

// Combining the custom user property type with the LooseAuthProp type from Clerk
type AuthProps = CustomUserProp & LooseAuthProp;

// Extending the Express Request interface to include our custom AuthProps
declare global {
    namespace Express {
      interface Request extends AuthProps { }
    }
}

// Ensuring this file is treated as a module
export {}