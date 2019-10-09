//var createError = require("http-errors");
const express = require("express");
const path = require("path");
const PORT = 3000;

const app = express();
const aboutRouter = require("./routes/aboutRoutes");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "../public")));
app.use("/about", aboutRouter);

app.get("/", (req, res) => {
  //res.sendFile(path.join(__dirname, "../public/index.html"));
  res.render('pages/index');
});

//for testing the mainpage demo
app.get("/mpd", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/mainpage.html"));
});



app.listen(PORT, () => console.log("server started on port", PORT));
