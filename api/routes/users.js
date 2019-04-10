const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer =  require('multer');
const sharp = require('sharp');
const _ = require('lodash');
const path = require("path");
const cron = require('node-cron');
const bcrypt = require('bcryptjs');
const {ObjectId} = require('mongodb');

const {sendToMultiple,sendUserWelcomePasswordEmail,sendWelcomePasswordEmail,deleteAccountEmail, sendUpdatePasswordEmail, sendToOne} = require("../../config/emails/emailAuth");
const {genRandomPassword} = require('../../config/genPassword.js');
const {authenticateUser} = require('../../middleware/authenticateUser');
const {authenticate} = require('../../middleware/authenticate');
const {User} = require("../models/user");
const {Admin} = require("../models/admin.js");
const {Notifcations} = require('../models/notifications');
const {Company} = require('../models/company');
const {Batch} = require('../models/batch');
const {Log} = require ('../models/audit_Trail');


// cron functions
const vestingDateAuto = (today)=>{
	console.log(`running a task every minute at ${today}`);
}

// vesting function with cron job
vestShares = function(vestingDate, vestingPeriod){
  // Cron Jobs
  cron.schedule('* * * * *', () => {
    vestingDateAuto(vestingDate);
  });
}





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
router.post('/upload/user/profile/image',authenticateUser,upload.single('avatar'),(req,res)=>{
  let buffer = sharp(req.file.buffer)
    .resize({width: 400, height: 400})
    .png()
    .toBuffer()
    .then(sharpImage=>{
      req.user.avatar = sharpImage; // set user avater to sharp Image
      req.user.save().then(image=>{ // save user avatar
      return res.json({Message:"Image Successfully Uploaded"});
      }).catch(e=>{
        return res.status(400).json({Message:`${e}`});
      });
  }).catch(e=>{
    return res.status(400).json({Message:`${e}`});
  })
});


// route to upload an image
router.delete('/upload/user/profile/image',authenticateUser,(req,res)=>{
  req.user.avatar = undefined;
    req.user.save().then(doc=>{
      return res.json({Message:"Image Successfully Deleted"});
    }).catch(e=>{
      return res.status(400).json({message:`${e}`});
    })
});


router.get('/user/profile/image',authenticateUser,(req,res)=>{
  let id = req.user._Id;
  User.findById(id).then(user=>{
    if(!user || !user.avatar){
      throw new Error;
    }
    res.set('Content-Type', 'image/png');
    return res.send(user.avatar); // send the user avatar.
  }).catch(e=>{
    return res.status(404).json({Message:`${e}`});
  })
},(error, req, res, next) => {
    return res.status(400).json({ error: `${error.message}` })
});

