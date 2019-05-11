const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    employee_number: {
        type: String,
        unique: true,
        maxlength:150,
        required: [true, 'Employee Number is required'],
        isUpdated: false
    },
    firstName: {
        type: String,
        maxlength:120,
        trim: true,
        required: [true, 'User First Name is required'],
        isUpdated: false
    },
    lastName: {
        type: String,
        maxlength:120,
        trim: true,
        required: [true, 'User Last Name is required'],
        isUpdated: false
    },
    otherNames: {
        type: String,
        maxlength:120,
        isUpdated: false;
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
        },,
        isUpdated: false
    },
    gender:{
        type: String,
        required: true,
        enum: ['male', 'female'],
        isUpdated: false
    },
    phone: {
        type: Number,
        required: [true, 'User phone number is required'],
        minlength:11,
        isUpdated: false
      },
    otherPhoneNumber:{
        type: Number,
        maxlength:100,
        isUpdated: false
      },
    username: {
        type: String,
        maxlength: 100,
        isUpdated: false
      },
    password: {
        type: String,
        required: [true, 'User password is required'],
        minlength:5,
        isUpdated: false
    },
    companySchemerules:{ //cannot be updated by users
        type:String,
        trim: true,
        isUpdated: false
    },
    grade_level: {
        type: String,
        required: [true, 'This field is required'],
        isUpdated: false
    },
    dateOfHire:{
        type: Date,
        required: true,
        isUpdated: false
    },
    group:{
        type: String,
        required: [true, 'Please enter the staff group'],
        isUpdated: false
    },
    status:{
        type: Boolean,
        required: [true, 'Please indicate the user status'],
        isUpdated: false
    },
    bankDetails:{
            bankName: {
                type: String,
                trim: true,
                required: [true, 'Bank name is required'],
                maxlength:300,
                isUpdated: false
            },
            bankBranch: {
                type: String,
                trim: true,
                isUpdated: false
            },
            accountName: {
                type: String,
                trim: true,
                maxlength:300,
                required: [true, 'Account name is required'],
                isUpdated: false
            },
            accountNumber: {
                type: Number,
                trim: true,
                maxlength:10,
                required: [true, 'Account number is required'],
                isUpdated: false
            },
            accountType: {
                type: String
            }
        },
    next_of_kin_information: {
        NextOfKinlastName:{
            type: String,
            trim: true,
            maxlength:120,
            isUpdated: false
        },
        NextOfKinfirstName: {
            type: String,
            trim: true,
            maxlength:120,
            isUpdated: false
        },
        NextOfKinOtherName: {
            type: String,
            trim: true,
            maxlength:120,
            isUpdated: false
        },
        NextOfKinEmail: {
            type: String,
            trim: true,
            maxlength:200,
            isUpdated: false
        },
        NextOfKinPhone: {
            type: Number,
            trim: true,
            maxlength:120,
            isUpdated: false
          },
        NextOfKinRelationship: {
              type: String,
              trim: true,
              maxlength:120,
              isUpdated: false
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
    currentShareValue:{
        type: Number
    },
    sharesSold: {
        type: Number,
        default:0
        },
    sharesBought:{
        type: Number,
        default:0
        },
    shareCollaterised: {
            type: Number,
            default:0
        },
    outstanding:{
            type: Number,
            default:0
        },
    dividend:{
        date:{
            type: Date,
            default: Date.now
        },
        amountReceived:{
            type: Number,
            default: 0
        }
    },
    vestedShares:{
      type: Number,
      default: 0
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
        nextVestingDate:{
            type: Date
        },
        amount:{
            type: Number,
            default: 0
        },
        vesting:{
            schedule:{
                type: String
            },
            directDate:{
              type: Date
            },
            period:{
                type: Number,
                required: [true, 'Please enter the vesting period for this batch']
            }
        },
        vestingCompleted:{
          type:Boolean,
          default:false
        }
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

userSchema.virtual('sentNotifications', { // links users to notification
  ref: 'Notifcations',
  localField: '_id',
  foreignField: 'sender'
});

userSchema.virtual('receivedNotifications', { // links users to notification
  ref: 'Notifcations',
  localField: '_id',
  foreignField: 'receiver'
});

// Handle passing password when onboarding users
userSchema.pre('save', function(next) {
  const user = this // bind this

  if (user.isModified('password')) {
    try {
        const salt = bcrypt.genSaltSync(12);
        const hash = bcrypt.hashSync(user.password, salt);
        user.password = hash;
        next();
    } catch (error) {
        return next(error);
    }
  } else {
    return next();
  }
})

// handle user login
 userSchema.statics.findByCredentials = function(email, password) {
    let User = this;
    return User.findOne({email}).then((user)=> { // find user by email
        if(!user){  // handle user not found
            return Promise.reject("No user with that email was found");
        }

        return new Promise((resolve, reject)=> {
            bcrypt.compare(password, user.password, (err, res)=> {
                if(res) {
                    return resolve(user);
                }else{
                    return reject("Password does not match that user email");
                }
            })
        });
    });
}

userSchema.methods.generateToken = function() {

    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString(); // the second

    // set the user.tokens empty array of object, object properties with the token and the access generated.
    user.tokens = user.tokens.concat([{access, token}]);

    // save the user and return the token to be used in the server.js where with the POST route for assiging tokens to newly signed up users.
    return user.save().then(() => {
        return token;
    });
}

userSchema.statics.findByToken = function(token) {
    let User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch(e) {
        return Promise.reject();
    }
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}

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
    let companyBatch = company.batch;
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
