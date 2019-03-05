const express = require("express");
const router = express.Router();
const {User} = require("../models/user");
const jwt = require('jsonwebtoken');
const {authenticate} = require('../../middleware/authenticate');
const multer =  require('multer');
const upload = multer({ dest: 'uploads/' }); //  for image/file upload





router.post('/profile', upload.single('image'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    if(!req.file){
      return res.status(204).send({Error: "Upload was not successful!"});
    }
    res.status(200).send(req.file);
    console.log(req.file)
  
  });
  
//create new user
router.post("/registration",authenticate, (req, res, next) => {
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
            user.corresponding_vesting_date = req.body.corresponding_vesting_date;
            user.corresponding_date_of_sale = req.body.corresponding_date_of_sale;
            
            user.save()
            .then(response=>{
              res.status(200).json({
                  message:"User registration successful"
                })
            })
            .catch(err=>{
                res.json({
                    message:`Server error ${err}`
                })
            })
        })
 //login
 router.post('/login',(req,res)=>{
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
    
                jwt.sign({user}, 'privatekey', { expiresIn: '1h' },(err, token) => {
                    if(err) { console.log(err) }    
                    res.status(200).json({
                        message: `user login status ${isMatch}`
                    });
                });
            }
            else {
                console.log('ERROR: Could not log in');
            }
         })
    }) 
})
//upload

router.delete('/users/logout',authenticate, (req, res)=>{
    req.admin.removeToken(req.token).then(()=>{
      res.status(200).send();
    }, ()=>{
      res.status(400).send();
    })
  });

//read user info
router.get("/read",authenticate,(req,res,next)=>{
    User.find().limit(3)
    .then(response=>{
       res.status(200).json({
         response,
        total:response.length
        })
    })
    .catch(err=>{
        res.status(500).json({
         message:`an error has occured`,
        error:`${err}`
     })
    })
 })
//find one user
router.get("/read/:id",authenticate,(req,res,next)=>{
    let id = req.params.id;
    User.find({_id:id})
    .then(response=>{
       res.status(200).json({
         response
        })
    })
    .catch(err=>{
        res.status(500).json({
         message:`an error has occured`
     })
    })
 })


 router.delete('/delete/:id',authenticate,(req,res,next)=>{   //delete
    const id = req.params.id
      User.findOneAndDelete({_id:id})
       .then(response=>{
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
                       res.satus(200).json({
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
   
      
   router.put('/update/:id',authenticate,(req,res)=>{               //update
    const id = req.params.id;
        User.findOne({_id:id},(err, user)=>{
            if (err) {
                res.status(500).json({
                    message:'Bad request update failed'
                });
              }
            else {
                if(!user){
                res.satus(404).json({
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