const express = require('express');
const router = express.Router();
const db = require("../models/database.js");
const { User } = require('../models/user.js');
const { check, validationResult } = require('express-validator');




router.get('/login', function (req, res, next) {
    res.render('partials/login');
})

router.post("/register", function(req, res, next) {
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
        res.render('partials/login', {
            errors,
            name,
            email,
            password
        });
       console.log(errors);
    }else{
        //validation pass
        //create the user in model
        User.register(req.body.name, req.body.email, req.body.password)
            .then((userID) => {
                // req.login({id : userID} , () => res.redirect('/'));
                console.log(userID);
            });

    }
});

// async function checkValidation(req, res, next) {
//     await db.query("SELECT * FROM listing_type", (err, categories) => {
//         if (err) throw err;
//         //console.log(categories);
//         req.categoriesList = categories;
//         next();
//     });
// }




module.exports = router;