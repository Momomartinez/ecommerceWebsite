const express = require("express");
const path = require("path");
const { User } = require("./src/models/user.js");
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var expressValidator = require("express-validator");

const PORT = 3000;

var options = {
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
const secretKey = '6LeFicYUAAAAAMOWixduhv-XxQiNNNtC2rzkoyf_';

// use express session
app.use(
  session({
    secret: "CSC Class",
    saveUninitialized: false,
    store: sessionStore,
    resave: false
  })
);
// require('./src/config/passport.js')(app);
app.use(passport.initialize());
app.use(passport.session());
/* allows to call static items in pulic folder such as images */
app.use(express.static("./public"));
const aboutRouter = require("./src/routes/aboutRoutes");
const listingRouter = require("./src/routes/listingRoutes");
const loginRouter = require("./src/routes/loginRoutes");
const sellRouter = require("./src/routes/sellRoutes");
const dashboardRouter = require("./src/routes/dashboardRoutes");
// test for messages route
const messagesRouter = require("./src/routes/messageRoutes");

app.use("/about", aboutRouter);
app.use("/", listingRouter);
app.use("/", loginRouter);
app.use("/", sellRouter);
app.use("/", dashboardRouter);

passport.use(
  new LocalStrategy(
    {
      usernameField: "name",
      passwordField: "password"
    },
    function(name, password, done) {
      const isValid = User.findUser(name, password);
      isValid.then(res => {
        if (res != false) {
          return done(null, res);
        }

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended : false}));
        
        app.get('/',function(req,res) {
          // Sending our HTML file to browser.
          res.sendFile(__dirname + '/login.ejs');
        });
        
        app.post('/submit',function(req,res){
          // g-recaptcha-response is the key that browser will generate upon form submit.
          // if its blank or null means user has not selected the captcha, so return the error.
          if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
            return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
          }
          // Put your secret key here.
          var secretKey = "6LeFicYUAAAAAMOWixduhv-XxQiNNNtC2rzkoyf_";
          // req.connection.remoteAddress will provide IP address of connected user.
          var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
          // Hitting GET request to the URL, Google will respond with success or error scenario.
          request(verificationUrl,function(error,response,body) {
            body = JSON.parse(body);
            // Success will be true or false depending upon captcha validation.
            if(body.success !== undefined && !body.success) {
              return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
            }
            res.json({"responseCode" : 0,"responseDesc" : "Sucess"});
          });
        });
        
        // This will handle 404 requests.
        app.use("*",function(req,res) {
          res.status(404).send("404");
        })
        
        // lifting the app on port 3000.
        app.listen(3000);

        return done(null, false, { message: "Invalid email or password." });
      });
    }
  )
);

app.listen(PORT, () => console.log("server started on port", PORT));
