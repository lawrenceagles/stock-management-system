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
    toEmail:{
      type: Boolean
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      trim:true
    },
    phone: {
        type: Number,
        minlength: 11,          
        required: [true, 'User phone number required'],
        trim: true
      },
    role:{
      type: String,
      trim: true,
      enum: role
    },
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

AdminSchema.virtual('sentNotifications', {
  ref: 'Notifcations',
  localField: '_id',
  foreignField: 'sender'
});

AdminSchema.virtual('receivedNotifications', {
  ref: 'Notifcations',
  localField: '_id',
  foreignField: 'receiver'
});

// convert mongoose Model to Object and pick needed properties
// this function overwrites the toJSON function. It is called implicitly
AdminSchema.methods.toJSON = function() {
 let obj = this.toObject();
 let newAdmin = _.pick(obj, ['_id','firstname', 'lastname', 'username', 'email', 'phone', 'role']);
 return newAdmin;
}

// encrypt password using bcrypt conditionally. Only if the user is newly created.
AdminSchema.pre('save', function(next) {
  const admin = this // bind this

  if (admin.isModified('password')) {
    try {
        const salt = bcrypt.genSaltSync(12);
        const hash = bcrypt.hashSync(admin.password, salt);
        admin.password = hash;
        next();
    } catch (error) {
        return next(error);
    }
  } else {
    return next();
  }
})

// fix hashing password on update
AdminSchema.pre("update", function(next) {
    const admin = this // bind this
    const password = admin.getUpdate().$set.password;
    if (!password) {
        return next();
    }
    try {
        const salt = bcrypt.genSaltSync(12);
        const hash = bcrypt.hashSync(password, salt);
        admin.getUpdate().$set.password = hash;
        next();
    } catch (error) {
        return next(error);
    }
});

AdminSchema.methods.generateToken = function() {

    let admin = this;
    let access = 'auth';
    let token = jwt.sign({_id: admin._id.toHexString(), access}, "zzkjafydio4797jlkfjasdjfkl7io8dufjl", { expiresIn: '72h' }).toString(); // the second

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
        decoded = jwt.verify(token, "zzkjafydio4797jlkfjasdjfkl7io8dufjl");
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
            return Promise.reject("No user with that email in database");
        }

        return new Promise((resolve, reject)=> {
            // bcrypt.compare(password, , (err, res)=> {
            //     if(res) {
            //         return resolve(admin);
            //     }else{
            //         return reject("Error Wrong Password");
            //     }
            // })

            const passwordValidation = bcrypt.compareSync(password, admin.password);
            if(passwordValidation === true){
              return resolve(admin);
            }else{
              return reject("Error Wrong Password");
            }
        });
    });
}

AdminSchema.statics.findByEmail = function(email) {
    let Admin = this;
    return Admin.findOne({email}).then((admin)=> { // find admin by email
        if(admin){ 
            return resolve(admin);
        }
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