//read user info
 router.get('/users',authenticate,(req,res,next)=>{
    const sort = {}
    let pageOptions = {
        page: req.query.page || 0,
        limit: req.query.limit || 10
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    User.find()
        .skip(pageOptions.page*pageOptions.limit)
        .limit(pageOptions.limit)
        .sort(sort)
        .exec( (err, doc)=>{
            if(err) { res.status(500).json(err); return; };
            return res.status(200).send(doc);
        })
},(error, req, res, next) => {
    return res.status(400).json({ error: `${error.message}` })
})

//find one user
router.get("/user/:id",authenticateUser,(req,res,next)=>{
    let id = req.params.id;
    // checks if the object is valid
    if(!ObjectId.isValid(id)) {
        res.status(400).json({Message:`Error: Please enter a valid Object ID`});
    }


     User.findById(id).then((user)=> {
        // if user is not found return error 404 otherwise send the admin.
        if(!user){
          res.status(404).json({Message:"User not found"});
        }

        let companyID = user.company;
        Company.findById(companyID).then(company=>{
            res.send({
                user,
                companyname: company.name,
                companyCanBuy: company.canBuyShares,
                comapanyCanSell: company.canSellShares,
                companyCanCollacterize: company.canCollateriseShares,
                vestingSchedule: company.vestingSchedule
            });
        }).catch(e=>{
          res.status(400).json({Message:`${e}`});
        })
    }).catch((e)=>{
        res.status(400).json({Message:`${e}`});
    })
 },(error, req, res, next) => {
    return res.status(400).json({ error: `${error.message}` })
})


// delete a user
router.delete('/user/:id',authenticate, (req,res,next)=>{   //delete
    const id = req.params.id

      // Validate the user id
      if(!ObjectId.isValid(id)){
          return res.status(400).json({Message:"invalid ObjectId"});
      }

      User.findOneAndDelete({_id:id})
       .then(user=>{
        if(!user){
          return res.status(404).json({Message:"User not found"});
        }

        let companyID = user.company;

          let log = new Log({
              createdBy: `${req.admin.lastName} ${req.admin.firstName}`,
              action: `deleted a user`,
              user: `${user.firstName} ${user.lastName}`,
              company: `${user.Company_Name}`
          });

          Company.findById(companyID).then(company=>{

            // Validate company id
            if(!Objectid.isValid(companyID)){
              return res.json({Message:"Invalid company ID"});
            }

            if(!company){// handle company not found
              return res.json({Message:"Company not found"});
            }

            // decrease company total scheme members by 1 and delete user id in each batch
            company.totalSchemeMembers -= 1;

            //  find all the batch in user company
            Batch.find({company:user.company}).then(batches=>{
              _.remove(batches, function(b){
                  return b == user._id;
              })

              batch.save();

            }).catch(e=>{
              return res.status(400).json({Message:`${e}`});
            })

            if(user.status){ // run this if the user is a confirmed staff of the company
                batches.forEach(function(batch){
                  let cBatch = batch.allocatedShares;
                  let userBatches = user.batch;
                  userBatches.forEach(function(uBatch){
                    cBatch -= uBatch.allocatedShares; // dynamically generate total allocated to batch scheme
                  })
                })
              }else{ // run this if the user is an unconfirmed staff of the company
                // update total allocated shares to unconfirmed scheme members
                let userBatches = user.batch;
                  userBatches.forEach(function(uBatch){
                    company.totalSharesOfUnconfirmedSchemeMembers -= uBatch.allocatedShares;
                  })
            }
            // update total unallocated shares
            company.totalUnallocatedShares = (company.totalSharesAllocatedToScheme - company.totalSharesAllocatedToSchemeMembers) + company.totalSharesOfUnconfirmedSchemeMembers;
            // updated forfieted shares
            company.totalSharesForfieted = company.totalSharesAllocatedToSchemeMembers - vestedShares;
            // company.totalSharesRepurchased = vestedShares;
            company.save(); // save to store data

          }).catch(e=>{
            return res.status(400).json({message:`${e}`})
          })

          log.save(); // save audit log
          deleteAccountEmail(user.email, user.firstname, user.lastname); // send accound cancellation email to admin
          return res.json({Message: "User is deleted"});
       }).catch(e=>{
        return res.status(400).json({Message: `${e}`});
       })
   })

//Update user information
router.patch('/user/:id',authenticateUser, (req, res) => {
    // get the user id
    let id = req.params.id;
    // validate the id
    if(!ObjectId.isValid(id)){
        return res.status(400).json({Message:"Invalid ObjectId"});
    }

    if(req.body.password){
        const salt = bcrypt.genSaltSync(12);
        const hash = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hash
    }

    // find and update the user by id if it is found, throw error 404 if not
    User.updateOne({_id:id}, {$set:req.body}, { new: true, runValidators: true  }).then((user)=>{
        // check if user was foun and updated
        if(!user){
            return res.status(404).json({Message: "No user found"});
        }

        return res.json({Message:"user updated Successfully"});

    }).catch((e)=>{
        return res.status(400).json({Message:`${e}`});
    });

});

// find all the company members by id.
router.get("/:companyid/users",authenticate,(req, res, next) => {
    let companyID = req.params.companyid;

    // confirm that object ID is valid
    if(!ObjectId.isValid(companyID)){
      return res.status(400).json({Message:`Error: The Company Object ID is not valid`});
    }

    User.find({company:companyID}).then(users=>{
      if(!users){
        return res.status(404).json({message:`No user was found in this company`});
      }

      return res.send(users);

    }).catch(e=>{
      return res.status(400).json({Message:`${e}`});
    })

})

// find one company members by username
router.get("/:companyid/companystaff",authenticate,(req, res, next) => {
    let companyID = req.params.companyid; // get company id from url
    let username = req.query.username; // get username from search form

    // confirm that object ID is valid
    if(!ObjectId.isValid(companyID)){
      return res.status(400).json({Message:`Error: The Company Object ID is not valid`});
    }

    User.findOne({username, company:companyID}).then(user=>{
      if(!user){
        return res.status(404).json({Message:`No user was found in this company`});
      }

      return res.send(user);

    }).catch(e=>{
      return res.status(400).json({Message:`${e}`});
    });
})


//create new user
router.post("/:companyid/users",authenticate,(req, res, next) => {
    let id = req.params.companyid
    // validate the company id
    if(!ObjectId.isValid(id)){
        return res.status(400).json({Message:"Error invalid ObjectId"});
    }

    let email = req.body.email;
    let employee_number = req.body.employee_number;

    Company.findById(id).then(company=>{
      if(!company){
        return res.status(404).json({Message:"Error No company was selected. Wrong company ID"});
      }

      User.find({employee_number, email}).then(doc=>{
        if(doc.length > 1){
          return res.status(400).json({Message:"This user already exists in this company"});
        }

          req.body.company = id;
          req.body.companySchemerules = company.schemeRules;
          req.body.currentShareValue = company.currentShareValue;

          // Auto generate random password for admin
           req.body.password = genRandomPassword(10);

        // create the user
        let user = new User(req.body);

        // send welcome email containing password
        sendUserWelcomePasswordEmail(user.email,user.firstName,user.lastName,user.password);

        // log audit trail
        let log = new Log({
            createdBy: `${req.admin.lastName} ${req.admin.firstName}`,
            action: `created a new user`,
            user: `${user.firstName} ${user.lastName}`,
            company: `${user.Company_Name}`
        });

        log.save();

        user.save().then(user=>{ // Return the user doc and update user-company data relationship
          // increase company total scheme members by 1
          company.totalSchemeMembers += 1;
          company.save();

          let body = _.pick(user, ['firstname', 'lastname', 'email','Company_Schemerules','company','status','tokens']);
          return res.status(201).send(body);

        }).catch(e=>{
          return res.status(400).json({Message:`${e}`});
        });

      }).catch(e=>{
          return res.status(400).json({Message:`${e}`});
      });

    });
})

// get all the batch a user belongs to
router.get("/user/batch/:id",authenticate, (req,res)=>{
  let id = req.params.id; // get user id
  // validate the company id
  if(!ObjectId.isValid(id)){
      return res.status(400).json({Message:"Error invalid ObjectId"});
  }

  // find user
  User.findById(id).then(user=>{ // find the user by id
    if(!user){ // handle user not found
      return res.status(404).json({Message: "Error user not found."});
    }

    const companyID = user.company; // grab the user company id
    let userBatches = [];
    Batch.find({comany:companyID}).then(batches=>{ // find all the company batches
      let batchMembers = batches.members;
      userBatches = batches.filter(batch=>{ // filter through the company batches and return the onces that conatains the user id
        return batchMembers.includes(id) == true;
      });
    }).catch(e=>{
      return res.status(400).json({Message:`${e}`});
    });

    return res.send(userBatches); // return the array of all the batch a user belongs to

  }).catch(e=>{
    return res.status(400).json({Message:`${e}`});
  });
});

// Add user to batch
router.patch("/company/batch/user/:id",authenticate, (req,res)=>{
  const ID = req.params.id;
  // validate the company id
  if(!ObjectId.isValid(ID)){
      return res.status(400).json({Message:"Error invalid ObjectId"});
  }

  User.findById(ID).then(user=>{ // get user to add to batch by id
        const companyID = user.company;
        Company.findById(companyID).then(company=>{ // find the user company by id
          let addToBatch;
          company.batch.map(batch=>{
             if(batch == req.body.batchID){
                addToBatch = batch;
             }
          })
          Batch.findById(addToBatch).then(batch=>{ // find the company batch by id
            if(!batch){
              return res.status(404).json({Message: "No batch found"});
            }

           if( batch.members.indexOf(user._id) >= 0 ){
              return res.status(400).json({Message: "user already added to batch"});
           }
            req.body.name = batch.name;
            user.batch = user.batch.concat([req.body]); // add batch data to user
            batch.members = batch.members.concat([user._id]); // onboard user to batch by passing id to batch members

            if(user.status){ // run this if the user is a confirmed staff of the company
                // updated total shares allocated to scheme members
                batch.allocatedShares += req.body.allocatedShares; // dynamically generate total allocated to batch scheme
              }else{ // run this if the user is an unconfirmed staff of the company
                // update total allocated shares to unconfirmed scheme members
                company.totalSharesOfUnconfirmedSchemeMembers += req.body.allocatedShares;
            }
            user.save();
            batch.save();
            company.save().then(doc=>{
              return res.json({Message: "User added to batch successfully"})
            })

          }).catch(e=>{
              return res.status(400).json({Message:`${e}`});
          });
      }).catch(e=>{
          return res.status(400).json({Message:`${e}`});
      });
  }).catch(e=>{
      return res.status(400).json({Message:`${e}`});
  });
})


// get all the dividends a user belongs to
router.get("/user/dividend/:id",authenticate, (req,res)=>{
  let id = req.params.id; // get user id
  // validate the company id
  if(!ObjectId.isValid(id)){
      return res.status(400).json({Message:"Error invalid ObjectId"});
  }

  // find user
  User.findById(id).then(user=>{
    let companyID = user.company;
    Dividend.find({comany:companyID}).then(dividends=>{
      if(dividends.length < 1){
        return res.status(404).json({Message:"No dividends have been given to this user"});
      }
      res.send(dividends);
    }).catch(e=>{
      return res.status(400).json({Message: `${e}`});
    })
  })
});

// User confirmation Route
router.patch('/userComfirmation/:id',authenticate,(req, res)=>{
  let id = req.params.id; // get user id
  // validate the company id
  if(!ObjectId.isValid(id)){
      return res.status(400).json({Message:"Error invalid ObjectId"});
  }

  findById(id).then(user=>{
    let companyID = user.company; // get company id
    Company.findById().then(company=>{
      user.userConfirmation(company).then(doc=>{
        return res.status(200).json({Message:"User has been confirmed"});
      });
    })
  })
})

// forgot Password Request Route
router.patch('/user/forgetpassword', (req,res)=>{
    User.findOne({email:req.body.email}).then(user=>{
        if(!user){// handle if the user with that email is not found
            return res.status(404).json({Message:"Error this user does not exists in our database"});
        }

        // generate a new secure random password for the client
        randomPassword = genRandomPassword(10);

        // send email with link to update password.
        sendUpdatePasswordEmail(user.email, user.firstname, user.lastname, randomPassword);

        let hashpassword = bcrypt.hashSync(randomPassword, 12);

        // update the user password
        user.password = hashpassword;

        // save user with new password
        user.save().then(doc=>{
            return res.status(200).json({Message:"new password successfully regenerated"});
        }).catch(e=>{
            return res.status(400).json({Message:`${e}`});
        })

    }).catch(e=>{
        return res.status(400).json({Message:`${e}`});
    })
});

// signin/login route
router.post('/user/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user)=> {
        return user.generateToken().then((token)=> {
            return res.header('x-auth', token).send({
                _id: user._id,
                email: user.email,
                company: user.company,
                Company_Schemerules: user.Company_Schemerules,
                tokens: user.tokens,
                status: user.status
            });
        });
    }).catch((e)=> {
        return res.status(400).json({Message: `${e}`});
    })
});

