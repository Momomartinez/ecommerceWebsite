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

//Search function
async function search(req, res, next) {
    var searchTerm = req.query.search;
    var category = req.query.category;

    let join =
        "SELECT listing.id, listing.title, listing.price, listing.description, listing.image, category.name FROM listing INNER JOIN category ON listing.category_id = category.id";
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
router.get("/sell", search, getCategories, (req, res) => {
    var searchResult = req.searchResult;
    var categoriesList = req.categoriesList;
    res.render("pages/postlistings", {
        cards: searchResult,
        categoriesList: categoriesList,
        searchTerm: req.query.search,
        searchCategory: req.query.category
    });
});


module.exports = router;