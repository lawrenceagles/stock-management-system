const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const route = require('./api/routes/Admin');
const multer = require('multer');
const cron = require('node-cron');
const userRoute = require('./api/routes/users');
const companyRoute = require('./api/routes/company');
const router = express.Router();
require('dotenv').config();

const {ObjectId} = require('mongodb');
const {Company} = require('./api/models/company');

const Host = 'localhost';
const Port = process.env.PORT;

const {mongoose} = require('./config/db/mongoose');


const app = express(); // create express app and store it in the app variable
app.use(cors());

// configure multer for file upload
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(pdf|PDF)$/)) {
            return cb(new Error('Please upload a PDF file'))
        }

        cb(undefined, true)
    }
})

// upload company scheme rules sir
app.post('/upload/schemerule/:companyid',upload.single('upload'), (req, res) => {
	const companyID = req.params.companyid;
	const companySchemeRule = req.file.buffer;

	// Validate ID.
	if(!ObjectId.isValid(companyID)){
		return res.status(400).json({Message: "Error invalid object id"});
	}


	Company.findById(companyID).then(company=>{ // find company by id
		if(!company){ // handle no company found
			return res.status(404).json({Message: "No company found"});
		}

		company.schemeRule = companySchemeRule; // set company scheme rule to the pdf path
		company.save().then(companyDoc=>{
			res.json({Message: "Scheme rule uploaded successfully"});
		}).catch(e=>{
			return res.status(400).json({Message:`${e}`});
		})
	}).catch(e=>{
		return res.status(400).json({Message:`${e}`});
	})
},(error, req, res, next) => {
    res.status(400).json({ error: `${error.message}` })
})

app.get('/upload/schemerule/:companyid', (req,res)=>{
	const companyID = req.params.companyid;

	// Validate ID.
	if(!ObjectId.isValid(companyID)){
		return res.status(400).json({Message: "Error invalid object id"});
	}

	Company.findById(companyID).then(company=>{ // find company by id

		if(!company){ // handle no company found
			return res.status(404).json({Message: "No company found"});
		}

		if(!company.schemeRule){// handle no scheme rule
			return res.status(404).json({Message: "Error no scheme rule found. Please upload one for this company"});
		}

		res.send(company.schemeRule); // send the pdf path;

	}).catch(e=>{
		return res.status(400).json({Message:`${e}`});
	})
},(error, req, res, next) => {
    res.status(400).json({ error: `${error.message}` })
})


// Vesting Scheduler
cron.schedule(' 1 * * * * *', () => {
  console.log('running every minute 1, 2, 4 and 5');
});

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // enable data to be availbe on req.body and allows us send data as json
app.use('/',companyRoute);//company route
app.use('/', router); // configure multer to use express router
app.use('/',route); // use the express.Router middleware to handle all routes
app.use('/',userRoute);//user route



//Routes that are not defined throws error
app.use((req, res, next)=>{
  var err = new Error({Message: `page error `});
  err.status = 404;
  next(err);
});

app.listen(Port, () => {
    console.log(`${Host} server started on ${Port}`);
});
