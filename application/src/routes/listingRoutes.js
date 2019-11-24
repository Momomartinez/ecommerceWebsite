const express = require("express");
const db = require("../models/database.js");
const router = express.Router();

async function getCategories(req, res, next) {
  await db.execute("SELECT * FROM category", (err, categories) => {
    if (err) throw err;
    //console.log(categories);
    req.categoriesList = categories;
    next();
  });
}

async function getRecentListings(req, res, next) {
  let query =
    "SELECT listing.id, listing.title, listing.price, listing.description, listing.image, listing.is_sold, listing.date, category.name FROM listing INNER JOIN category ON listing.category_id = category.id WHERE is_sold = 0 ORDER BY date DESC LIMIT 9;";

  await db.execute(query, (err, results) => {
    if (err) {
      req.searchResult = "";
      next();
    }
    req.searchResult = results;
    next();
  });
}

//Search function
async function search(req, res, next) {
  var searchTerm = req.query.search;
  var category = req.query.category;

  let join =
    "SELECT listing.id, listing.title, listing.price, listing.description, listing.image, listing.is_sold, listing.date, category.name FROM listing INNER JOIN category ON listing.category_id = category.id";
  let query = "";
  if (searchTerm != "" && category != "" && category != "All") {
    query =
      ` WHERE name = '` +
      category +
      `' AND (title LIKE '%` +
      searchTerm +
      `%' OR description LIKE '%` +
      searchTerm +
      `%') AND is_sold = 0;`;
  } else if (searchTerm != "" && (category == "" || category == "All")) {
    query =
      ` WHERE (title LIKE '%` +
      searchTerm +
      `%' OR description LIKE '%` +
      searchTerm +
      `%') AND is_sold = 0;`;
  } else if (searchTerm == "" && category != "" && category != "All") {
    query = ` WHERE name = '` + category + `' AND is_sold = 0;`;
  } else if (searchTerm == "" && category == "All") {
    query = ` WHERE is_sold = 0;`;
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

//Landing page
router.get("/", getRecentListings, getCategories, (req, res) => {
  var searchResult = req.searchResult;
  var categoriesList = req.categoriesList;
  res.render("pages/mainpage", {
    cards: searchResult,
    categoriesList: categoriesList,
    searchTerm: "",
    searchCategory: "Recent"

  });
});



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


module.exports = router;
