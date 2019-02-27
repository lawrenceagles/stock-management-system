const {Admin} = require('../api/models/admin');

// create a middleware function
let authenticate = (req, res, next) => {
    let token = req.header('x-auth'); // grap the token from the server
    Admin.findByToken(token).then((admin) => { // model method to find admin by token
        if(!admin) { // reject the promise if no admin is found
            return Promise.reject();
        }

        req.admin = admin;
        console.log(req.admin);
        req.token = token;
        console.log(req.token);
        next();
    }).catch((e) => {
        res.status(401).send();
    });
}

module.exports = {authenticate};