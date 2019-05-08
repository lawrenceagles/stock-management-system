const express = require('express');
const router = express.Router();
const _ = require('lodash');
const multer = require('multer');
const bcrypt = require('bcryptjs');

const {Admin} = require ('../models/admin');
const {Company} = require('../models/company');
const {User} = require("../models/user");
const {Log} = require ('../models/audit_Trail');
const {Notifcations} = require('../models/notifications');
const {ReplyNotification} = require('../models/notifications')
const {ObjectId} = require('mongodb');
const {authenticate} = require('../../middleware/authenticate');
const {sendToMultiple,sendWelcomePasswordEmail,deleteAccountEmail, sendUpdatePasswordEmail, sendToOne} = require("../../config/emails/emailAuth");
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
        return res.status(400).json({Message:`${e}`});
      });
  }).catch(e=>{
    return res.status(400).json({Message:`${e}`});
  })
},(error, req, res, next) => {
    return res.status(400).json({ error: `${error.message}` });
});


// route to upload an image
router.delete('/upload/profile/image',authenticate,(req,res)=>{
  req.admin.avatar = undefined;
    req.admin.save().then(doc=>{
      return res.json({Message:"Image Successfully Deleted"});
    }).catch(e=>{
      return res.status(400).json({Message:`${e}`});
    })
},(error, req, res, next) => {
    return res.status(400).json({ error: `${error.message}` });
});


router.get('/admin/profile/image',authenticate,(req,res)=>{
  let id = req.admin._id;
  admin.findById(id).then(admin=>{
    if(!admin || !admin.avatar){
      throw new Error;
    }
    res.set('Content-Type', 'image/png');
    return res.send(admin.avatar); // send the admin avatar.
  }).catch(e=>{
    return res.status(404).json({Message:`${e}`});
  })
},(error, req, res, next) => {
    return res.status(400).json({ error: `${error.message}` })
});

// GET route get all admins
router.get('/admin',authenticate,(req, res) => {
    Admin.find({}).then(admins=>{
      if(admins.length < 1){
        return res.json({Message:"No admin found"});
      }
      res.send(admins);
    }).catch(400).json({Message:`${e}`});
    }
);

// SORT find by role
router.get('/admin/role/:role',authenticate,(req, res)=>{
    let role = req.params.role
    Admin.find({role}).then(docs=>{

        if(docs.length === 0){
            return res.status(404).json({Message: `No ${role} admin found`});
        }

        return res.send(docs);

    })
    .catch((e)=>{
        return res.status(400).json({Message:`${e}`});
    })
})

// POST Route onboard admin
router.post('/admin',authenticate,(req, res) => {
    const { firstname, lastname, username, email,phone,role} = req.body
    if(firstname.trim()!==''&& lastname.trim() !=='' && username.trim()!=='' && email.trim()!=='' && phone.trim() !==''&& role.trim()!==''){
    // pick out fields to set and from req.body
    let body = _.pick(req.body, ['firstname', 'lastname', 'username', 'email', 'phone', 'role', 'password']);
    console.log(body)
    Admin.findByEmail(body.email).then(doc=>{ // handle already registered admin
        if(doc){
            return Promise.reject();
        }
    })
    .catch((e)=>{
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
        return res.status(201).send(doc);
    });
    }
    else{
        res.status(400).json({
            Message:'All feilds are required'
        })
    }
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
            return res.status(201).json(`New password generated`);
        }).catch(e=>{
            return res.status().json({Message:`${e}`})
        })

    }).catch(e=>{
        return res.status(304).json({Message:`${e}`});
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
                firstname:admin.firstname,
                lastname:admin.lastname,
                role:admin.role,
                token
            });
        });
    }).catch((e)=> {
        return res.status(400).json({Message: `${e}`});
    })
});

// signout/logout route
router.delete('/admin/logout',authenticate, (req, res)=>{
  req.admin.removeToken(req.token).then(()=>{
    deleteAccountEmail(req.admin.email, req.admin.firstname, req.admin.lastname);
    return res.status(200).json({Message:"You have successfully logged out"});
  }, ()=>{
    return res.status(400).json({Message:"Error logging out"});
  })
});

// signout/logout route
router.delete('/admin/destroytoken', (req, res)=>{
    let email = req.body.email;
    let token = req.header('x-auth'); // grap token from header
    Admin.findOne({email}).then(admin=>{
    if(!admin){
        return res.status(404).json({Message:"Incorrect email"});
    }

    admin.removeToken(token).then(()=>{ // delete token from admin
        // send admin delete account email
        deleteAccountEmail(admin.email, admin.firstname, admin.lastname);
        return res.status(200).json({Message:"You have successfully logged out"});
      }, ()=>{
        return res.status(400).json({Message:"Error logging out"});
    })
    })
});


// GET :id Route to get single admin
router.get('/admin/:id',authenticate, (req, res) => {
    // destructure the req.params object to get the object id.
    let id = req.params.id;

    // checks if the object is valid
    if(!ObjectId.isValid(id)) {
        return res.status(400).json({Message:"Invalid ObjectId"});
    }

    // find the admin by id.
    Admin.findOne({_id:id}).then((doc)=> {

        // if admin is not found return error 404 otherwise send the admin.
        if(!doc){
          return res.status(404).json({Message:"No admin found"});
        }
        return res.send(doc);
    }).catch((e)=>{
        return res.status(400).json({Message: `${e}`});
    })

});

