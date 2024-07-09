import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import cookieParser from 'cookie-parser';
import express from 'express';
import prisma from '../../../utils/client';
import cors from 'cors';

const app = express();

// using middleware 
app.use(cors())
app.use(express.json())
// allow urlencoded data to be submitted using middleware
app.use(express.urlencoded({ extended: true }))
//allow cookies to be interpreted 
app.use(cookieParser())
// clerk modifies the request by adding req.auth
// this takes the token and communicates with clerk to get user information
// which gets assigned to req.auth
app.use(ClerkExpressWithAuth())

//FOR THE DASHBOARD PAGE, create GET response to get all blasts
app.get('/blast/all', async (req, res) => {
    try{
        const feed = await prisma.emailBlast.findMany({
            orderBy: {
                createdAt: 'desc' //returns the most recent first 
            },
        })
        res.json(feed);
    }
    catch (error) {
        console.error('Error fetching art feed', error);
        res.status(500).json({ error: 'An error occurred while fetching the email blast feed' });
    }
})