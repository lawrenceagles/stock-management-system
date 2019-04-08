const express = require('express');
const router = express.Router();
const _ = require('lodash');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const sharp = require('sharp');

const {Admin} = require ('../models/admin');
const {User} = require("../models/user");
const {Log} = require ('../models/audit_Trail');
const {Notifcations} = require('../models/notifications');
const {ObjectId} = require('mongodb');
const {authenticate} = require('../../middleware/authenticate');
const {sendWelcomePasswordEmail,deleteAccountEmail, sendUpdatePasswordEmail, sendToOne} = require("../../config/emails/emailAuth");
const {genRandomPassword} = require('../../config/genPassword.js');


// Set Multer
// Set Storage Engine
const upload = multer({
    limits: {
        fileSize: 5000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})


// route to upload an image
router.post('/upload/profile/image',authenticate,upload.single('avatar'),(req,res)=>{
  let buffer = sharp(req.file.buffer)
    .resize({width: 400, height: 400})
    .png()
    .toBuffer()
    .then(sharpImage=>{
      req.admin.avatar = sharpImage; // set admin avater to sharp Image
      req.admin.save().then(image=>{ // save admin avatar
        res.json({Message:"Image Successfully Uploaded"});
      }).catch(e=>{
        res.status(400).send(`${e}`);
      });
  }).catch(e=>{
    res.status(400).send(`${e}`);
  })
},(error, req, res, next) => {
    res.status(400).json({ error: `${error.message}` })
});


// route to upload an image
router.delete('/upload/profile/image',authenticate,(req,res)=>{
  req.admin.avatar = undefined;
    req.admin.save().then(doc=>{
      res.json({Message:"Image Successfully Deleted"});
    }).catch(e=>{
      res.status(400).send(`${e}`);
    })
},(error, req, res, next) => {
    res.status(400).json({ error: `${error.message}` })
});


router.get('/admin/profile/image',authenticate,(req,res)=>{
  let id = req.admin._id;
  admin.findById(id).then(admin=>{
    if(!admin || !admin.avatar){
      throw new Error;
    }
    res.set('Content-Type', 'image/png');
    res.send(admin.avatar); // send the admin avatar.    
  }).catch(e=>{
    res.status(404).send(`${e}`);
  })
},(error, req, res, next) => {
    res.status(400).json({ error: `${error.message}` })
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
router.get('/admin/role/:role',authenticate,(req, res)=>{
    let role = req.params.role
    Admin.find({role}).then(docs=>{

        if(docs.length === 0){
            return res.status(404).send(`No ${role} admin found`);
        }

        res.send(docs);

    })
    .catch((e)=>{
        res.status(400).send(`Error cannot get user ${e}`);
    })
})

// POST Route onboard admin
router.post('/admin',authenticate,(req, res) => {
    // pick out fields to set and from req.body
    let body = _.pick(req.body, ['firstname', 'lastname', 'username', 'email', 'phone', 'role', 'password']);
    Admin.findByEmail(body.email).then(doc=>{ // handle already registered admin
        if(doc){
            return Promise.reject();
        }
    }).catch((e)=>{
        return res.status(400).json({Message:"Admin already exists"});
    })

    // Auto generate random password for admin
    body.password = genRandomPassword(10);
    let admin = new Admin(body);

    let log = new Log({
        action: `Created a new admin`,
        createdBy: `${req.admin.lastname} ${req.admin.firstname}`,
        user: `${admin.firstname} ${admin.lastname}`
    });

    log.save();

    admin.save().then(doc=>{
        // send welcome email containing password
        sendWelcomePasswordEmail(body.email,body.firstname,body.lastname,body.password);
        res.status(201).send(doc);
    });
});

// forgot Password Request Route
router.patch('/admin/forgetpassword', (req,res)=>{
    Admin.findOne({email:req.body.email}).then(admin=>{
        if(!admin){// handle if the user with that email is not found
            return res.status(404).json({Message: "Email does not exist"});
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
            return res.status().json({Message:`Failed to update password with error ${e}`})
        })
        
    }).catch(e=>{
        return res.status(304).send(`Error {e} occured in the update password process. Please try again`);
    })
});

// signin/login route
router.post('/admin/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    Admin.findByCredentials(body.email, body.password).then((admin)=> { 
        return admin.generateToken().then((token)=> {
            return res.header('x-auth', token).send({
                id: admin._id,
                username: admin.username,
                role:admin.role,
                token
            });
        });
    }).catch((e)=> {
        res.status(400).json({Message: `${e}`});
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

// signout/logout route
router.delete('/admin/destroytoken', (req, res)=>{
    let email = req.body.email;
    let token = req.header('x-auth'); // grap token from header
    Admin.findOne({email}).then(admin=>{
    if(!admin){
        return res.status(404).send("Incorrect email")
    }

    admin.removeToken(token).then(()=>{ // delete token from admin
        // send admin delete account email
        deleteAccountEmail(admin.email, admin.firstname, admin.lastname);
        res.status(200).send("You have successfully logged out");
      }, ()=>{
        res.status(400).send("Error logging out");
    })
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
    if(req.body.password.length > 5){
        const salt = bcrypt.genSaltSync(12);
        const hash = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hash
    }
    let body = _.pick(req.body, ["firstname", "lastname", "username", "password", "email", "phone", "role"]);
    // validate the id
    if(!ObjectId.isValid(id)){
        res.status(400).send();
    }

    // find and update the admin by id if it is found, throw error 404 if not
   Admin.updateOne({_id:id}, {$set:body}, {new:true, runValidators:true}).then(admin=>{
        // check if admin was foun and updated
        if(!admin){
            res.status(404).json({Message: "Admin document not found."});
        }
        return res.status(200).json({Message: "User password updated Successfully"});
    }).catch(e=>{
        res.status(400).json({Message: `${e}`});
    })
    
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
            return res.status(404).json({Message:`This user is not in the database`});
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
router.get('/admin/received/notification',authenticate, (req,res)=>{    
    const sort = {}
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    
    let admin = req.admin;
        admin.populate({
        path: 'receivedNotifications',
        sort
    })
    .execPopulate()
    .then(doc=>{
        res.send(admin.receivedNotifications);
    })
})

// GET ROUTE VIEW ALL NOTIFICATIONS
router.get('/admin/sent/notification',authenticate, (req,res)=>{    
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

// POST ROUTE SEND NOTIFICATION FROM ADMIN TO ONE USER
router.post('/notification',authenticate, (req, res)=>{
    let receiverEmail = req.body.email;
    req.body.onSenderModel = 'Admin'; // set the refPath 
    req.body.onReceiverModel = 'User';
    req.body.username = req.admin.username;

    // find user company specific
    User.findOne({email:receiverEmail}).then(doc=>{

        if(!doc){
            return res.status(404).send("error no user found");
        }
        let sentMessage = new Notifcations({
                ...req.body,
                sender:req.admin._id,
                receiver: doc._id
            });

        sentMessage.save().then(doc=>{
            res.status(201).send(doc);
        }).catch(e=>{
            res.status(400).send(`${e} Error with the route`);
        });

        // res.send(doc);
    }).catch(e=>{
        res.status(404).send(`${e} Error no receiver like this in database`);
    });
})


// POST ROUTE SEND NOTIFICATION FROM ADMIN TO MANY USER
router.post('/notification/:companyid',authenticate, (req, res)=>{
    let receiverEmail;
    req.body.onSenderModel = 'Admin'; // set the refPath 
    req.body.onReceiverModel = 'User';
    req.body.username = req.admin.username;

    // find user company specific
    Company.findById(id).then(company=>{
        if(!ObjectId.isValid(id)){
            return res.send(`Invalid company ID`);
        }

        if(!company){
            return res.status(404).send("No company found");
        }

        company.find({}).then(usersArr=>{
            receiverID =  _.map(usersArr, 'id');
            let sentMessage = new Notifcations({
                ...req.body,
                sender:req.admin._id,
                receiver: receiverID
            });
        })

        sentMessage.save().then(doc=>{
            res.status(201).send(doc);
        }).catch(e=>{
            res.status(400).send(`${e} Error with the route`);
        });

        // res.send(doc);
    }).catch(e=>{
        res.status(404).send(`${e} Error no receiver like this in database`);
    });
})


module.exports = router;
