const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const route = require('./api/routes/company');

const Host = 'localhost';
const Port = process.env.PORT || 3004;



// connect to a promise library for usage
mongoose.Promise = global.Promise; 

// connect mongoose with DB  process.env.MONGODB_URI || 'mongodb://localhost/Todoapp'
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://lawrenceagles:lawrence1@ds153637.mlab.com:53637/vetiva');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://lawrenceagles:lawrence1@ds153637.mlab.com:53637/vetiva');
mongoose.connection.once('open', () => console.log('Mongodb now connected'));

const app = express(); // create express app and store it in the app variable
app.use(bodyParser.json()); // enable data to be availbe on req.body and allows us send data as json
app.use(route); // use the express.Router middleware to handle all routes



app.listen(Port, () => {
    console.log(`${Host} server started on ${Port}`);
});