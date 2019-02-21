const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Host = 'localhost';
const Port = process.env.PORT || 3004;

// connect to a promise library for usage
mongoose.Promise = global.Promise;

// connect mongoose with DB 
mongoose.connect(process.env.MONGODB_URI || 'mongodb://lawrenceagles:lawrence1@ds153637.mlab.com:53637/vetiva');
mongoose.connection.once('open', () => console.log('Mongodb now connected'));

const app = express();
app.use(bodyParser.json());

app.listen(Port, () => {
    console.log(`${Host} server started on ${Port}`);
});