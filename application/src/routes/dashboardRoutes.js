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

async function getMessages(req, res, next) {
  var uid = req.user.id;

  var query = "SELECT * ";
}

async function getListings(req, res, next) {
  var uid = req.user.id;

  var query = "SELECT * FROM listing WHERE is_sold != 1 AND user_id = " + uid;
  await db.execute(query, (err, result) => {
    if (err) {
      req.listings = "";
      next();
    }
    req.listings = result;
    next();
  });
}

async function updateListing(req, res, next) {
  var lid = req.body.lid;

  var query = "UPDATE listing SET is_sold = 1 WHERE id = " + lid;
  await db.execute(query, (err, result) => {
    if (err) {
      next();
    }
    next();
  });
}

async function deleteListing(req, res, next) {
  var lid = req.body.lid;

  var query = "DELETE FROM listing WHERE id = " + lid;
  await db.execute(query, (err, result) => {
    if (err) {
      next();
    }
    next();
  });
}

router.get("/userMessages", getCategories, getMessages, (req, res) => {});

router.get("/userListings", getCategories, getListings, (req, res) => {
  var categoriesList = req.categoriesList;
  var userListings = req.listings;
  // res.render("pages/userListings", {
  //   cards: userListings,
  //   categoriesList: categoriesList,
  //   searchTerm: "",
  //   searchCategory: "All"
  // });
});

router.put(
  "/updateListing",
  getCategories,
  updateListing,
  getListings,
  (req, res) => {
    var categoriesList = req.categoriesList;
    var userListings = req.listings;
    // res.render("pages/userListings", {
    //   cards: userListings,
    //   categoriesList: categoriesList,
    //   searchTerm: "",
    //   searchCategory: "All"
    // });
  }
);

router.delete(
  "/deleteListing",
  getCategories,
  deleteListing,
  getListings,
  (req, res) => {
    var categoriesList = req.categoriesList;
    var userListings = req.listings;
    // res.render("pages/userListings", {
    //   cards: userListings,
    //   categoriesList: categoriesList,
    //   searchTerm: "",
    //   searchCategory: "All"
    // });
  }
);
