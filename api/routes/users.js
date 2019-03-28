const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer =  require('multer');
const _ = require('lodash');
const path = require("path");
const bcrypt = require('bcryptjs');

const {sendWelcomePasswordEmail,deleteAccountEmail, sendUpdatePasswordEmail, sendToOne} = require("../../config/emails/emailAuth");
const {genRandomPassword} = require('../../config/genPassword.js');
const {authenticateUser} = require('../../middleware/authenticateUser');
const {authenticate} = require('../../middleware/authenticate');
const {User} = require("../models/user");
const {Admin} = require("../models/admin.js");
const {Notifcations} = require('../models/notifications');
const {Company} = require('../models/company');
const {Log} = require ('../models/audit_Trail');
const {ObjectId} = require('mongodb');



// Set Multer
// Set Storage Engine
const upload = multer.diskStorage({
  limit:{
    fileSize: 3000000
  },
  fileFilter: (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png$/)){
       return cb(new Error("Please upload a image"));
    }
    cb(undefined, true);   
  }

});


// route to upload an image
router.post('/upload/profile/image',authenticateUser,(req,res)=>{
  req.user.avatar = req.file.buffer;
    req.user.save().then(doc=>{
      res.send("Image Successfully Uploaded");
    }).catch(e=>{
      res.status(400).send(`${e}`);
    })
});


// route to upload an image
router.delete('/upload/profile/image',authenticateUser,(req,res)=>{
  req.user.avatar = undefined;
    req.user.save().then(doc=>{
      res.send("Image Successfully Deleted");
    }).catch(e=>{
      res.status(400).send(`${e}`);
    })
});


router.get('/user/profile/image',authenticateUser,(req,res)=>{
  let req.user._Id = id;
  User.findById(id).then(user=>{
    if(!user || !user.avatar){
      throw new Error;
    }
    res.send(user.avatar); // send the user avatar.    
  }).catch(e=>{
    res.status(404).send(`${e}`);
  })
});


// find all the company members by id.
router.get("/:companyid/users",authenticate,(req, res, next) => {
    let companyID = req.params.companyid;

    // confirm that object ID is valid
    if(!ObjectId.isValid(companyID)){
      return res.status(400).send(`Error: The Company Object ID is not valid`);
    }

    User.find({company:companyID}).then(users=>{
      if(!users){
        return res.status(404).send(`No user was found in this company`);
      }

      return res.send(users);

    }).catch(e=>{
      res.status(400).send(`Error: ${e}`);
    })

})

// find one company members by username
router.get("/:companyid/companystaff",authenticate,(req, res, next) => {
    let companyID = req.params.companyid; // get company id from url
    let username = req.query.username; // get username from search form

    // confirm that object ID is valid
    if(!ObjectId.isValid(id)){
      return res.status(400).send(`Error: The Company Object ID is not valid`);
    }

    User.findOne({username, company:companyID}).then(user=>{
      if(!user){
        return res.status(404).send(`No user was found in this company`);
      }

      return res.send(user);

    }).catch(e=>{
      res.status(400).send(`Error: ${e}`);
    })
})


//create new user
router.post("/:companyid/users",authenticate,(req, res, next) => {
    let id = req.params.companyid
    let email = req.body.email;
    let employee_number = req.body.employee_number;

    Company.findById(id).then(company=>{
      if(!company){
        return res.status(404).send("Error No company was selected. Wrong company ID")
      }

      User.find({email, employee_number}).then(doc=>{
        if(doc.length > 0){
          return res.status(400).send("This user already exists in this company");
        }

        // req.body.username = req.body.username.toLowerCase(); // change username to all lowercase
          // Auto generate random password for admin
           password = genRandomPassword(10);
           console.log(password);
           
        // create the user
        let user = new User({
          ...req.body,
          company: id,
          password,
          Company_Schemerules: company.schemeRules // set company scheme rules for this user
        });

        // send welcome email containing password
      sendWelcomePasswordEmail(req.body.email,req.body.firstname,req.body.lastname,req.body.password);

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
          // update total shares alloted by company to scheme members dynamically
          let companyBatch = company.schemeBatch;
          let userBatch = user.batch;
          let companyBatchAmount; 

          companyBatch.forEach(function(batch){
            companyBatchAmount = batch.totalShares;
            userBatch.forEach(function(item){

              if(user.status){ // run this if the user is a confirmed staff of the company
                // updated total shares allocated to scheme members
                companyBatchAmount += item.allocatedShares; // dynamically generate total allocated to batch scheme
                // company.totalSharesAllocatedToSchemeMembers += item.allocatedShares;
              }else{ // run this if the user is an unconfirmed staff of the company
                // update total allocated shares to unconfirmed scheme members
                // companyBatchAmount += item.allocatedShares;
                company.totalSharesOfUnconfirmedSchemeMembers += item.allocatedShares;
              }

            });

          });

          // update total unallocated shares
          company.totalUnallocatedShares = (company.totalSharesAllocatedToScheme - company.totalSharesAllocatedToSchemeMembers) + company.totalSharesOfUnconfirmedSchemeMembers;
          // could simply work since it is the sum of all companyBatchAmount (outside the loop)
          company.totalSharesAllocatedToSchemeMembers = companyBatchAmount;

          // save updated company data to store database
          company.save();

          let body = _.pick(user, ['firstname', 'lastname', 'email','Company_Schemerules','company','status','tokens']);
          return res.status(201).send(body);

        }).catch(e=>{
          res.status(400).send(`There was an error: ${e}`)
        });

      }).catch(e=>{
          res.status(400).send(`There was an error: ${e}`)
      })

    });
})

