const express = require('express');
const router = express.Router();



router.get('/login', function (req, res, next) {
    res.render('partials/login');
})

router.post("/register", function(req, res, next) {
    var name = req.body.name;
    var email = req.body.username;
    console.log(name);
    console.log(email);

    //check vallidation
    req.checkBody('name', 'name is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        console.log('Yes');
    }else{
        console.log('No')
    }

});


module.exports = router;