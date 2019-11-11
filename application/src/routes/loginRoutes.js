const express = require('express');
const router = express.Router();
const { User } = require('../models/user.js');
const { validationResult } = require('express-validator/check');
const passport = require('passport');



router.get('/register', function (req, res, next) {

    res.render('register', {title: 'Form Validation', isLoggedIn: req.isAuthenticated(), success: req.session.success, errors: req.session.errors});
    req.session.errors = null;
});

router.post("/auth/register", function(req, res, next) {

    req.check('email', 'invalid email adress').isEmail().exists();
    // req.check('email', 'email should not be empty').exists();
    // req.check('username', 'username should not be empty').exists();
    // req.check('name', 'name should not be empty').exists();
    req.check('password', 'password should be at least 6 character').isLength({min: 6});
    req.check('password', 'password not match').equals(req.body.password_confirm);
    req.check('terms', 'You must accept the terms and conditions.').equals('1');

    var errors = req.validationErrors();
    // const errors = validationResult(req).array({ onlyFirstError: true });
    if(errors){
        console.log(`errors: ${JSON.stringify(errors)}`);
        res.render('register', {
            title: 'Registeration Error',
            errors: errors
        });
    }else {
        const {name, email, password, password_confirm} = req.body;
        console.log("email is: " + req.body.email);
        User.checkValid(email)
            .then((isValid) => {
                //if there is no similar user in the the user table--> insert the user
                if (isValid) {
                    console.log("valid");
                    User.register(name, email, password)
                        .then((userID) => {
                            const user_id = userID;
                            req.login({id: userID}, () => res.redirect('/'));
                            console.log(userID);
                        });

                    //if there is similar user exists in the table --> show error
                } else {
                    console.log("not valid");
                    res.render('register', { title: 'Error : Similar user exists'});
                    // return;
                    // res.render('register', { title: 'Error : Similar user exists',
                    //     errors,
                    //     name,
                    //     email,
                    //     password,
                    //     password_confirm
                    // });
                }
            });

    }

});

passport.serializeUser(function(user_id, done) {
    done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {

        done(null, user_id);

});

module.exports = router;



    // const {name, email, password, password_confirm}  = req.body;
    // let errors = [];
    //
    // if(!name || !email || !password) {
    //     errors.push({msg: 'please fill in all fields'})
    // }
    // if(password !== password_confirm){
    //     errors.push({msg: 'password not match'})
    // }
    //
    // //check pass length
    // if(password.length < 6) {
    //     errors.push({msg: 'password should be at least 6 character'});
    // }
    // if(errors.length > 0){
    //     res.render('register', {
    //         errors,
    //         name,
    //         email,
    //         password,
    //         password_confirm
    //
    //     });
    //    console.log(errors);
    // }else{
    //     User.checkValid(req.body.email, res)
    //         .then((isValid) => {
    //
    //             //if there is no similar user in the the user table--> insert the user
    //             if(isValid){
    //                 console.log("valid");
    //                 User.register(req.body.name, req.body.email, req.body.password)
    //                     .then((userID) => {
    //                         req.login({id: userID}, () => res.redirect('/'));
    //                         console.log(userID);
    //                     });
    //
    //             //if there is similar user exists in the table --> show error
    //             }else{
    //                 errors.push({msg: 'user is already exist'});
    //                 console.log(errors);
    //                 res.render('register', {
    //                     errors,
    //                     name,
    //                     email,
    //                     password,
    //                     password_confirm
    //                 });
    //             }
    //     });
    // }
