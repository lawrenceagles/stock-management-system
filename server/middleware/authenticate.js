const {Admin} = require('../api/models/admin');
const {User} = require('../api/models/user');
// create a middleware function
let authenticate = (req, res, next) => {
    let token = req.header('x-auth'); // grap the token from the server
    console.log(token);
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