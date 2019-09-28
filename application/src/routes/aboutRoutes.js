var express = require("express");
var router = express.Router();
var path = require("path");

/* GET Dan About Me. */
router.get("/dan", function(req, res) {
  res.sendFile(path.join(__dirname, "../../public/about/danabout.html"));
});

/* GET Monique About Me. */
router.get("/monique", function(req, res) {
  res.sendFile(path.join(__dirname, "../../public/about/moniqueabout.html"));
});

/* GET Pramish About Me. */
router.get("/pramish", function(req, res) {
  res.sendFile(path.join(__dirname, "../../public/about/pramishabout.html"));
});

/* GET Raya About Me. */
router.get("/raya", function(req, res) {
  res.sendFile(path.join(__dirname, "../../public/about/raya_about_page.html"));
});

/* GET Gem About Me. */
router.get("/gem", function(req, res) {
  res.sendFile(path.join(__dirname, "../../public/about/gemabout.html"));
});

module.exports = router;
