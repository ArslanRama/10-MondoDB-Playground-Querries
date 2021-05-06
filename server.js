//! Declaration
const express = require('express');
const app = express();
const session = require('express-session');

require('dotenv').config()

const indexRouter = require('./routes/indexRouter');
const userRouter = require('./routes/userRouter');
const productRouter = require('./routes/productRouter')

//! Helper
const hbs = require('hbs');
hbs.registerHelper('capital',(username)=>{
    return username.toUpperCase() + ' Rama'
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
const User = require('./models/User')
// test mongoose query methods
app.get('/searchByName', (req, res) => {
    //res.json('test ok') // check route test ok
    // req.body.name
    User.findOne({ name: "Jack" }, (err, data) => {
        if (err) throw err;
        res.json(data)
    })
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


