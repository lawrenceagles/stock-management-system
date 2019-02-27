const {Admin} = require('../api/models/admin');

// create a middleware function
let authenticate = (req, res, next) => {
    let token = req.header('x-auth'); // grap the token from the server
    Admin.findByToken(token).then((admin) => { // model method to find admin by token
        if(!admin) { // reject the promise if no admin is found
            return Promise.reject("You do not have the permission you perform this operation");
            // you can redirect the user to the login page!
        }

        req.admin = admin;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send("You do not have the permission you perform this operations");
    });
}

module.exports = {authenticate};