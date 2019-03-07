const {Admin} = require('../api/models/admin');
const {User} = require('../api/models/user');
// create a middleware function
let authenticate = (req, res, next) => {
    let token = req.header('x-auth'); // grap the token from the server
    if(Admin || !User){
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
    if(User || !Admin){
         User.findByToken(token).then((user)=>{
            if(!user) { // reject the promise if no user is found
                console.log(user);
                return res.send("User not found")
                // you can redirect the user to the login page!
            }
            if(user){
                req.user = user;
                req.token = token;
            }

            next();
         }).catch((e) => {
        res.status(401).send("You do not have the permission you perform this operation users only");
    });
    }
   
}
module.exports = {authenticate};