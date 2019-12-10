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
    "SELECT listing.id, listing.title, listing.price, listing.description, listing.image, listing.is_sold, listing.date, category.name, listing.user_id FROM listing INNER JOIN category ON listing.category_id = category.id WHERE is_sold = 0 ORDER BY date DESC LIMIT 9;";

  await db.execute(query, (err, results) => {
    if (err) {
      req.searchResult = "";
      next();
    }
    req.searchResult = results;
    next();
  });
}

async function sortListingByPriceHighToLow(req, res, next) {
    let query =
        "SELECT listing.id, listing.title, listing.price, listing.description, listing.image, listing.is_sold, listing.date, category.name, listing.user_id FROM listing INNER JOIN category ON listing.category_id = category.id WHERE is_sold = 0 ORDER BY price DESC LIMIT 9;";

    await db.execute(query, (err, results) => {
        if (err) {
            req.searchResult = "";
            next();
        }
        req.searchResult = results;
        next();
    });
}
async function sortListingByPriceLowToHigh(req, res, next) {
    let query =
        "SELECT listing.id, listing.title, listing.price, listing.description, listing.image, listing.is_sold, listing.date, category.name, listing.user_id FROM listing INNER JOIN category ON listing.category_id = category.id WHERE is_sold = 0 ORDER BY price Asc LIMIT 9;";

    await db.execute(query, (err, results) => {
        if (err) {
            req.searchResult = "";
            next();
        }
        req.searchResult = results;
        next();
    });
}

async function getClasses(req, res, next) {
  await db.execute("SELECT * FROM classes", (err, classes) => {
    if (err) throw err;
    //console.log(categories);
    req.classesList = classes;
    next();
  });
}

async function textbookSearch(req, res, next) {
  var classSearch = req.query.class;

  var query =
    "SELECT listing.id, listing.title, listing.price, listing.description, listing.image, listing.date, category.name, listing.user_id, class.class FROM listing, class, category WHERE category.id = listing.category_id AND listing.is_sold = 0 AND class.id = listing.class_id AND class.class = " +
    classSearch;

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
    "SELECT listing.id, listing.title, listing.price, listing.description, listing.image, listing.is_sold, listing.date, category.name, listing.user_id FROM listing INNER JOIN category ON listing.category_id = category.id";
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

//search


router.get("/filter/most-recent",getRecentListings,getCategories,(req, res) => {
    var searchResult = req.searchResult;
    var categoriesList = req.categoriesList;
    //var classesList = req.classesList;
    res.render("pages/mainpage", {
        cards: searchResult,
        categoriesList: categoriesList,
        //classesList: classesList,
        searchTerm: "",
        searchCategory: "Most Recent"
    });
});

router.get("/filter/Price_High_to_low",sortListingByPriceHighToLow,getCategories,(req, res) => {
    var searchResult = req.searchResult;
    var categoriesList = req.categoriesList;
    //var classesList = req.classesList;
    res.render("pages/mainpage", {
        cards: searchResult,
        categoriesList: categoriesList,
        //classesList: classesList,
        searchTerm: "",
        searchCategory: "Sort By Price (High to Low)"
    });
});
router.get("/filter/Price_Low_to_High",sortListingByPriceLowToHigh,getCategories,(req, res) => {
    var searchResult = req.searchResult;
    var categoriesList = req.categoriesList;
    //var classesList = req.classesList;
    res.render("pages/mainpage", {
        cards: searchResult,
        categoriesList: categoriesList,
        //classesList: classesList,
        searchTerm: "",
        searchCategory: "Sort By Price (Low to High)"
    });
});
//gets search results and renders searchpage
router.get("/search", search, getCategories, getClasses, (req, res) => {
  var searchResult = req.searchResult;
  var categoriesList = req.categoriesList;
  var classesList = req.classesList;
  res.render("pages/mainpage", {
    cards: searchResult,
    categoriesList: categoriesList,
    //classesList: classesList,
    searchTerm: req.query.search,
    searchCategory: req.query.category
  });
});

router.get(
  "/textbookSearch",
  textbookSearch,
  getCategories,
  getClasses,
  (req, res) => {
    var searchResult = req.searchResult;
    var categoriesList = req.categoriesList;
    var classesList = req.classesList;
    res.render("pages/mainpage", {
      cards: searchResult,
      categoriesList: categoriesList,
      //classesList: classesList,
      searchTerm: "",
      searchCategory: "All"
    });
  }
);

//Landing page
router.get("/", getRecentListings, getCategories, getClasses, (req, res) => {
  var searchResult = req.searchResult;
  var categoriesList = req.categoriesList;
  //var classesList = req.classesList;
  res.render("pages/mainpage", {
    cards: searchResult,
    categoriesList: categoriesList,
    //classesList: classesList,
    searchTerm: "",
    searchCategory: "Recent"
  });
});

module.exports = router;
