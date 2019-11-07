const express = require("express");
const path = require("path");
const PORT = 3000;

const app = express();

app.set("views", path.join(__dirname, "./src/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const morgan = require("morgan");
app.use(morgan("tiny"));
const aboutRouter = require("./src/routes/aboutRoutes");
const listingRouter = require("./src/routes/listingRoutes");
const loginRouter = require("./src/routes/listingRoutes")

app.use("/about", aboutRouter);
app.use("/", listingRouter);
app.use("/", loginRouter);

app.listen(PORT, () => console.log("server started on port", PORT));
