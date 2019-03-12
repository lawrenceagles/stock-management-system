const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer =  require('multer');
const _ = require('lodash');
const path = require("path");

const {authenticateUser} = require('../../middleware/authenticateUser');
const {authenticate} = require('../../middleware/authenticate');
const {User} = require("../models/user");
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
        console.log(err);
      } else {
        res.send(req.file);
      }
    });
  });  
//create new user
router.post("/users",authenticateUser,(req, res, next) => {
    User.findOne({'employee_number':req.body.employee_number},(err,newuser)=>{
        if(newuser) return res.status(404).json({
             message:` User already exist`
         })

        let user = new User
            user.employee_number=req.body.employee_number;
            user.firstName=req.body.firstName;
            user.lastName=req.body.lastName;
            user.email=req.body.email;
            user.gender = req.body.gender;
            user.phone=req.body.phone;
            user.password=req.body.password;
            user.UserImage = req.body.UserImage;
            user.date_of_joining_company=req.body.date_of_joining_company;
            user.grade_level=req.body.grade_level;
            user.Company_Name=req.body.Company_Name;
            user.Company_Schemerules = req.body.Company_Schemerules;
            user.bankDetails.bankName = req.body.bankName;
            user.bankDetails.bankBranch  = req.body.bankBranch;
            user.bankDetails.accountName = req.body.accountName;
            user.bankDetails.accountNumber = req.body.accountNumber;
            user.next_of_kin_information.fullName = req.body.fullName;
            user.next_of_kin_information.NextOfKinEmail = req.body.NextOfKinEmail;
            user.next_of_kin_information.NextOfKinState = req.body.NextOfKinState;
            user.next_of_kin_information.NextOfKinPhone = req.body.NextOfKinPhone;
            user.next_of_kin_information.NextOfKinStreet = req.body.NextOfKinStreet;
            user.next_of_kin_information.NextOfKinCity = req.body.NextOfKinCity;
            user.next_of_kin_information.NextOfKinRelationship = req.body.NextOfKinRelationship;
            user.current_value_of_shares=req.body.current_value_of_shares;
            user.dividend_received = req.body.dividend_received;
            user.number_of_shares_collaterised = req.body.number_of_shares_collaterised;
            user.number_of_allocated_shares = req.body.number_of_allocated_shares;
            user.number_of_vested_shares = req.body.number_of_vested_shares;
            user.number_of_shares_sold = req.body.number_of_shares_sold;
            user.allocation_date = req.body.allocation_date;
            user.make_buy_request = req.body.make_buy_request;
            user.make_sell_request = req.body.make_sell_request;
            user.corresponding_vesting_date = req.body.corresponding_vesting_date;
            user.corresponding_date_of_sale = req.body.corresponding_date_of_sale;

            let log = new Log({
                createdBy: `${req.admin.lastName} ${req.admin.firstName}`,
                action: `${req.admin.lastName} ${req.admin.firstName} created a new user`,
                user: `${user.firstName} ${user.lastName}`,
                company: `${user.Company_Name}`             
            });

            log.save();
            
            user.save().then(() => { // save the user instance 
                return user.generateToken(); // save the user instance
            }).then((token) => { // pass pass the token as the value of the custom header 'x-auth' and send header with the newly signed up user.
                res.header('x-auth', token).send(user);
            }).catch(err=>{
                        res.json({
                            message:`Server error ${err}`
                        })
                    })
                })
            })
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
                console.log('ERROR: Could not log in');
            }
         })
    }) 
})

//logout
router.delete('/user/logout',authenticateUser, (req, res)=>{
    req.user.removeToken(req.token).then(()=>{

      res.status(200).send();
    }, ()=>{
      console.log()
      res.status(400).send();
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


    // User.find({_id:id})
    // .then(doc=>{

    //     // let log = new Log({
    //     //     action: `${req.admin.lastName} ${req.admin.firstName} Viewed a user profile, with Name: ${doc.firstName} ${doc.lastName}, Employee Number:${doc.employee_number}, in ${doc.Company_Name}`,
    //     //     createdBy: `${req.admin.lastName} ${req.admin.firstName}`
    //     // });

    //     // log.save();

    //    res.status(200).json({
    //      doc
    //     })
    // })
    // .catch(err=>{
    //     res.status(500).json({
    //      message:`an error has occured`
    //  })
    // })
 })

 // 
 // router.post("/user/:id",authenticateUser,(req,res,next)=>{
 //    let id = req.params.id;
 //    User.find({_id:id})
 //    .then(doc=>{

 //       // let log = new Log({
 //       //      action: `${req.admin.lastName} ${req.admin.firstName} updated a user profile, with Name: ${doc.firstName} ${doc.lastName}, Employee Number:${doc.employee_number}, in ${doc.Company_Name}`,
 //       //      createdBy: `${req.admin.lastName} ${req.admin.firstName}`
 //       //  });

 //       //  log.save();

 //       res.status(200).json({
 //         doc
 //        })
 //    })
 //    .catch(err=>{
 //        res.status(500).json({
 //         message:`an error has occured`
 //     })
 //    })
 // })

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
              action: `${req.admin.lastName} ${req.admin.firstName} deleted a user`,
              user: `${doc.firstName} ${doc.lastName}`,
              company: `${doc.Company_Name}`
          });

          log.save();

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
                        action: `${req.admin.lastName} ${req.admin.firstName} updated a user`,
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

module.exports = router;