// Register user in new batch
// router.post('/companybatch/registration/:id', (req,res)=>{
//   // find user in company
//   let batchData = req.body;
//   let id = req.params.id;

//   User.findById(id).then(user=>{ // find user and call batchRegistration function on the user.
//     user.batchRegistration(batchData);
//   }).catch(e=>{
//     res.status(400).send(`There is an ${e}`);
//   })

// })

// // User confirmation Route
// router.patch('/userComfirmation/:id', (req, res)=>{
//   let id = req.params.id;
//   findById(id).then(user=>{
//     user.userConfirmation().then(doc=>{
//       return res.status(200).send("User has been confirmed");
//     });
//   })
// })

// forgot Password Request Route
router.patch('/user/forgetpassword', (req,res)=>{
    User.findOne({email:req.body.email}).then(user=>{
        if(!user){// handle if the user with that email is not found
            return res.status(404).send("Error this user does not exists in our database");
        }

        // handle user is logged in
        if(user.tokens.length > 0){
            return res.status(400).send("Error you have to be logged out to make this request");
        }

        // generate a new secure random password for the client
        randomPassword = genRandomPassword(15);

        // send email with link to update password.
        sendUpdatePasswordEmail(user.email, user.firstname, user.lastname, randomPassword);

        let hashpassword = bcrypt.hashSync(randomPassword, 10);          

        // update the user password
        user.password = hashpassword;

        // save user with new password
        user.save().then(doc=>{
            res.status(200).send(`new password successfully regenerated.`);
        }).catch(e=>{
            return res.status().send(`Failed to update password with error ${e}`)
        })
        
    }).catch(e=>{
        return res.status(400).send(`Error {e} occured in the update password process. Please try again`);
    })
});

 //login
 router.post('/user/login',(req,res)=>{
    User.findOne({'email':req.body.email},(err,user)=>{
        if(!user) return res.status(404).json({
             message:`auth failed email not found`
         })
        user.comparePassword(req.body.password,(isMatch,err)=>{
        if(err) throw err;
            if(!isMatch) return res.status(400).json({
                message:"Wrong Password"
                })   
                if(isMatch) { 
                //if user log in success, generate a JWT token for the user with a secret key    
                if(user.tokens.length > 0){
                    return res.send("You are already Logged in");
                }    
                    return user.generateToken()
                    .then((token)=> {
                      return res.header('x-auth', token).send({
                          _id: user._id,
                          email: user.email,
                          company: user.company,
                          Company_Schemerules: user.Company_Schemerules,
                          tokens: user.tokens,
                          status: user.status
                      });
                  })
                    .catch(err=>{
                      res.status(400).send(err)
                    })
                }
            else {
                res.status(400).send("Error could not login")
            }
         })
    }) 
})

//logout
router.delete('/user/logout',authenticateUser, (req, res)=>{
    req.user.removeToken(req.token).then(()=>{

      res.status(200).send("Logout successfull");
    }, ()=>{
      res.status(400).send(`Error Logout not successfull ${e}`);
    })

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
            res.status(200).json(doc);
        })  
})

