require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const route = require('./api/routes/Admin');
const userRoute = require('./api/routes/users');
const companyRoute = require('./api/routes/company');
const db = require('./config/db/db')
const router = express.Router();
const Host = 'localhost';
const Port = process.env.PORT;

const {mongoose} = require('./config/db/mongoose');


const app = express(); // create express app and store it in the app variable
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // enable data to be availbe on req.body and allows us send data as json
app.use('/',companyRoute);//company route
app.use('/', router); // configure multer to use express router
app.use('/',route); // use the express.Router middleware to handle all routes
app.use('/',userRoute);//user route



//Routes that are not defined throws error
app.use((req, res, next)=>{
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.listen(Port, () => {
    console.log(`${Host} server started on ${Port}`);
});