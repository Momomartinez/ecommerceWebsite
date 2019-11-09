const express = require('express');
const router = express.Router();
const db = require("../models/database.js");
const { User } = require('../models/user.js');
const { check, validationResult } = require('express-validator');


router.get('/register', function (req, res, next) {
    res.render('register');
})

router.post("/auth/register", function(req, res, next) {
    // var name = req.body.name;
    // var email = req.body.username;
    // var password = req.body.password;
    const {name, email, password}  = req.body;
    let errors = [];
    console.log(name);
    if(!name || !email || !password) {
        errors.push({msg: 'please fill in all fields'})
    }

    //check pass length
    if(password.length < 6) {
        errors.push({msg: 'password should be at least 6 character'});
    }
    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password
        });
       console.log(errors);
    }else{
        User.checkValid(req.body.email, res)
            .then((isValid) => {
                //if there is no similar user in the the user table--> insert the user
                if(isValid){
                    console.log("valid");

                    User.register(req.body.name, req.body.email, req.body.password)
                        .then((userID) => {
                            req.login({id: userID}, () => res.redirect('/'));
                            console.log(userID);
                        });


                //if there is similar user exists in the table --> show error
                }else{

                    errors.push({msg: 'user is already exist'});
                    console.log(errors);
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password
                    });




                }
        });





    }
});

module.exports = router;