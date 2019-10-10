// let express = require('express');
// let aboutRouter = express.Router();
//
// // Main About Page
// aboutRouter.route('/')
//     .get((req, res) => {
//         res.render('index', { isLoggedIn: req.isAuthenticated() });
//     });
// // Personal About Pages
// aboutRouter.route('/danabout')
//     .get((req, res) => {
//         res.render('danabout', { isLoggedIn: req.isAuthenticated() });
//     });
//
// aboutRouter.route('/gemabout')
//     .get((req, res) => {
//         res.render('gemabout', { isLoggedIn: req.isAuthenticated() });
//     });
//
// aboutRouter.route('/moniqueabout')
//     .get((req, res) => {
//         res.render('moniqueabout', { isLoggedIn: req.isAuthenticated() });
//     });
//
// aboutRouter.route('/pramishabout')
//     .get((req, res) => {
//         res.render('pramishabout', { isLoggedIn: req.isAuthenticated() });
//     });
// aboutRouter.route('/rayaabout')
//     .get((req, res) => {
//         res.render('raya_about_page', { isLoggedIn: req.isAuthenticated() });
//     });
//
// module.exports = aboutRouter;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/danabout', function(req, res, next) {
    res.render('about/danabout', { title: 'Express' });
});

router.get('/moniqueabout', function(req, res, next) {
    res.render('about/moniqueabout', { title: 'Express' });
});
router.get('/gemabout', function(req, res, next) {
    res.render('about/gemabout', { title: 'Express' });
});
router.get('/pramishabout', function(req, res, next) {
    res.render('about/pramishabout', { title: 'Express' });
});
router.get('/rayaabout', function(req, res, next) {
    res.render('about/raya_about_page', { title: 'Express' });
});

router.get('/', function(req, res, next) {
    res.render('pages/index', { title: 'Express' });
});
// router.get('/', function(req, res, next) {
//     res.render('about/raya', { title: 'Express' });
// });

module.exports = router;