const express = require("express");
const db = require("../models/database.js");
const router = express.Router();

async function getCategories(req, res, next) {
  await db.execute("SELECT * FROM listing_type", (err, categories) => {
    if (err) throw err;
    //console.log(categories);
    req.categoriesList = categories;
    next();
  });
}

//Search function
async function search(req, res, next) {
  var searchTerm = req.query.search;
  var category = req.query.category;

  let join =
    "SELECT listing.id, listing.title, listing.price, listing.description, listing.image, listing_type.name FROM listing INNER JOIN listing_type ON listing.listing_type_id = listing_type.id";
  let query = "";
  if (searchTerm != "" && (category != "" && category != "All")) {
    query =
      ` WHERE name = '` +
      category +
      `' AND (title LIKE '%` +
      searchTerm +
      `%' OR description LIKE '%` +
      searchTerm +
      `%')`;
  } else if (searchTerm != "" && (category == "" || category == "All")) {
    query =
      ` WHERE (title LIKE '%` +
      searchTerm +
      `%' OR description LIKE '%` +
      searchTerm +
      `%')`;
  } else if (searchTerm == "" && (category != "" && category != "All")) {
    query = ` WHERE name = '` + category + `'`;
  }

  let sql = join + query;
  //console.log("this is sql: " + sql);
  await db.execute(sql, (err, result) => {
    if (err) {
      req.searchResult = "";
      next();
    }
    req.searchResult = result;
    next();
  });
}

//search
//gets search results and renders searchpage
router.get("/search", search, getCategories, (req, res) => {
  var searchResult = req.searchResult;
  var categoriesList = req.categoriesList;
  res.render("pages/mainpage", {
    cards: searchResult,
    categoriesList: categoriesList,
    searchTerm: req.query.search,
    searchCategory: req.query.category
  });
});



//Landing page for Vertical Prototype
//Same as search page but no results
router.get("/", search, getCategories, (req, res) => {
  var searchResult = req.searchResult;
  var categoriesList = req.categoriesList;
  res.render("pages/mainpage", {
    cards: searchResult,
    categoriesList: categoriesList,
    searchTerm: req.query.search,
    searchCategory: req.query.category
  });
});

module.exports = router;
