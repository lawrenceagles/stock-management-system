const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const bodyParser = require('body-parser');
const route = require('./api/routes/Admin');
const multer = require('multer');
const userRoute = require('./api/routes/users');
const companyRoute = require('./api/routes/company');
const router = express.Router();
const Host = 'localhost';
const Port = process.env.PORT || 3004;

const {mongoose} = require('./config/db/mongoose');


const app = express(); // create express app and store it in the app variable
app.use(cors());

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

// // cron functions
// const vestingDateAuto = (today)=>{
// 	console.log(`running a task every minute at ${today}`);
// }

// // Cron Jobs
// cron.schedule('* * * * *', () => {
//   vestingDateAuto(Date.now());
// });

// configure multer for file upload
const upload = multer({
    dest: 'shcemeRules',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(pdf|PDF)$/)) {
            return cb(new Error('Please upload a Word document'))
        }

        cb(undefined, true)
    }
})

// upload company scheme rules sir
app.post('/upload/schemerule/:companyid', upload.single('upload'), (req, res) => {
	const companyID = req.params.companyid;
	const companySchemeRulePath = req.file.path;

	// Validate ID.
	if(!Objectid.isValid(companyID)){
		return res.status(400).json({Message: "Error invalid object id"});
	}


	Company.findById(companyid).then(company=>{ // find company by id
		if(!company){ // handle no company found
			return res.status(404).json({Message: "No company found"});
		}

		company.schemeRule = req.file.path; // set company scheme rule to the pdf path

		res.send("Scheme rule uploaded successfully");
	}).catch(e=>{
		return res.status(400).json({Message:`${e}`});
	})
})

app.get('/upload/schemerule/:companyid', (req,res)=>{
	const companyID = req.params.companyid;
	
	// Validate ID.
	if(!Objectid.isValid(companyID)){
		return res.status(400).json({Message: "Error invalid object id"});
	}

	Company.findById(companyid).then(company=>{ // find company by id
		
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
})


app.listen(Port, () => {
    console.log(`${Host} server started on ${Port}`);
});