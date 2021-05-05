const express = require('express');
const router = express.Router();

router.get('/', (req, res)=> {
    // localStorage.setItem('mydata')
    if(req.session.refresh){
        req.session.refresh++;
        res.send('The website is visited: '+ req.session.refresh + ' times')
    } else {
        req.session.refresh = 1
        res.send('The website is visited: '+ req.session.refresh + ' times')
    }
})

module.exports = router;