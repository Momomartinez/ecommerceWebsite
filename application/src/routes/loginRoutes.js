const express = require('express');
const router = express.Router();
const db = require("../models/database.js");
const { check, validationResult } = require('express-validator');




router.get('/login', function (req, res, next) {
    res.render('partials/login');
})

router.post("/register", function(req, res, next) {
    var name = req.body.name;
    var email = req.body.username;
    var password = req.body.password;
    //check vallidation
    // var errors = req.validationErrors();
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