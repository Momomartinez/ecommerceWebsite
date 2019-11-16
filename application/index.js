const express = require("express");
const path = require("path");
const { User } = require('./src/models/user.js');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');

const PORT = 3000;


var options ={
    host: "142.44.170.121",
    user: "root",
    password: "6&rFzI70oM*",
    database: "team11_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

var sessionStore = new MySQLStore(options);
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
        store: sessionStore,
        resave: false,
    }),
);
// require('./src/config/passport.js')(app);
app.use(passport.initialize());
app.use(passport.session());

const aboutRouter = require("./src/routes/aboutRoutes");
const listingRouter = require("./src/routes/listingRoutes");
const loginRouter = require("./src/routes/loginRoutes");
const sellRouter = require("./src/routes/sellRoutes");

app.use("/about", aboutRouter);
app.use("/", listingRouter);
app.use("/", loginRouter);
app.use("/", sellRouter);
passport.use(new LocalStrategy({
        usernameField: 'name',
        passwordField: 'password'
},
    function (name, password, done) {
        console.log("local strategy");
        console.log(name);
        console.log(password);
        const isValid = User.findUser(name, password);
        isValid.then((res) => {
            if(res != false){
                return done(null, res);
            }
            return done(null, false, {message: 'Invalid email or password.'});
        });
    }),
);


app.listen(PORT, () => console.log("server started on port", PORT));
