//! middleware to checklogin
exports.checklogin = (req, res, next) => {
    if (!req.session.user) return next(); // login page   
    // already a logged in user is there
    res.redirect('/user/profile') // if already user login  
}

exports.permission = (req, res, next) => {
    if (req.session.user) {
        return next()
    }
    res.redirect('/user/login');
}

//! Admin Login
exports.loginAdmin = (req, res, next) => {

    // get data from user 
    const role = 'admin'
    if (role === 'admin'){
        return next();
    }
    res.send('admin permission required');
  
}

//! Employees / Admin Login
exports.loginEmployee = (req, res, next) => {

    // get data from user 
    const role = 'employee'
    if (role === 'employee' || role === 'admin'){
        return next();
    }
    res.send('employee or admin permission required');
  
}