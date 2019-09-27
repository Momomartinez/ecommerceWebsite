const express = require("express");
const path = require("path");
const PORT = 3000;

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => console.log("server started on port", PORT));
