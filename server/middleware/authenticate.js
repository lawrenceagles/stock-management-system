const {Admin} = require('../api/models/admin');

// create a middleware function
let authenticate = (req, res, next) => {
    let token = req.header('x-auth'); // grap the token from the server
    Admin.findByToken(token).then((admin) => { // model method to find admin by token
        if(!admin) { // reject the promise if no admin is found
            return Promise.reject();
            // you can redirect the user to the login page!
        }
        req.admin = admin;
        req.token = token;

        // Role management
        if(req.method !== 'GET' && req.admin.role === 'observer'){
             return Promise.reject();
            // you can redirect the user to the login page!
        }

        if(req.method === 'POST' && req.admin.role === 'manager') {
            return Promise.reject();
            // you can redirect the user to the login page!
        }

        next();
    }).catch((e) => {
        res.status(401).send("You do not have the permission you perform this operation");
    });
}

module.exports = {authenticate};