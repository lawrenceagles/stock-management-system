const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

AdminSchema.methods.generateToken = function() {

    let admin = this;
    let access = 'auth';
    let token = jwt.sign({_id: admin._id.toHexString(), access}, '12345abc').toString(); // the second

    // set the admin.tokens empty array of object, object properties with the token and the access generated.
    admin.tokens = admin.tokens.concat([{access, token}]);
    // admin.tokens.push({access, token});
    
    // save the admin and return the token to be used in the server.js where with the POST route for assiging tokens to newly signed up users.
    return admin.save().then(() => {
        return token;
    });
}

// encrypt password using bcrypt conditionally. Only if the user is newly created or he updated his password directly.
AdminSchema.pre('save', function(next){
  let admin = this; // bind this

  if(admin.isModified('password')) {
        bcrypt.genSalt(15, (err, salt)=> { // generate salt and harsh password
            bcrypt.harsh(admin.password, salt, (err, harsh)=> {
                admin.password = harsh;
                next();
            });
        });
    }else{
        next();
    }
});

// Genrate user token method


module.exports = mongoose.model('Admin', AdminSchema);