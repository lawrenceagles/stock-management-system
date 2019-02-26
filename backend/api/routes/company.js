const express = require('express');
const router = express.Router();
const _ = require('lodash');
const {ObjectId} = require('mongodb');
const Admin = require ('../models/admin');

// Home route 
// Ask what should the home route point to? 
// The login Page?
router.get('/', (req, res) => {
    res.send({type: "WELCOME TO HOME LOGIN"});
});

// GET route read all admins
router.get('/admin', (req, res) => {
    Admin.find({}).then(doc => {
      res.send(doc);
    });
},
(e) => {
  res.status(404).send();
}
);

// POST Route onboard admin
router.post('/admin', (req, res) => {

    let admin = new Admin({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        role: [req.body.role]
    });

    admin.save().then((doc)=>{
        res.send(admin);
    },
    (e)=>{
        res.status(400).send();
    });
});


// GET :id Route to get single admin
router.get('/admin/:id', (req, res) => {
    // destructure the req.params object to get the object id.
    let id = req.params.id;

    // checks if the object is valid
    if(!ObjectId.isValid(id)) {
        return res.status(404).send();
    }

    // find the admin by id.
    Admin.findById(id).then((doc)=> {
        // if admin is not found return error 404 otherwise send the admin.
        doc ? res.send(doc) : res.status(404).send();
    }).catch((e)=>{
        res.status(400).send();
    })

});

// GET :id Route to get single admin by role
router.get('/admin/role', (req, res) => {
    // get the role from the logged in user 
    // this should be completed after authentication is complete
    let role = req.params.role;
    Admin.find({role:[role]}).then((docs)=>{
        res.send(docs)
    });
});

// PATCH Route Update admin
router.patch('/admin/:id', (req, res) => {
    // get the admin id
    let id = req.params.id;
    // pickout only what you want to grant the user permission to update
    let body = _.pick(req.body, ["firstname", "lastname", "username", "password", "email", "phone", "role"]);
    // validate the id
    if(!ObjectId.isValid(id)){
        return res.status(400).send();
    }
    // find and update the admin by id if it is found, throw error 404 if not
    Admin.findByIdAndUpdate(id, {$set:body}).then((doc)=>{
        // check if doc was foun and updated
        if(!doc){
            return res.status(404).send();
        }

        Admin.findById(id).then(doc=>{
            return res.send(doc);
        })
        
    }).catch((e)=>{
        res.status(400).send();
    });
    // return the updated doc
});

// DELETE Route delete admin
router.delete('/admin/:id', (req, res) => {
    // get the admin id
    let id = req.params.id;
    // validate the company id
    if(!ObjectId.isValid(id)){
        return res.status(400).send();
    }
    // query to find admin and delete
    Admin.findByIdAndRemove(id).then((doc)=>{

        if(!doc){ // if doc is not found return error 404.
            return res.status(404).send();
        }

        console.log(id, doc);
        res.send(doc); // return the deleted doc (admin) if found and deleted
    }).catch((e)=>{
        res.status(400).send();
    });
});

module.exports = router;