// PATCH Route Update admin
router.patch('/admin/:id',authenticate, (req, res) => {
    // get the admin id
    let id = req.params.id;
    // pickout only what you want to grant the admin permission to update
    if(req.body.password){
        const salt = bcrypt.genSaltSync(12);
        const hash = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hash;
    }
    let body = _.pick(req.body, ["firstname", "lastname", "username", "password", "email", "phone", "role"]);
    // validate the id
    if(!ObjectId.isValid(id)){
        return res.status(400).json({Message: "Invalid ObjectId"});
    }

    // find and update the admin by id if it is found, throw error 404 if not
   Admin.findOneAndUpdate({_id:id}, {$set:body}, {new:true, runValidators:true}).then(admin=>{
        // check if admin was foun and updated
        if(!admin){
            return res.status(404).json({Message: "Admin document not found."});
        }
        return res.status(200).json({Message: "User password updated Successfully"});
    }).catch(e=>{
        return res.status(400).json({Message: `${e}`});
    })

});

// DELETE Route delete admin
router.delete('/admin/:id',authenticate, (req, res) => {
    // get the admin id
    let id = req.params.id;
    // validate the company id
    if(!ObjectId.isValid(id)){// validate ObjectId
        return res.status(400).json({Message: "Invalid ObjectId"});
    }
    // query to find admin and delete
    Admin.findByIdAndDelete(id).then((doc)=>{// find and delete admin

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

        return res.json({Message: "Admin succefully deleted"});
    }).catch((e)=>{
        return res.status(400).json({Message:`${e}`});
    });
});

// Audit Trail Route
router.get('/audit', (req, res)=>{
    Log.find({}).then((doc)=>{
        return res.send(doc);
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
        return res.send(admin.receivedNotifications);
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
        return res.send(admin.sentNotifications);
    })
})

// POST ROUTE SEND NOTIFICATION FROM ADMIN TO ONE USER
router.post('/notification',authenticate, (req, res)=>{
    let receiverEmail = req.body.email;
    req.body.onSenderModel = 'Admin'; // set the refPath
    req.body.onReceiverModel = 'User'; // set the refPath
    req.body.username = req.admin.username;
    req.body.sender = req.admin._id;


    User.findOne({email:receiverEmail}).then(user=>{// find user by email given
        if(!user){// handle user not found
            return res.status(404).json({Message: "error no user found"});
        }
        let message = req.body;
        message.receiver = [user._id];
        let sentMessage = new Notifcations(message);
        sendToOne(user.email, user.firstname, user.lastname, req.body.message); // send this notification by email also

        sentMessage.save().then(message=>{
            return res.status(200).send(message);
        }).catch(e=>{// handle error caught
            return res.status(400).json(`${e} Error with the route`);
        });
    }).catch(e=>{
        return res.status(404).json({Message: `${e}`});
    });
})

// PATCH reply a user message
router.patch('/admin/notification/:notificationid',authenticate, (req, res)=>{
    const notificationID = req.params.notificationid;
    let admin = req.admin;
    let reply = req.body;
    let receiverEmail = reply.email;
    reply.onSenderModel = 'Admin'; // set the refPath
    reply.onReceiverModel = 'User'; // set the refPath
    reply.username = req.admin.username;
    reply.sender = admin._id;

    if(!ObjectId.isValid(notificationID)){// handle invalid ObjectId
      return res.json({Message: "Invalid ObjectId"});
    }

    Notifcations.findById(notificationID).then(notification=>{// find the message to reply by id
      let receiver = notification.sender; // get the user id
      reply.receiver = [receiver];

      if(!ObjectId.isValid(receiver)){// handle invalid ObjectId
        return res.json({Message: "Invalid ObjectId"});
      }

      User.findById(receiver).then(user=>{ // find user with email given
          if(!user){// handle wrong usesr emails
              return res.status(404).json({Message: "error no user with that email in database"});
          }

            let receiverEmail = user.email;
            let receiver =  user._id;

          sendToOne(user.email, user.firstname, user.lastname, reply.message); // send this notification by email also

          notification.save().then(doc=>{ // save the updated notification
              return res.send(doc);
          }).catch(e=>{// handle any error caught
              return res.status(400).json({Message: `${e}`});
          });

          // res.send(doc);
      }).catch(e=>{
          return res.status(400).json({Message: `${e}`});
      });

    }).catch(e=>{
        return res.status(400).json({Message: `${e}`});
    });
})

// POST ROUTE SEND NOTIFICATION FROM ADMIN TO ALL USERS IN A COMPANY
router.post('/notification/:companyid',authenticate, (req, res)=>{
    let id = req.params.companyid;
    req.body.onSenderModel = 'Admin'; // set the refPath
    req.body.onReceiverModel = 'User'; // set the refPath
    req.body.username = req.admin.username;

    if(!ObjectId.isValid(id)){// validate company id
        return res.json({Message:`Invalid company ID`});
    }
    Company.findById(id).then(company=>{// find the user company with id
        if(!company){// handle user not found
            return res.status(404).json({Message:"No company found"});
        }
        company.populate({
            path: 'staffs'
        })
        .execPopulate()
        .then(company=>{
            if(company.staffs.length < 0){
                return res.status(404).json({Message:"No scheme member for this company"})
            }

            let usersArr = company.staffs;
            let receiversEmail = _.map(usersArr, 'email');
            let receiverID =  _.map(usersArr, 'id');
            let sentMessage = new Notifcations({// create notification
                ...req.body,
                sender:req.admin._id,
                receiver: receiverID
            });
            sendToMultiple(receiversEmail, req.body.message); // send this notification by email also
            sentMessage.save().then(doc=>{
                return res.status(200).send(doc);
            }).catch(e=>{
                return res.status(400).json({Message: `${e}`});
            });
        });
    }).catch(e=>{ // catch any errors
        return res.status(404).json({Message:`${e}`});
    });
})

module.exports = router;
