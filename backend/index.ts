import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import cookieParser from 'cookie-parser';
import express from 'express';
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


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000, http://localhost:3000');
});