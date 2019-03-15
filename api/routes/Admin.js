const express = require('express');
const router = express.Router();
const _ = require('lodash');
const multer = require('multer');
const bcrypt = require('bcryptjs');

const {Admin} = require ('../models/admin');
const {User} = require("../models/user");
const {Log} = require ('../models/audit_Trail');
const {Notifcations} = require('../models/notifications');
const {ObjectId} = require('mongodb');
const {authenticate} = require('../../middleware/authenticate');
const {sendWelcomePasswordEmail,deleteAccountEmail, sendUpdatePasswordEmail} = require("../../config/emails/emailAuth");
const {genRandomPassword} = require('../../config/genPassword.js');

const upload = multer({ dest: 'uploads/' }); // configure multer



router.post('/profile', upload.single('image'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  if(!req.file){
    return res.status(204).send({Error: "Upload was not successful!"});
  }
  res.status(200).send(req.file);

});

// GET route get all admins
router.get('/admin',authenticate,(req, res) => {
    let options =  {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 3
    }

    Admin.find()
        .skip(options.page * options.limit)
        .limit(options.limit)
        .exec()
        .then(doc => { 
        res.send(doc);
    });
    },

    (e) => {
      res.status(404).send();
    }
);

// SORT find by role
router.get('/admin/role/:role',  (req, res)=>{
    let role = req.params.role
    Admin.find({role}).then(docs=>{

        if(docs.length === 0){
            return res.status(404).send(`No ${role} admin found`);
        }

        res.send(docs);

    })
    .catch((e)=>{
        res.status(400).send();
    })
})

// POST Route onboard admin
router.post('/admin',authenticate, (req, res) => {
    // pick out fields to set and from req.body
    let body = _.pick(req.body, ['firstname', 'lastname', 'username', 'email', 'phone', 'role', 'password']);
    body.username = body.username.toLowerCase(); // change user name to lowercase

    Admin.findByEmail(body.email).then(doc=>{ // handle already registered admin
        if(doc){
            return Promise.reject();
        }
    }).catch((e)=>{
        return res.status(400).send("Admin already exists");
    })

    // Auto generate random password for admin
    body.password = genRandomPassword(10);

    let admin = new Admin(body);

    // send welcome email containing password
    sendWelcomePasswordEmail(body.email,body.firstname,body.lastname,body.password);

    let log = new Log({
        action: `Created a new admin`,
        createdBy: `${req.admin.lastname} ${req.admin.firstname}`,
        user: `${admin.firstname} ${admin.lastname}`
    });

    log.save();

    admin.save().then(doc=>{
        res.send(doc);
    });
});

// forgot Password Request Route
router.patch('/admin/forgetpassword', (req,res)=>{
    Admin.findOne({email:req.body.email}).then(admin=>{
        if(!admin){// handle if the user with that email is not found
            return res.status(404).send("Error this admin does not exists in our database");
        }

        // handle user is logged in
        if(admin.tokens.length > 0){
            return res.status(400).send("Error you have to be logged out to make this request");
        }

        // generate a new secure random password for the client
        randomPassword = genRandomPassword(15);

        // send email with link to update password.
        sendUpdatePasswordEmail(admin.email, admin.firstname, admin.lastname, randomPassword);

        let hashpassword = bcrypt.hashSync(randomPassword, 10);          

        // update the user password
        admin.password = hashpassword;

        // save admin with new password
        admin.save().then(doc=>{
            res.status(200).send(`new password successfully regenerated.`);
        }).catch(e=>{
            return res.status().send(`Failed to update password with error ${e}`)
        })
        
    }).catch(e=>{
        return res.status(400).send(`Error {e} occured in the update password process. Please try again`);
    })
});

// signin/login route
router.post('/admin/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    Admin.findByCredentials(body.email, body.password).then((admin)=> { 

        if(admin.tokens.length > 0){
            return res.send("You are already Logged in");
        }

        return admin.generateToken().then((token)=> {
            return res.header('x-auth', token).send({
                id: admin._id,
                username: admin.username,
                role:admin.role,
                token
            });
        });
    }).catch((e)=> {
        res.status(400).send(e,"not working");
    })
});

