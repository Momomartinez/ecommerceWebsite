const express = require('express');
const router = express.Router();
const { User } = require('../models/user.js');
const { check } = require('express-validator/check');


router.get('/register', function (req, res, next) {
    res.render('register');
})

router.post("/auth/register", function(req, res, next) {
    const {name, email, password, password_confirm}  = req.body;
    let errors = [];

    if(!name || !email || !password) {
        errors.push({msg: 'please fill in all fields'})
    }
    if(password !== password_confirm){
        errors.push({msg: 'password not match'})
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
            password,
            password_confirm

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
                        password,
                        password_confirm
                    });
                }
        });
    }
});

module.exports = router;