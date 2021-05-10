//! Declaration
const express = require('express');
const app = express();
const session = require('express-session');

require('dotenv').config()

const indexRouter = require('./routes/indexRouter');
const userRouter = require('./routes/userRouter');
const productRouter = require('./routes/productRouter')

//! Multer
const multer = require('multer');

//! Custom Helper
const hbs = require('hbs');
// toUpperCase Helper
hbs.registerHelper('capital', (username) => {
    return username.toUpperCase() + ' Rama'
})

// ifEqual Helper
hbs.registerHelper('ifEqual', (arg1, arg2, option) => {
    (arg1 == arg2) ? option.fn(this) : option.inverse(this)
    //    if(arg1 == arg2) {
    //        return option.fn(this)
    //    }
    //    else {
    //        return option.inverse(this)
    //    }
})

// multiply Helper
hbs.registerHelper('multi100', (price) => {
    return price * 100;
})


const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

//! database name and url
const DB_NAME = process.env.DB_NAME
const DB_URL = process.env.MongoDB_Link + DB_NAME
mongoose.connect(DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(() => console.log('MongoDB database is successfully connected'))
    .catch(() => console.log('Database connection failed!'))

//! Settings
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'hbs');

app.use(express.urlencoded({
    extended: false
}))


//! express session setting
app.use(session({
    secret: process.env.SECRET, // signature
    resave: false,
    saveUninitialized: true,
    cookie: { // set the time for session data
        maxAge: 1000 * 60 * 60 // its in miliseconds 1000ms = 1s
    }
}));
console.log(session)

//! Model
const User = require('./models/User');
const { options } = require('./routes/indexRouter');
// test mongoose query methods
app.get('/searchByName', (req, res) => {
    //res.json('test ok') // check route test ok
    // req.body.name
    User.findOne({ name: "Jack" }, (err, data) => {
        if (err) throw err;
        res.json(data)
    })
})

//! File Upload Testing
app.get('/uploadForm', (req, res)=>{
    res.render('fileForm')
})
// test file upload process
app.post('/upload/file', (req, res)=>{
    console.log('data from form: ', req.file)
})

//! Test Faker.js Router
// 1- get the fake data from faker.js addPicture
// 2-  see the date in console
// 3- display the data in browser

const faker = require('faker');
app.get('/test/fakeData', (req, res) => {
    const userData = {
        avatar: faker.image.avatar(),
        name: {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            jobTitle: faker.name.jobTitle(),
            jobArea: faker.name.jobArea(),
        },
        phone: faker.phone.phoneNumberFormat(),

    }
    // res.json(`Employee: ${userData.name.firstName} ${userData.name.lastName}`);
    //  res.json(userData)
    res.render('fake_profile', { user: userData })
})

//! Routes
app.use('/', indexRouter)
app.use('/user', userRouter)
app.use('/product', productRouter)

/* 
Error Router Handler
only runs when no other routes match
we add "*" to the pathname because it means any route
*/
//? catch 404 and forward to error handler
app.get('*', (req, res) => {
    res.render('error')
})

//! listen app with port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})


