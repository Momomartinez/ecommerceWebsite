const express = require("express");
const path = require("path");
const PORT = 3000;

const app = express();
const aboutRouter = require("./src/routes/aboutRoutes");
app.set("views", path.join(__dirname, "./src/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "./public")));
app.use("/about", aboutRouter);

app.get("/", (req, res) => {
  res.render("pages/mainpage");
});

app.listen(PORT, () => console.log("server started on port", PORT));
