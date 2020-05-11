const express = require('express');
const app = express();
const mongoose = require ('mongoose');
const bodyParser = require('body-parser');
const cors = require("cors"); //allow the app to be run on other stations
require ('dotenv/config');

//these are middlewears:
app.use(cors()); //allow the app to be run on other stations
app.use(bodyParser.json());

//middlewares === execute function when specific routes is hit
/*app.use('/posts', (req, res, next) => {
    console.log('this is middleware running');
    next();
});*/
//Import Routes
const postsRoute = require('./routes/posts');
const rootsRoute = require('./routes/roots');
//This is middlewar:
app.use('/posts',postsRoute);
app.use('/',rootsRoute);

//routes
/*app.get('/', (req,res) => {
    res.send('we are on home');
});*/

/*app.get('/posts', (req,res) => {
    res.send('we are on post');
});*/

//connect to DB mongoDB
// DB_CONNECTION=mongodb+srv://user:password@iot-cluster-1iwy8.mongodb.net/test?retryWrites=true&w=majority
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('connected to DB!')
);

app.listen(5000);