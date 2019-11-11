const express = require('express');
const router = express.Router();
const { User } = require('../models/user.js');
const { validationResult } = require('express-validator/check');
const passport = require('passport');
var expressValidator = require('express-validator');


router.get('/login', function (req, res) {
    res.render('login', {title: 'Login'});
});
router.post("/login", passport.authenticate(
    'local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));



router.get('/register', function (req, res, next) {
    console.log("10 : "+req.user);
    console.log("10 : "+req.isAuthenticated());
    res.render('register', {title: 'Form Validation', isLoggedIn: req.isAuthenticated(), success: req.session.success, errors: req.session.errors});
    req.session.errors = null;
});

router.post("/register", function(req, res, next) {

    req.check('email', 'invalid email adress').isEmail().exists();
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
                            console.log("user : "+req.user);
                            console.log("isAthenticated: "+req.isAuthenticated());
                        });

                    //if there is similar user exists in the table --> show error
                } else {
                    console.log("not valid");
                    res.render('register', { title: 'Error : Similar user exists'});

                }
            });

    }


});

// router.post('/login', passport.authenticate(
//     'local', {
//         successRedirect: '/register',
//         failureRedirect: '/login'
//     }));

passport.serializeUser(function(user_id, done) {
    done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {

    done(null, user_id);

});


module.exports = router;
