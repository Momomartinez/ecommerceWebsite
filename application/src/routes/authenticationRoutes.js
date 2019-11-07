const express = require('express');
const request = require('request');
const passport = require('passport');

const router = express.Router();

router.route('/login').get((req, res) => {
    res.render('about/raya_about_page');
})