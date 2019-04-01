const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const SALT_i = 10;
const _ = require('lodash');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    employee_number: {
        type: String,
        unique: true,
        maxlength:150,
        required: [true, 'Employee Number is required']
    },
    firstName: {
        type: String,
        maxlength:120,
        trim: true,
        required: [true, 'User First Name is required']
    },
    lastName: {
        type: String,
        maxlength:120,
        trim: true,
        required: [true, 'User Last Name is required']
    },
    otherNames: {
        type: String,
        maxlength:120
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'User email required'],
        maxlength:120,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE }is not a valid Email!'
        }
    },
    toEmail:{
      type: Boolean
    },
    gender:{
        type: String,
        required: true,
        enum: ['male', 'female']
    },
    phone: {
        type: String,
        required: [true, 'User phone number is required'],
        maxlength:100,
      },
    otherPhoneNumber:{
        type: String,
        maxlength:100,
      },
    username: {
        type: String,
        maxlength: 100
      },
    password: {
        type: String,
        required: [true, 'User password is required'],
        minlength:5,
    },
    Company_Schemerules:{ //cannot be updated by users
        type:String,
        trim: true,
    },
    grade_level: {
        type: String,
        required: [true, 'This field is required']
    },
    dateOfHire:{
        type: Date,
        required: true
    },
    group:{
        type: String,
        required: [true, 'Please enter the staff group']
    },
    status:{
        type: Boolean,
        required: [true, 'Please indicate the user status']
    },
    bankDetails:{
            bankName: {
                type: String,
                trim: true,
                required: [true, 'Bank name is required'],
                maxlength:300,
            },
            bankBranch: {
                type: String,
                trim: true
            },
            accountName: {
                type: String,
                trim: true,
                maxlength:300,
                required: [true, 'Account name is required']
            },
            accountNumber: {
                type: Number,
                trim: true,
                maxlength:10,
                required: [true, 'Account number is required']
            },
            accountType: {
                type: String
            }
        },
    next_of_kin_information: {
        NextOfKinlastName:{
            type: String,
            trim: true,
            maxlength:120
        },
        NextOfKinfirstName: {
            type: String,
            trim: true,
            maxlength:120
        },
        NextOfKinOtherName: {
            type: String,
            trim: true,
            maxlength:120
        },
        NextOfKinEmail: {
            type: String,
            trim: true,
            maxlength:200
        },
        NextOfKinPhone: {
            type: Number,
            trim: true,
            maxlength:120,
          },
        NextOfKinRelationship: {
              type: String,
              trim: true,
              maxlength:120,
        }
        
    },
    role:{
        type: String,
        default: "user"
    },
    company:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Company'
    },
    sharesSold: {
        type: Number
        },
    sharesBought:{
        type: Number
        },
    shareCollaterised: {
            type: Number
        },
    outstanding:{
            type: Number
        },
    dividend:{
        date:{
            type: Date
        },
        amountReceived:{
            type: Number
        }
    },
    batch:[{
        name:{
            type: String,
            required: [true, 'Please enter a batch name']
        },  
        allocatedShares: {
            type: Number,
            required: [true, 'This field is required']
        },
        allocationDate: {
            type: Date,
            required: [true, 'This field is required']
        },
        vestedShares: [{
            nextVestingDate:{
                type: Date
            },
            amount:{
                type: Number
            }
        }]
    }],
    avatar:{
        type: Buffer
    },
    tokens: [{
        access: {
          type: String,
          required: true
        },
        token: {
          type: String,
          required: true
        }
    }]
});

userSchema.virtual('sentNotifications', {
  ref: 'Notifcations',
  localField: '_id',
  foreignField: 'sender'
});

userSchema.virtual('receivedNotifications', {
  ref: 'Notifcations',
  localField: '_id',
  foreignField: 'receiver'
});

userSchema.pre('save',function(next){
    var user = this;
    if (user.isModified('password')){
        bcrypt.genSalt(SALT_i,function(err,salt){
            if (err) return next(err);
            bcrypt.hash(user.password,salt,function(err,hash){
                if (err) return next(err);
                user.password = hash;
                next();
            })
        })
    }
    else{
        next()
    } 
})

 userSchema.methods.comparePassword = function(candidatePassword, cb){      //req.body.password serves as candidatePassword in this module
     bcrypt.compare(candidatePassword,this.password,function(isMatch,err){
         if (err) return cb(err)         
         cb(isMatch,null);
     })
 }

userSchema.methods.generateToken = function() {

    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access}, "zzkjafydio4797jlkfjasdjfkl7io8dufjl").toString(); // the second

    // set the user.tokens empty array of object, object properties with the token and the access generated.
    user.tokens = user.tokens.concat([{access, token}]);
    
    // save the user and return the token to be used in the server.js where with the POST route for assiging tokens to newly signed up users.
    return user.save().then(() => {
        return token;
    });
}

userSchema.methods.batchRegistration = function(batchObject) {
    let user = this;
    userBatch = user.batch;

    try {
        // validate for batch name
        userBatch.map(companyBatch=>{
            if (companyBatch.name === batchObject.name){
                return "A batch with that name is already in existence";
            }
        });

        [...userBatch, batchObject]; // append new batch to batch

    }catch(e) {
        return Promise.reject(`${e}`);
    }
    
    // return userBatch; // return new userBatch
    return user.save().then(() => {
        return user;
    });
}

userSchema.statics.findByToken = function(token) {
    let User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, "zzkjafydio4797jlkfjasdjfkl7io8dufjl");
    } catch(e) {
        return Promise.reject();
    }
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}


// create a new mongoose method for user login authentication
// userSchema.statics.findByCredentials = function(email, password) {
//     let User = this;
//     return User.findOne({email}).then((user)=> { // find user by email
//         if(!user){  // handle user not found
//             return Promise.reject();
//         }

//         return new Promise((resolve, reject)=> {
//             bcrypt.compare(password, user.password, (err, res)=> {
//                 if(res) {
//                     return resolve(user);
//                 }else{
//                     return reject("Wrong password");
//                 }
//             })
//         });
//     });
// }


userSchema.methods.removeToken = function(token) {
  let user = this;
    return user.updateOne({
    $pull: {
      tokens: {
        token
      }
    }
  })
}

userSchema.methods.userConfirmation = function(companyObj){
    let user = this;
    let company = companyObj;

    // update total shares alloted by company to scheme members dynamically
    let companyBatch = company.schemeBatch;
    let userBatch = user.batch;
    let totalRetrivedShares; 

    companyBatch.forEach(function(batch){
        userBatch.forEach(function(item){

            if(user.status){ // run this if the user is a confirmed staff of the company
                // updated total shares allocated to scheme members
                totalRetrivedShares += item.allocatedShares; // dynamically generate total allocated to batch scheme
            }
        });

    });

    // could simply work since it is the sum of all companyBatchAmount (outside the loop) // update total allocated shares to unconfirmed scheme members
    company.totalSharesAllocatedToSchemeMembers = company.totalSharesAllocatedToSchemeMembers + (company.totalSharesOfUnconfirmedSchemeMembers - totalRetrivedShares);
    // update total unallocated shares
    company.totalUnallocatedShares = company.totalUnallocatedShares - totalRetrivedShares;

    // save updated company data to store database
    company.save();
}

const User = mongoose.model('User', userSchema);
module.exports = {User};