// signout/logout route
router.delete('/admin/logout',authenticate, (req, res)=>{
  req.admin.removeToken(req.token).then(()=>{
    deleteAccountEmail(req.admin.email, req.admin.firstname, req.admin.lastname);
    res.status(200).send("You have successfully logged out");
  }, ()=>{
    res.status(400).send("Error logging out");
  })
});


// GET :id Route to get single admin
router.get('/admin/:id',authenticate, (req, res) => {
    // destructure the req.params object to get the object id.
    let id = req.params.id;

    // checks if the object is valid
    if(!ObjectId.isValid(id)) {
        res.status(400).send("Invalid ObjectId");
    }

    // find the admin by id.
    Admin.findOne({_id:id}).then((doc)=> {

        // if admin is not found return error 404 otherwise send the admin.
        doc ? res.send(doc) : res.status(404).send("No admin found");
    }).catch((e)=>{
        res.status(400).send("Error: Something is wrong with the route");
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

        if(req.password !== doc.password){
            let password = doc.password;
            let saltRounds = 10;
            let hash = bcrypt.hashSync(password, saltRounds);
            doc.password = hash;
        }

        doc.save();

        Admin.findById(id).then(doc=>{
            let log = new Log({
                action: `$Edited an admin profile`,
                createdBy: `${req.admin.lastname} ${req.admin.firstname}`,
                user: `${doc.firstname} ${doc.lastname}`
            });

            log.save();
            res.send(doc);
        })
        
    }).catch((e)=>{
        res.status(400).send(e, "Error update error");
    });
    
});

// DELETE Route delete admin
router.delete('/admin/:id',authenticate, (req, res) => {
    // get the admin id
    let id = req.params.id;
    // validate the company id
    if(!ObjectId.isValid(id)){
        return res.status(400).send();
    }
    // query to find admin and delete
    Admin.findByIdAndDelete(id).then((doc)=>{

        if(!doc){ // if doc is not found return error 404.
            return res.status(404).send("This user is not in the database");
        }

        let log = new Log({
            action: `Deleted an admin profile`,
            createdBy: `${req.admin.lastname} ${req.admin.firstname}`,
            user: `${doc.firstname} ${doc.lastname}`
        });

        log.save();

        deleteAccountEmail(doc.email, doc.firstname, doc.lastname); // send accound cancellation email to admin

        return res.send("Admin succefully deleted"); // return the deleted doc (admin) if found and deleted
    }).catch((e)=>{
        res.status(400).send();
    });
});

// Audit Trail Route
router.get('/audit', (req, res)=>{
    const sort = {}

    let options =  {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    Log.find({})
    .skip(options.page * options.limit)
    .limit(options.limit)
    .sort(sort)
    .exec()
    .then((doc)=>{
        res.send(doc);
    });
});

// GET ROUTE VIEW ALL NOTIFICATIONS
router.get('/notification',authenticate, (req,res)=>{
    // get the admin id from req.admin._id
    // Notifcations.find({sender: req.admin._id}).then(doc=>{
    //     if(!doc){
    //         return res.status(404).send("Error: No notification found")
    //     }
    //     res.send(doc);
    // }).catch(e=>{
    //     res.status(400).send("Error: problem with route")
    // }) 
    
    const sort = {}
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    
    let admin = req.admin;
        admin.populate({
            path: 'sentNotifications',
            sort
        })
        .execPopulate()
        .then(doc=>{
            res.send(admin.sentNotifications);
        })
})

// POST ROUTE SEND NOTIFICATION FOR ADMIN
router.post('/notification',authenticate, (req, res)=>{
    let receiverEmail = req.body.email;
    req.body.onSenderModel = 'Admin'; // set the refPath 
    req.body.onReceiverModel = 'User';

    User.findOne({email:receiverEmail}).then(doc=>{

        if(!doc){
            return res.status(404).send("error no user found");
        }

        new Notifcations({
            ...req.body,
            sender:req.admin._id,
            receiver:[doc._id]
        }).save().then(doc=>{
            res.status(201).send(doc);
        }).catch(e=>{
            res.status(400).send("Error with the route");
        });

        // res.send(doc);
    }).catch(e=>{
        res.status(404).send("Error no receiver like this in database");
    });
})

module.exports = router;
