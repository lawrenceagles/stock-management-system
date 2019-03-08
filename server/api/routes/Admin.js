const express = require('express');
const router = express.Router();
const _ = require('lodash');
const multer = require('multer');
const bcrypt = require('bcrypt');

const {Admin} = require ('../models/admin');
const {Log} = require ('../models/audit_Trail');
const {ObjectId} = require('mongodb');
const {authenticate} = require('../../middleware/authenticate');

const upload = multer({ dest: 'uploads/' }); // configure multer



router.post('/profile', upload.single('image'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  if(!req.file){
    return res.status(204).send({Error: "Upload was not successful!"});
  }
  res.status(200).send(req.file);

});

// Home route 
// Ask what should the home route point to? 
// The login Page?
router.get('/', (req, res) => {
    res.send({type: "WELCOME TO HOME LOGIN"});
});

// GET route get all admins
router.get('/admin',authenticate,(req, res) => {
    Admin.find().then(doc => { 
        let log = new Log({
            action: `${req.admin.lastname} ${req.admin.firstname} viewed all admin profile`,
            createdBy: `${req.admin.lastname} ${req.admin.firstname}`
        });

        log.save();

        res.send(doc);
    });
    },

    (e) => {
      res.status(404).send();
    }
);


// Registration form Route
router.get('/admin/register', (req, res)=> {
    res.send({"Register": "This is the registration page"})
});

// POST Route onboard admin
router.post('/admin',authenticate, (req, res) => {
    // let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // let randomPassword = _.sample(possible, 10).join('');
    // req.body.password = randomPassword;

    let body = _.pick(req.body, ['firstname', 'lastname', 'username', 'email', 'phone', 'role']);
    let admin = new Admin(body);

    let log = new Log({
        action: `${req.admin.lastname} ${req.admin.firstname} created ${admin.firstname} ${admin.lastname} profile`,
        createdBy: `${req.admin.lastname} ${req.admin.firstname}`
    });

    log.save();

    admin.save().then(() => { // save the admin instance 
        return admin.generateToken(); // save the admin instance
    }).then((token) => { // pass pass the token as the value of the custom header 'x-auth' and send header with the newly signed up admin.
        res.header('x-auth', token).send(admin);
    }).catch((e) => {
        res.status(400).send(e);
    });
});


// Route that returns a single admin and its token
// router.get('/me',authenticate, (req, res) => {
//     res.send(req.admin);
// });

// signin/login route
router.post('/admin/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    Admin.findByCredentials(body.email, body.password).then((admin)=> { 

        if(admin.tokens.length > 0){
            return res.send("You are already Logged in");
        }

        return admin.generateToken().then((token)=> {
            return res.header('x-auth', token).send({
                username: admin.username,
                role:admin.role,
                token
            });
        });
    }).catch((e)=> {
        res.status(400).send(e);
    })
});

// signout/logout route
router.delete('/admin/logout',authenticate, (req, res)=>{
  req.admin.removeToken(req.token).then(()=>{
    let log = new Log({
        action: `${req.admin.lastname} ${req.admin.firstname} logged out`
    });

    log.save();

    res.status(200).send();
  }, ()=>{
    res.status(400).send();
  })
});


// GET :id Route to get single admin
router.get('/admin/:id',authenticate, (req, res) => {
    // Log.auditTrail(req.admin, {name:"Lawrence Eagles"});

    // destructure the req.params object to get the object id.
    let id = req.params.id;

    // checks if the object is valid
    if(!ObjectId.isValid(id)) {
        res.status(404).send();
    }

    // find the admin by id.
    Admin.findById(id).then((doc)=> {
        let log = new Log({
            action: `${req.admin.lastname} ${req.admin.firstname} viewed ${doc.firstname} ${doc.lastname} profile`,
            createdBy: `${req.admin.lastname} ${req.admin.firstname}`
        });

        log.save();

        // if admin is not found return error 404 otherwise send the admin.
        doc ? res.send(doc) : res.status(404).send();
    }).catch((e)=>{
        res.status(400).send();
    })

});

// PATCH Route Update admin
router.patch('/admin/:id',authenticate, (req, res) => {
    // get the admin id
    let id = req.params.id;
    // pickout only what you want to grant the admin permission to update
    let body = _.pick(req.body, ["firstname", "lastname", "username", "password", "email", "phone", "role"]);
    // validate the id
    if(!ObjectId.isValid(id)){
        res.status(400).send();
    }
    // find and update the admin by id if it is found, throw error 404 if not
    Admin.findOneAndUpdate({_id:id}, {$set:body}, {new: true}).then((doc)=>{
        // check if doc was foun and updated
        if(!doc){
            res.status(404).send();
        }

        let saltRounds = 10;
        let Password = doc.password;
        let hash = bcrypt.hashSync(Password, saltRounds);
        doc.password = hash;
        doc.save();

        Admin.findById(id).then(doc=>{
            let log = new Log({
                action: `${req.admin.lastname} ${req.admin.firstname} edited ${doc.firstname} ${doc.lastname} profile`,
                createdBy: `${req.admin.lastname} ${req.admin.firstname}`
            });

            log.save();
            res.send(doc);
        })
        
    }).catch((e)=>{
        res.status(400).send();
    });
    
});

// DELETE Route delete admin
router.delete('/admin/:id',authenticate, (req, res) => {
    // get the admin id
    let id = req.params.id;
    // validate the company id
    if(!ObjectId.isValid(id)){
        res.status(400).send();
    }
    // query to find admin and delete
    Admin.findByIdAndDelete(id).then((doc)=>{

        if(!doc){ // if doc is not found return error 404.
            res.status(404).send("This user is not in the database");
        }

        let log = new Log({
            action: `${req.admin.lastname} ${req.admin.firstname} deleted ${doc.firstname} ${doc.lastname} profile`,
            createdBy: `${req.admin.lastname} ${req.admin.firstname}`
        });

        log.save();

        res.send(doc); // return the deleted doc (admin) if found and deleted
    }).catch((e)=>{
        res.status(400).send();
    });
});

// Audit Trail Route
router.get('/audit',authenticate, (req, res)=>{
    let auditLog = Log.find({}).then((doc)=>{
        res.send(doc);
    });
});

module.exports = router;
