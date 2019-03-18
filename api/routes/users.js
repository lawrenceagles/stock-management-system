const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer =  require('multer');
const _ = require('lodash');
const path = require("path");

const {authenticateUser} = require('../../middleware/authenticateUser');
const {authenticate} = require('../../middleware/authenticate');
const {User} = require("../models/user");
const {Company} = require('../models/company');
const {Log} = require ('../models/audit_Trail');
const {ObjectId} = require('mongodb');



// Set Multer
// Set Storage Engine
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.toLowerCase());
  }
});

// Initialize single Upload Method
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000
  },
  fileFilter: (req, file, callback) => {
    checkFileType(file, callback);
  }
}).single("upload");
// Check File Type Function
checkFileType = (file, callback) => {
    // Allowed Extentions
    const filetypes = /jpeg|jpg|png/;
    // Check Extentions
    const extname = filetypes.test(
      path.extname(file.originalname).toLocaleLowerCase()
    );
 // Check MIME Types
 const mimetype = filetypes.test(file.mimetype);

 if (mimetype && extname) {
   return callback(null, true);
 } else {
   callback("Error: Images Only!");
 }
};
router.post("/upload", (req, res, next) => {
    upload(req, res, err => {
      if (err) {
        res.send(err);
      } else {
        res.send(req.file);
      }
    });
  });  


