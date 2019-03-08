// const {Admin} = require('../api/models/admin');
const {User} = require('../api/models/user');
// create a middleware function
let authenticateUser = (req, res, next) => {
    let token = req.header('x-auth'); // grap the token from the server
    
        User.findByToken(token).then((user) => { // model method to find user by token
        if(!user) { // reject the promise if no user is found
            return Promise.reject();
            // you can redirect the user to the login page!
        }
        if(user){
            req.user = user;
            req.token = token;
        }
        next();
    })
    .catch((e) => {
        console.log(req.user)
        res.status(401).send(e);
    });  
}
module.exports = {authenticateUser};