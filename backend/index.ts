import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import cookieParser from 'cookie-parser';
import express from 'express';
import prisma from './prisma/client';
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
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())


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

//FOR THE MAILING LIST PAGE

//create route to GET all mailing lists
app.get('/mailinglist/all', async (req, res) => {
    try{
        const mailingListFeed = await prisma.mailingList.findMany({
            orderBy: {
                createdAt: 'desc' //returns the most recent first 
            },
        })
        res.json(mailingListFeed);
    }
    catch (error) {
        console.error('Error fetching mailing list', error);
        res.status(500).json({ error: 'An error occurred while fetching the mailing list' });
    }
})

//create route to GET specific mailing list
app.get('/mailinglist/:id', async (req, res) => {
    try{
        const mailingList = await prisma.mailingList.findUnique({
            where: {
                id: req.params.id
            }
        });
        if (!mailingList) {
            return res.status(404).json({ error: 'Mailing list not found' });
        }
        res.json(mailingList);
    }
    catch (error) {
        console.error('Error fetching mailing list', error);
        res.status(500).json({ error: 'An error occurred while fetching the mailing list' });
    }
})

//create route to DELETE a mailing list
app.delete('/mailinglist/:id', async (req, res) => {
    try{
        const deletedList = await prisma.mailingList.delete({
            where: {
                id: req.params.id
            },
        })
        res.status(200).json({ message: 'Mailing list deleted successfully' , deletedList});
    }
    catch (error) {
        console.error('Error deleting mailing list', error);
        res.status(500).json({ error: 'An error occurred while deleting the mailing list' });
    }
})

//create route to POST a mailing list with recipients 
app.post('/mailinglist', async (req, res) => {
    try{}
    catch (error) {
        console.error('Error creating mailing list', error);
        res.status(500).json({ error: 'An error occurred while creating the mailing list' });
    }
})

//create route to PUT a mailing list with recipients and remove a list of recipients
app.put('/mailinglist', async (req, res) => {

})

//create route to POST an email blast 
app.post('/blast/new', (req, res) => {

})


app.listen(3000, () => {
  console.log('Server is running on port 3000, http://localhost:3000');
});