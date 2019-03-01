const express = require('express');
const router = express.Router();
const _ = require('lodash');
const multer = require('multer');
const bcrypt = require('bcrypt');

const {Admin} = require ('../models/admin');
const {ObjectId} = require('mongodb');
const {authenticate} = require('../../middleware/authenticate');

const upload = multer({ dest: 'uploads/' }); // configure multer



router.post('/profile', upload.single('image'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  if(!req.file){
    console.log("req.file:", req.file);
    return res.status(204).send({Error: "Upload was not successful!"});
  }

  console.log("req.file:", req.file);
  console.log("req.files:", req.files);
  res.status(200).send(req.file);

});

// Home route 
// Ask what should the home route point to? 
// The login Page?
router.get('/', (req, res) => {
    res.send({type: "WELCOME TO HOME LOGIN"});
});

// GET route read all admins
router.get('/admins',authenticate,(req, res) => {
    Admin.find().then(doc => { 
      res.send(doc);
    });
},
(e) => {
  res.status(404).send();
}
);


// Registration form Route
router.get('/register', (req, res)=> {
    res.render('/admins');
});

// POST Route onboard admin
router.post('/admins',authenticate, (req, res) => {

    let body = _.pick(req.body, ['firstname', 'lastname', 'username', 'email', 'phone', 'role']);
    let admin = new Admin(body);

    admin.save().then(() => { // save the admin instance 
        return admin.generateToken(); // save the admin instance
    }).then((token) => { // pass pass the token as the value of the custom header 'x-auth' and send header with the newly signed up admin.
        // let admin =  _.pick(req.body, ['firstname', 'lastname', 'username', 'email', 'phone', 'role']);
        res.header('x-auth', token).send(admin);
    }).catch((e) => {
        res.status(400).send(e);
    });
});


// Route that returns a single admin and its token
router.get('/admins/me',authenticate, (req, res) => {
    res.send(req.admin);
});

// signin/login route
router.post('/admins/login',authenticate, (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    Admin.findByCredentials(body.email, body.password).then((admin)=> { 
        return admin.generateToken().then((token)=> {
            return res.header('x-auth', token).send(admin);
        });
    }).catch((e)=> {
        res.status(400).send();
    })
});

// signout/logout route
router.delete('/admins/logout',authenticate, (req, res)=>{
  req.admin.removeToken(req.token).then(()=>{
    res.status(200).send();
  }, ()=>{
    res.status(400).send();
  })
});


// GET :id Route to get single admin
router.get('/admins/:id',authenticate, (req, res) => {
    // destructure the req.params object to get the object id.
    let id = req.params.id;

    // checks if the object is valid
    if(!ObjectId.isValid(id)) {
        res.status(404).send();
    }

    // find the admin by id.
    Admin.findById(id).then((doc)=> {
        // if admin is not found return error 404 otherwise send the admin.
        doc ? res.send(doc) : res.status(404).send();
    }).catch((e)=>{
        res.status(400).send();
    })

});

// PATCH Route Update admin
router.patch('/admins/:id',authenticate, (req, res) => {
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
        console.log("The doc:", doc);
        console.log("The doc password", doc.password);
        console.log("The doc username:", doc.username);

        let saltRounds = 10;
        let Password = doc.password;
        let hash = bcrypt.hashSync(Password, saltRounds);
        doc.password = hash;
        doc.save();
        console.log("The doc password", doc.password);
        console.log("The hash is:", hash);

        Admin.findById(id).then(doc=>{
            res.send(doc);
        })
        
    }).catch((e)=>{
        res.status(400).send();
    });
    
});

// DELETE Route delete admin
router.delete('/admins/:id',authenticate, (req, res) => {
    // get the admin id
    let id = req.params.id;
    // validate the company id
    if(!ObjectId.isValid(id)){
        res.status(400).send();
    }
    // query to find admin and delete
    Admin.findByIdAndDelete(id).then((doc)=>{

        if(!doc){ // if doc is not found return error 404.
            res.status(404).send();
        }

        console.log(id, doc);
        res.send(doc); // return the deleted doc (admin) if found and deleted
    }).catch((e)=>{
        res.status(400).send();
    });
});

module.exports = router;
