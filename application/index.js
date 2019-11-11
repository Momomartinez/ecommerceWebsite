const express = require("express");
const path = require("path");
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');
const PORT = 3000;




const app = express();

const morgan = require("morgan");
app.use(morgan("tiny"));
app.set("views", path.join(__dirname, "./src/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(bodyParser.json());
// use express session
app.use(
    session({
        secret: 'CSC Class',
        saveUninitialized: false,
        resave: false,
    }),
);
app.use(passport.initialize());
app.use(passport.session());
const aboutRouter = require("./src/routes/aboutRoutes");
const listingRouter = require("./src/routes/listingRoutes");
const loginRouter = require("./src/routes/loginRoutes");

app.use("/about", aboutRouter);
app.use("/", listingRouter);
app.use("/", loginRouter);
passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log("hellooooooo");
        console.log(username);
        console.log(password);
        return done(null, "jnjhbj");
    }
));

app.listen(PORT, () => console.log("server started on port", PORT));