//create new user
router.post("/:companyname/users",authenticateUser,(req, res, next) => {
    let companyName = req.params.companyName;
    let email = req.body.email;
    let employee_number = req.body.employee_number;

    Company.findOne({name:companyName}).then(company=>{
      if(!company){
        return res.status(400).send("Error No company was selected")
      }

      let companyID = company._id;
      User.find({email, employee_number}).then(doc=>{
        if(doc.length > 0){
          return res.status(400).send("This user already exists in this company");
        }

        req.body.username = req.body.username.toLowerCase(); // change username to all lowercase

        // create the user
        let user = new User({
          ...req.body,
          company: companyID
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

        user.save().then(doc=>{
          res.status(201).send(doc);
        })
      })

    });
})


//create new user
router.get("/:companyname/users",authenticateUser,(req, res, next) => {
    let companyName = req.params.companyName;
    let email = req.body.email;

    Company.find({name:companyName}).then(company=>{
      if(!company){
        return res.status(400).send("Error No company was selected")
      }

      let companyID = company._id;
      User.find({email, employee_number}).then(doc=>{
        if(doc.length > 0){
          return res.status(400).send("This user already exists in this company");
        }

      })

    });
})


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
                          user
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
 router.get('/users',authenticateUser,(req,res,next)=>{ 
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
        res.status(404).send();
    }


     User.findById(id).then((doc)=> {
        // if admin is not found return error 404 otherwise send the admin.
        doc ? res.send(doc) : res.status(404).send();
    }).catch((e)=>{
        res.status(400).send();
    })
 })

 router.delete('/user/delete/:id',authenticate, (req,res,next)=>{   //delete
    const id = req.params.id

      // Validate the user id
      if(!ObjectId.isValid(id)){
          res.status(400).send();
      }

      User.findOneAndDelete({_id:id})
       .then(doc=>{

         let log = new Log({
              createdBy: `${req.admin.lastName} ${req.admin.firstName}`,
              action: `deleted a user`,
              user: `${doc.firstName} ${doc.lastName}`,
              company: `${doc.Company_Name}`
          });

          log.save();

           deleteAccountEmail(doc.email, doc.firstname, doc.lastname); // send accound cancellation email to admin

          res.status(200).json({
              message:"User deleted"
            })
           .then(id=>{
               find({_id:id},(err,doc)=>{
                   if (err){
                       res.status(404).json({
                        message:`Delete failed${err}`
                       })
                   }
                   else{
                       res.status(200).json({
                           message:`Document has been deleted`
                         })
                       }       
                   })
               })
           .catch(err=>{
               res.status(404).json({
                   error:`something went wrong${err}`
               })
           })
       })
   })
   
   //send email
      
   router.put('/user/update/:id',authenticateUser,(req,res)=>{               //update
    const id = req.params.id;
        // Validate user id
        if(!ObjectId.isValid(id)){
            res.status(400).send({Message:"Invalid user ID"});
        }

        User.findOne({_id:id},(err, user)=>{
            if (err) {
                res.status(500).json({
                    message:'Bad request update failed'
                });
              }
            else {
                if(!user){
                res.status(404).json({
                    message:`Document not found`
                    })
                }
                else{
                    if(req.body.firstName){
                        user.firstName = req.body.firstName;
                    }
                    if(req.body.lastName){
                        user.lastName = req.body.lastName;
                    }
                    if(req.body.otherNames){
                        user.otherNames = req.body.otherNames;
                    }
                    if(req.body.email){
                        user.email = req.body.email;
                    }
                    if(req.body.gender){
                        user.gender = req.body.gender;
                    }
                    if(req.body.phone){
                        user.phone = req.body.phone;
                    }
                    if(req.body.password){
                        user.password = req.body.password;
                    }
                    if(req.body.Company_Name){
                        user.Company_Name = req.body.Company_Name;
                    }
                    if(req.body.date_of_joining_company){
                        user.date_of_joining_company = req.body.date_of_joining_company;
                    }
                    if(req.body.grade_level){
                        user.grade_level = req.body.grade_level;
                    }
                    if(req.body.bankName){
                        user.bankDetails.bankName = req.body.bankName;
                    }
                    if(req.body.bankBranch){
                        user.bankDetails.bankBranch = req.body.bankBranch;
                    }
                    if(req.body.accountName){
                        user.bankDetails.accountName =req.body.accountName;
                    }
                    if(req.body.accountNumber){
                        user.bankDetails.accountNumber = req.body.accountNumber;
                    }
                    if(req.body.fullName){
                        user.next_of_kin_information.fullName = req.body.fullName;
                    }
                    if(req.body.NextOfKinEmail){
                        user.user.next_of_kin_information.NextOfKinEmail = req.body.NextOfKinEmail;
                    }
                    if(req.body.NextOfKinState){
                        user.next_of_kin_information.NextOfKinState = req.body.NextOfKinState;
                    }
                    if (req.body.NextOfKinPhone){
                        user.next_of_kin_information.NextOfKinPhone = req.body.NextOfKinPhone;
                    }
                    if(req.body.NextOfKinStreet){
                        user.next_of_kin_information.NextOfKinStreet = req.body.NextOfKinStreet;
                    }
                    if(req.body.NextOfKinCity){
                        user.next_of_kin_information.NextOfKinCity = req.body.NextOfKinCity;
                    }
                    if(req.body.NextOfKinRelationship){
                        user.next_of_kin_information.NextOfKinRelationship = req.body.NextOfKinRelationship;
                    }
                    if(req.body.current_value_of_shares){
                        user.current_value_of_shares = req.body.current_value_of_shares;
                    }
                    if(req.body.dividend_received){
                        user.dividend_received = req.body.dividend_received;
                    }
                    if(req.body.number_of_shares_collaterised){
                        user.number_of_shares_collaterised =req.body.number_of_shares_collaterised;
                    }
                    if(req.body.number_of_allocated_shares){
                        user.number_of_allocated_shares = req.body.number_of_allocated_shares
                    }
                    if(req.body.NextOfKinlastName){
                        user.NextOfKinlastName =req.body.NextOfKinlastName;
                    }

                    if(req.body.number_of_vested_shares){
                        user.number_of_vested_shares = req.body.number_of_vested_shares;
                    }
                    if(req.body.number_of_shares_sold){
                        user.number_of_shares_sold = req.body.number_of_shares_sold;
                    }
                    if(req.body.allocation_date){
                        user.allocation_date = req.body.allocation_date;
                    }
                    if(req.body.corresponding_vesting_date){
                        user.corresponding_vesting_date = req.body.corresponding_vesting_date;
                    }
                    if(req.body.corresponding_date_of_sale){
                        user.corresponding_date_of_sale = req.body.corresponding_date_of_sale;
                    }

                    let log = new Log({
                        createdBy: `${req.admin.lastName} ${req.admin.firstName}`,
                        action: `updated a user`,
                        user: `${user.firstName} ${user.lastName}`,
                        company: `${user.Company_Name}`
                    });

                    log.save();

                    user.save((err,UpdatedUser)=>{
                        if(err) res.status(500).json({
                            message:`Error occured while saving Company detail`,
                            err:`${err}`
                        })
                        else{
                            res.status(200).json({
                                message:"update successfull",
                                result:`${UpdatedUser}  `
                            })
                        }
                    })
                }
            };
       });
})


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
router.post('/notification',authenticateUser, (req, res)=>{
    let receiverEmail = req.body.email;
    req.body.onSenderModel = 'Admin'; // set the refPath 
    req.body.onReceiverModel = 'User';

    User.findOne({email:receiverEmail}).then(doc=>{

        if(!doc){
            return res.status(404).send("error no user found");
        }

        let sentMessage = new Notifcations({
                ...req.body,
                sender:req.admin._id,
                receiver:[doc._id]
            });

        sendToOne(doc.email, doc.firstname, doc.lastname); // send this notification by email also

        sentMessage.save().then(doc=>{
            res.status(201).send(doc);
        }).catch(e=>{
            res.status(400).send(`${e} Error with the route`);
        });

        // res.send(doc);
    }).catch(e=>{
        res.status(404).send("Error no receiver like this in database");
    });
})

module.exports = router;