// signout/logout route
router.delete('/user/destroy/token', (req, res)=>{
    let email = req.body.email;
    let token = req.header('x-auth'); // grap token from header
    if(!token){// handle no token sent
      return res.json({Message: "Error no token was sent in the header"});
    }
    User.findOne({email}).then(user=>{
    if(!user){
        return res.status(404).json({Message:"Incorrect email"})
    }
    user.removeToken(token).then(()=>{ // delete token from user
        // send user delete account email
        deleteAccountEmail(user.email, user.firstName, user.lastName);
        return res.status(200).json({Message:"You have successfully logged out"});
      }, ()=>{
        return res.status(400).json({Message:"Error logging out"});
    })
    })
});

// GET ROUTE VIEW ALL NOTIFICATIONS
router.get('/user/sent/notification',authenticateUser, (req,res)=>{

    const sort = {}
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    let user = req.user;
    user.populate({
      path: 'sentNotifications',
      sort
    })
    .execPopulate()
    .then(doc=>{
        return res.send(user.sentNotifications);
    })
});


// GET ROUTE VIEW ALL NOTIFICATIONS
router.get('/user/received/notification',authenticateUser, (req,res)=>{

    const sort = {}
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    let user = req.user;
    user.populate({
      path: 'receivedNotifications',
      sort
    })
    .execPopulate()
    .then(doc=>{
        return res.send(user.receivedNotifications);
    })
});

