var createError = require('http-errors');
const express = require("express");
const path = require("path");
const PORT = 3000;

const app = express();
const aboutRouter = require('../src/routs/aboutRoutes');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));
app.use('/about/', aboutRouter);

app.listen(PORT, () => console.log("server started on port", PORT));
