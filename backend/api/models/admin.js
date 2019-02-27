const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const Schema = mongoose.Schema;
const role = ["super_admin", "manager", "observer"];

const AdminSchema = new Schema({
    firstname: {
        type: String,
        required: [true, 'First Name is required'],
        maxlength: 120,
        trim: true,
    },
    lastname: {
        type: String,
        required: [true, 'Last Name is required'],
        maxlength: 120,
        trim: true
    }, 
    username: {
        type: String,
        required: [true, 'Username is required'],
        maxlength: 120,
        trim: true,
        unique: true
     },
    email: {
        type: String,
        required: [true, 'email is required'],
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE }is not a valid Email!'
        }
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      default: '###$eatles'
    },
    phone: {
        type: String,
        validate: {
          validator: function(v) {
            return /\d{3}-\d{3}-\d{3}-\d{4}/.test(v);
          },
          message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']
      },
    role:{
      type: String,
      trim: true,
      enum: role
    },
    image: String,
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

// convert mongoose Model to Object and pick needed properties
// this function overwrites the toJSON function. It is called implicitly
AdminSchema.methods.toJSON = function() {
 let obj = this.toObject();
 let newAdmin = _.pick(obj, ['firstname', 'lastname', 'username', 'email', 'phone', 'role']);
 return newAdmin;
}

// encrypt password using bcrypt conditionally. Only if the user is newly created or he updated his password directly.
AdminSchema.pre('save', function(next) {
  const admin = this // bind this

  if (admin.$isDefault('password') || admin.isModified('password')) {
    bcrypt.genSalt(12, (err, salt) => { // generate salt and harsh password
      if (err) {
        return next(err);
      }
      bcrypt.hash(admin.password, salt, (err, hash) => {
        if (err) {
          return next(err);
        }
        admin.password = hash
        return next()
      })
    }) 
  } else {
    return next();
  }
})

AdminSchema.methods.generateToken = function() {

    let admin = this;
    let access = 'auth';
    let token = jwt.sign({_id: admin._id.toHexString(), access}, '12345abc').toString(); // the second

    // set the admin.tokens empty array of object, object properties with the token and the access generated.
    admin.tokens = admin.tokens.concat([{access, token}]);
    
    // save the admin and return the token to be used in the server.js where with the POST route for assiging tokens to newly signed up users.
    return admin.save().then(() => {
        return token;
    });
}

// create a custom model method to find admin by token for authentication
AdminSchema.statics.findByToken = function(token) {
    let Admin = this;
    let decoded;

    try {
        decoded = jwt.verify(token, '12345abc');
    } catch(e) {
        return Promise.reject();
    }
    return Admin.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}

// create a new mongoose method for user login authentication
AdminSchema.statics.findByCredentials = function(email, password) {
    let Admin = this;
    return Admin.findOne({email}).then((admin)=> { // find admin by email
        if(!admin){  // handle admin not found
            return Promise.reject();
        }

        return new Promise((resolve, reject)=> {
            bcrypt.compare(password, admin.password, (err, res)=> {
                if(res) {
                    return resolve(admin);
                }else{
                    return reject();
                }
            })
        });
    });
}


AdminSchema.methods.removeToken = function(token) {
  let admin = this;
    return admin.updateOne({
    $pull: {
      tokens: {
        token
      }
    }
  })
}

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = {Admin};