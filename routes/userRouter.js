const express = require('express');
const router = express.Router();
const User = require('../models/User')
const auth = require('../config/auth')
const bcrypt = require('bcrypt')

router.get('/profile', auth.permission, (req, res) => {
    const userId=req.session.user._id;
    User.findById(userId,(err, user) => {
        res.render('profile', {
            user
        })
    })
})

router.get('/list', auth.permission, (req, res) => {
    res.send('You have permission to see this page')
})

//! sign up 
router.get('/signup', (req, res) => {
    res.render('signup')
})

//! create an account 
router.post('/signup', (req, res) => {
    const userPassword = req.body.password;
    //!  syncronized hasspassword
    const saltRound = 10;
    // encrpting as async way
    bcrypt.hash(userPassword, saltRound, (err, hashPassword) => {
        req.body.password = hashPassword;
        const newUser = new User(req.body);
        newUser.save((err, doc) => {
            if (err) throw err;
            res.json(doc)
        })
    })
})





//! logout
router.get('/logout', (req, res) => {
    delete req.session.user;
    res.redirect('/user/login');
})

//! login with  middleware
router.get('/login', auth.checklogin, (req, res) => {
    let msg = ''
    if (req.query.msg) {
        msg = req.query.msg
    }
    res.render('login', { msg })
})

router.post('/login', (req, res) => {
    //res.json(req.body) // test 1
    /**
     * Take the data from user{email, password}
     * find the user from database by findone(email)
     */
    User.findOne({ email: req.body.email }, (err, data) => { //null or user{}
        /**
         * If there is email then check the password
         */
        if (data == null) {
            res.render('login', {
                msg: 'Email not found! Please try again!'
            })
        }
        else {
            // check password
            // find the userGiven password, not the hash
            bcrypt.compare(req.body.password, data.password, (err, result) => {
                if (result){
                    req.session.user=data;
                    res.redirect('/user/profile')
                } else
                res.render('login', {
                    msg: 'Password does not match, please try again!'
                })

            })
            if (data.password !== req.body.password) { //not equal value and type
                res.render('login', {
                    msg: 'Password does not match! Please try again!'
                })
            }
            else {
                // Store data or user into session                
                req.session.user = data;
                res.redirect('/user/profile')
            }
        }
        //res.json(data) // test 2
        //res.redirect('/user/login') no data can se sent when redirect
        // res.redirect(url.format({ // also send data
        //     pathname: '/user/login',
        //     query: {
        //         msg: 'Email or password is invalid! Please try with the correct Data'
        //     }
        // }))
    })
})



module.exports = router;