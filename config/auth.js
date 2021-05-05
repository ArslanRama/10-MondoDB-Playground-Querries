//! middleware to checklogin
exports.checklogin = (req, res, next)=> {
    if(!req.session.user) return next(); // login page   
     // already a logged in user is there
     res.redirect('/user/profile') // if already user login  
 }
 
exports.permission = (req, res, next)=> {
     if(req.session.user) {
         return next()
     }
     res.redirect('/user/login');   
 }