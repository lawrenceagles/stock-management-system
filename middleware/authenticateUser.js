const {Admin} = require('../api/models/admin');
const {User} = require('../api/models/user');
// create a middleware function
let authenticateUser = (req, res, next) => {
    let token = req.header('x-auth'); // grap the token from the server
    
        User.findByToken(token).then((user) => { // model method to find user by token
        if(user){
            req.user = user;
            req.token = token;
            
            return next();
        }else{
             Admin.findByToken(token).then((admin)=>{
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
                return next();
            })
            .catch((e) => {
                res.status(401).send(e);
            }); 
        }
    })
    .catch((e) => {
        res.status(401).send(e);
    });  
}
module.exports = {authenticateUser};