const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const SALT_i = 10;

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
      password: {
        type: String,
        required: [true, 'User password is required'],
        minlength:5,
    },
    Company_Schemerules:{   //cannot be updated by users
        type:String,
        trim: true,
    },
    User_Loan_Request:{
       type:String,
       maxlength:120
    },
    grade_level: {
        type: String,
        required: [true, 'This field is required']
    },
    dateOfHire:{
        type: Date,
        required: true
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
                trim: true,
                required: [true, 'Bank branch is required']
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
                type: String,
                required: [true, 'Account type is required']
            }
        },
    next_of_kin_information: {
        NextOfKinEmail: {
            type: String,
            trim: true,
            required: [true, 'User email required'],
            maxlength:200
        },
        NextOfKinlastName:{
            type: String,
            trim: true,
            required:true,
            maxlength:120
        },
        NextOfKinPhone: {
            type: Number,
            trim: true,
            required: [true, 'User phone number required'],
            maxlength:120,
          },
        NextOfKinRelationship: {
              type: String,
              trim: true,
              required: [true, 'This field cannot be empty'],
              maxlength:120,
        }
        
    },
    current_value_of_shares: {
        type: Number,
        maxlength:120,
        required: [true, 'This field is required']
    },
    dividend_received: {
        type: Object,
        default: {date:Date.now, value:0}
    },
    number_of_shares_collaterised: {
        type: Number,
        default: 0
    },
    number_of_allocated_shares: {
        type: Number,
        maxlength:120,
        required: [true, 'This field is required']
    },
    make_buy_request:{
        type:Boolean,
        maxlength:500
    },
    
    make_sell_request:{
        type:Boolean,
        maxlength:120
    },
    number_of_vested_shares: {
        type: Number,
        default: 0
    },
    number_of_shares_sold: {
        type: Number,
        maxlength:120,
        default: 0
    },
    forfieted_Shares:{
        type: Number,
        default: 0
    },
    vested_as_at:{
        type: Array,
        default: [{date:Date.now, amount:0}]
    },

    allocation_date: {
        type: Date,
        required: [true, 'This field is required']
    },
    // corresponding_vesting_date: {
    //     type: Date,
    //     required: [true, 'This field is required']
    // },
    // corresponding_date_of_sale: {
    //     type: Date,
    //     required: [true, 'This field is required']
    // },
    role:{
        type: String,
        default: "user"
    },
    company:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Company'
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
userSchema.statics.findByCredentials = function(email, password) {
    let user = this;
    return User.findOne({email}).then((user)=> { // find user by email
        if(!user){  // handle user not found
            return Promise.reject();
        }

        return new Promise((resolve, reject)=> {
            bcrypt.compare(password, user.password, (err, res)=> {
                if(res) {
                    return resolve(user);
                }else{
                    return reject();
                }
            })
        });
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

userSchema.statics.findByEmail = function(email) {
    let Admin = this;
    return Admin.findOne({email}).then((admin)=> { // find admin by email
        if(admin){ 
            return resolve(admin);
        }
    });
}

const User = mongoose.model('User', userSchema);
module.exports = {User};