const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const route = require('./api/routes/Admin');
const userRoute = require('./api/routes/users');
const companyRoute = require('./api/routes/company');
const db = require('./config/db')
const router = express.Router();
const Host = 'localhost';
const Port = process.env.PORT || 3004;



// connect to a promise library for usage
mongoose.Promise = global.Promise; 

// connect mongoose with DB  process.env.MONGODB_URI || 'mongodb://localhost/Todoapp'
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://lawrenceagles:lawrence1@ds153637.mlab.com:53637/vetiva');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://lawrenceagles:lawrence1@ds153637.mlab.com:53637/vetiva', {
  useCreateIndex: true,
  useNewUrlParser: true
});
mongoose.connection.once('open', () => console.log('Mongodb now connected'));

const app = express(); // create express app and store it in the app variable
app.use(bodyParser.json()); // enable data to be availbe on req.body and allows us send data as json
app.use('/', router); // configure multer to use express router
app.use('/admin',route); // use the express.Router middleware to handle all routes
app.use('/companies',companyRoute);//company route
app.use('/users',userRoute);//user route


//Routes that are not defined throws errow
app.use((req, res, next)=>{
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.listen(Port, () => {
    console.log(`${Host} server started on ${Port}`);
});