//find one user
router.get("/user/:id",authenticateUser,(req,res,next)=>{
    let id = req.params.id;
    // checks if the object is valid
    if(!ObjectId.isValid(id)) {
        res.status(400).send(`Error: Please enter a valid Object ID`);
    }


     User.findById(id).then((doc)=> {
        // if user is not found return error 404 otherwise send the admin.
        doc ? res.send(doc) : res.status(404).send();
    }).catch((e)=>{
        res.status(400).send();
    })
 })

 router.delete('/user/:id',authenticate, (req,res,next)=>{   //delete
    const id = req.params.id

      // Validate the user id
      if(!ObjectId.isValid(id)){
          res.status(400).send();
      }

      User.findOneAndDelete({_id:id})
       .then(user=>{
        if(!user){
          return res.status(404).send("User not found");
        }

        let companyID = user.company;

          let log = new Log({
              createdBy: `${req.admin.lastName} ${req.admin.firstName}`,
              action: `deleted a user`,
              user: `${user.firstName} ${user.lastName}`,
              company: `${user.Company_Name}`
          });

          Company.findById(companyID).then(company=>{
            // decrease company total scheme members by 1
            company.totalSchemeMembers -= 1; 

            let companyBatch = company.schemeBatch;
            let userBatch = user.batch;
            let companyBatchAmount;

              companyBatch.forEach(function(batch){
                companyBatchAmount = batch.totalShares;
              userBatch.forEach(function(item){

                if(user.status){ // run this if the user is a confirmed staff of the company
                  // updated total shares allocated to scheme members
                  companyBatchAmount += item.allocatedShares; // dynamically generate total allocated to batch scheme
                  // company.totalSharesAllocatedToSchemeMembers += item.allocatedShares;
                }else{ // run this if the user is an unconfirmed staff of the company
                  // update total allocated shares to unconfirmed scheme members
                  // companyBatchAmount += item.allocatedShares;
                  company.totalSharesOfUnconfirmedSchemeMembers += item.allocatedShares;
                }

              });

            });

            // update total unallocated shares
            company.totalUnallocatedShares = (company.totalSharesAllocatedToScheme - company.totalSharesAllocatedToSchemeMembers) + company.totalSharesOfUnconfirmedSchemeMembers;
            // could simply work since it is the sum of all companyBatchAmount (outside the loop)
            company.totalSharesAllocatedToSchemeMembers = companyBatchAmount;
            
            company.save(); // save to store data

          }).catch(e=>{
            res.status(400).send(`${e} could not delete user from company scheme memeber. Check Totalschememembers for this company ${company.name}; to make sure`)
          })

          log.save(); // save audit log
          deleteAccountEmail(user.email, user.firstname, user.lastname); // send accound cancellation email to admin
          return res.send("User is deleted");
       }).catch(e=>{
        return res.status(400).send(`${e} Error something went wrong user not deleted`);
       })
   })
   
  //Update user information
  router.patch('/user/:id',authenticateUser, (req, res) => {
    // get the user id
    let id = req.params.id;
    // validate the id
    if(!ObjectId.isValid(id)){
        res.status(400).send();
    }
    // find and update the user by id if it is found, throw error 404 if not
    User.findOneAndUpdate({_id:id}, {$set:req.body}, {new: true, runValidators: true  }).then((doc)=>{
        // check if doc was foun and updated
        if(!doc){
            return res.status(404).send();
        }

        // if(req.password !== doc.password){
        //     let password = doc.password;
        //     let saltRounds = 10;
        //     let hash = bcrypt.hashSync(password, saltRounds);
        //     doc.password = hash;
        // }

        doc.save();

        User.findById(id).then(doc=>{
          // confirmUser(); // call the confirm user to update necessary shares.
          return res.send("Update Successful");
        })
        
    }).catch((e)=>{
        res.status(400).send(e, "Error update error");
    });
    
});


// GET ROUTE VIEW ALL NOTIFICATIONS
router.get('/notification',authenticateUser, (req,res)=>{
    
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
        res.send(user.sentNotifications);
    })
})

// POST ROUTE SEND NOTIFICATION FOR user
router.post('/user/notification/:id',authenticateUser, (req, res)=>{
    let id = req.params.id;
    let receivers;
    req.body.onSenderModel = 'User'; // set the refPath 
    req.body.onReceiverModel = 'Admin';

    Admin.find({}).then(adminArray=>{
        if(!adminArray){
            return res.status(404).send("error no user found");
        }

        User.findById(id).then(user=>{
          receivers =  _.map(adminArray, 'id');

          let sentMessage = new Notifcations({
              ...req.body,
              sender:user._id,
              receiver:receivers
          });

          // sendToOne(doc.email, doc.firstname, doc.lastname); // send this notification by email also

          sentMessage.save().then(doc=>{
              res.status(201).send(doc);
          }).catch(e=>{
              res.status(400).send(`${e}`);
          });
        })

        // res.send(doc);
    }).catch(e=>{
        res.status(404).send(`${e}`);
    });
})

module.exports = router;