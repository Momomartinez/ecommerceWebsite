let express = require('express');
let aboutRouter = express.Router();

// Main About Page
aboutRouter.route('/')
    .get((req, res) => {
        res.render('index', { isLoggedIn: req.isAuthenticated() });
    });
// Personal About Pages
aboutRouter.route('/danabout')
    .get((req, res) => {
        res.render('danabout', { isLoggedIn: req.isAuthenticated() });
    });

aboutRouter.route('/gemabout')
    .get((req, res) => {
        res.render('gemabout', { isLoggedIn: req.isAuthenticated() });
    });

aboutRouter.route('/moniqueabout')
    .get((req, res) => {
        res.render('moniqueabout', { isLoggedIn: req.isAuthenticated() });
    });

aboutRouter.route('/pramishabout')
    .get((req, res) => {
        res.render('pramishabout', { isLoggedIn: req.isAuthenticated() });
    });
aboutRouter.route('/rayaabout')
    .get((req, res) => {
        res.render('raya_about_page', { isLoggedIn: req.isAuthenticated() });
    });

module.exports = aboutRouter;