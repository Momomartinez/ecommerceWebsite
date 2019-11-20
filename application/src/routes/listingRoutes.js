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

async function getRecentElectronics(req, res, next) {
  let electronicsQ =
    "SELECT * FROM listing WHERE category_id = 1 AND is_sold = 0 ORDER BY date DESC LIMIT 3;";

  await db.execute(electronicsQ, (err, recentElectronics) => {
    if (err) {
      req.recentElectronics = "";
      next();
    }
    req.recentElectronics = recentElectronics;
    next();
  });
}
async function getRecentBooks(req, res, next) {
  let booksQ =
    "SELECT * FROM listing WHERE category_id = 2 AND is_sold = 0 ORDER BY date DESC LIMIT 3;";

  await db.execute(booksQ, (err, recentBooks) => {
    if (err) {
      req.recentBooks = "";
      next();
    }
    req.recentBooks = recentBooks;
    next();
  });
}
async function getRecentFurniture(req, res, next) {
  let furnitureQ =
    "SELECT * FROM listing WHERE category_id = 3 AND is_sold = 0 ORDER BY date DESC LIMIT 3;";

  await db.execute(furnitureQ, (err, recentFurniture) => {
    if (err) {
      req.recentFurniture = "";
      next();
    }
    req.recentFurniture = recentFurniture;
    next();
  });
}
async function getRecentOther(req, res, next) {
  let otherQ =
    "SELECT * FROM listing WHERE category_id = 4 AND is_sold = 0 ORDER BY date DESC LIMIT 3;";

  await db.execute(otherQ, (err, recentOther) => {
    if (err) {
      req.recentOther = "";
      next();
    }
    req.recentOther = recentOther;
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

router.get("/posts", (req, res) => {
  res.render("partials/postlistings", {});
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

// //Landing page
// router.get("/", getRecentListings, getCategories, (req, res) => {
//   var searchResult = req.searchResult;
//   var categoriesList = req.categoriesList;
//   res.render("pages/mainpage", {
//     cards: searchResult,
//     categoriesList: categoriesList,
//     searchTerm: "",
//     searchCategory: "All"
//   });
// });

//Homepage
//Takes the 3 most recent items in each category and displays them
// router.get(
//   "/",
//   getRecentElectronics,
//   getRecentBooks,
//   getRecentFurniture,
//   getRecentOther,
//   getCategories,
//   (req, res) => {
//     var recentElectronics = req.recentElectronics;
//     var recentBooks = req.recentBooks;
//     var recentFurniture = req.recentFurniture;
//     var recentOther = req.recentOther;
//     var categoriesList = req.categoriesList;
//     console.log(recentElectronics);
//     console.log(recentBooks);
//     console.log(recentFurniture);
//     console.log(recentOther);
//     res.render("pages/mainpage", {
//       categoriesList: categoriesList
//     });
//   }
// );

module.exports = router;
