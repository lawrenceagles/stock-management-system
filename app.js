const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const bodyParser = require('body-parser');
const route = require('./api/routes/Admin');
const userRoute = require('./api/routes/users');
const companyRoute = require('./api/routes/company');
const router = express.Router();
const Host = 'localhost';
const Port = process.env.PORT || 3004;

const {mongoose} = require('./config/db/mongoose');


const app = express(); // create express app and store it in the app variable
app.use(cors());
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


// Cron Jobs
cron.schedule('* * * * *', () => {
  console.log('running a task every minute');
});

app.listen(Port, () => {
    console.log(`${Host} server started on ${Port}`);
});