// POST ROUTE SEND NOTIFICATION FOR user
router.post('/user/notification/',authenticateUser, (req, res)=>{
    let id = req.user._id;
    let receivers;
    let user = req.user;
    let companyID = user.company;
    req.body.onSenderModel = 'User'; // set the refPath
    req.body.onReceiverModel = 'Admin';
    req.body.username = req.user.username;

    Admin.find({}).then(adminArray=>{
        if(!adminArray){
            return res.status(404).json({Message:"error no user found"});
        }

        Company.findById(companyID).then(company=>{
          receivers =  _.map(adminArray, 'id');
          receiversEmail = _.map(adminArray, 'email');
          req.body.company = company;
          let sentMessage = new Notifcations({
              ...req.body,
              sender:user._id,
              receiver:receivers
          });

          sendToMultiple(receiversEmail, req.body.message); // send this notification by email also

          sentMessage.save().then(doc=>{
              return res.send(doc);
          }).catch(e=>{
              return res.status(400).json({Message:`${e}`});
          });
        })

        // res.send(doc);
    }).catch(e=>{
        return res.status(404).json({Message:`${e}`});
    });
})

// PATCH ROUTE SEND NOTIFICATION FOR user
router.patch('/user/notification/:notificationid',authenticateUser, (req, res)=>{
    let id = req.user._id;
    let receivers;
    let user = req.user;
    let companyID = user.company;
    const notificationID = req.params.notificationid;
    req.body.onSenderModel = 'User'; // set the refPath
    req.body.onReceiverModel = 'Admin';
    req.body.username = req.user.username;
    req.body.sender = req.user._id;

    if(!ObjectId.isValid(notificationID)){// handle invalid ObjectId
      return res.json({Message: "Invalid ObjectId"});
    }

    Admin.find({}).then(adminArray=>{
        if(!adminArray){
            return res.status(404).send("error no admin found");
        }

        Notifcations.findById(notificationID).then(notification=>{
          let receivers =  _.map(adminArray, 'id');
          let receiversEmail = _.map(adminArray, 'email');
          let reply = req.body;
          reply.receiver = receivers

          notification.reply = notification.reply.concat([reply]);

          sendToMultiple(receiversEmail,req.body.message); // send this notification by email also

          notification.save().then(doc=>{
              return res.send(doc);
          }).catch(e=>{
              return res.status(400).json({Message: `${e}`});
          });
        })

        // res.send(doc);
    }).catch(e=>{
        return res.status(400).json({Message: `${e}`});
    });
})

//logout
router.delete('/user/remove/user/token',authenticateUser, (req, res)=>{
    req.user.removeToken(req.token).then(()=>{

      return res.status(200).json({message:"Logout successfull"});
    }, ()=>{
      return res.status(400).json({Message:`${e}`});
    })

  });

module.exports = router;
