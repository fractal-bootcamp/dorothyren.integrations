import cookieParser from 'cookie-parser';
import express from 'express';

const app = express();
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000, http://localhost:3000');
});