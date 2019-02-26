const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
      minlength: 6
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

// encrypt password using bcrypt conditionally. Only if the user is newly created or he updated his password directly.
AdminSchema.pre('save', function(next){
  let admin = this; // bind this

  if (!admin.isModified('password')){
    // call next and move to execute the next action if password is not modified.
    return next();
  }

  // !admin.isModified('password') ? return next();

  bcrypt.genSalt(10, (err, salt)=> {
      bcrypt.hash(admin.password, salt, (err, hash)=> {
        admin.password = hash; // overwrite the password with the harsh value before saving to the DB.
        return next();
      })
    })
});

module.exports = mongoose.model('Admin', AdminSchema);