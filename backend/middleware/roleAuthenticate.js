const {Admin} = require('../api/models/admin');

// create a middleware function
let roleAuthenticate = (req, res, next) => {
    let body = _.pick(req.body, ['role']);
    let role = req.body; // grap the role from the server
    Admin.findByRole(role).then((admin) => { // model method to find admin by role
        if(role === 'super_admin'){
            next();
        }

        if(!admin) { // reject the promise if no admin is found
            return Promise.reject("You do not have the permission you perform this operation");
            // you can redirect the user to the login page!
        }

        next();
    }).catch((e) => {
        res.status(401).send("You do not have the permission you perform this operations");
    });
}

module.exports = {authenticate};