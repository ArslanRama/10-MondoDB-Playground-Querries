const express = require('express');
const router = express.Router();
const auth = require('../config/auth')

//! Users
router.get('/productList', (req, res) => {
    res.send ('Customers can see all the products')
})

//! Admin
router.get('/productControl',auth.loginAdmin, (req, res) => {
    res.send ('Admin can CRUD all the products')
})

//! Employees or Admin
router.get('/productAdd', auth.loginEmployee, (req, res) => {
    res.send ('Employers or admin can add products')
})

module.exports = router;
