const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');


router.get('/login', function (req, res, next) {
    res.render('partials/login');
})

router.post("/register", function(req, res, next) {
    var name = req.body.name;
    var email = req.body.username;
    var password = req.body.password;
    console.log(name);
    console.log(email);
   

    //check vallidation


    // var errors = req.validationErrors();


});


module.exports = router;