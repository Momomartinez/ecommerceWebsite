const express = require("express");
const db = require("../models/database.js");
const router = express.Router();

async function getCategories(req, res, next) {
  await db.execute("SELECT * FROM category", (err, categories) => {
    if (err) throw err;
    req.categoriesList = categories;
    next();
  });
}

//gets search results and renders searchpage
router.get("/sell", getCategories, (req, res) => {
  // var searchResult = req.searchResult;
  var categoriesList = req.categoriesList;
  var userid = req.user.id;

  res.render("pages/postlistings", {
    // cards: searchResult,
    categoriesList: categoriesList,
    searchTerm: req.query.search,
    searchCategory: req.query.category
  });
});

router.post("/sell", (req, res) => {
  // const img = fs.readFileSync(req.file.path);
  (async () => {
    const insertRes = await db.query(
      `INSERT INTO listing (
       title, price, description, 
      image, is_sold, date, user_id, category_id
      ) VALUES (?,?,?,?,?,?,?,?) `,
      [
        req.body.title,
        req.body.price,
        req.body.description,
        req.body.image,
        0,
        req.body.date,
        req.session.passport.user.id,
        req.body.category
      ]
    );
    console.log("req.body: " + req.body);
    res.redirect("register");
  })();
});

module.exports = router;
