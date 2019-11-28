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

async function getSellerMessages(req, res, next) {
  var uid = req.user.id;

  var query =
    "SELECT DISTINCT message.buyer_id, message.seller_id, message.listing_id, listing.title FROM message, listing WHERE seller_id = " +
    uid +
    " AND message.listing_id = listing.id; ";

  await db.execute(query, (err, result) => {
    if (err) {
      req.sellerMessages = "";
      next();
    }
    req.sellerMessages = result;
    next();
  });
}

async function getBuyerMessages(req, res, next) {
  var uid = req.user.id;

  var query =
    "SELECT DISTINCT message.buyer_id, message.seller_id, message.listing_id, listing.title FROM message, listing WHERE buyer_id = " +
    uid +
    " AND message.listing_id = listing.id; ";

  await db.execute(query, (err, result) => {
    if (err) {
      req.buyerMessages = "";
      next();
    }
    req.buyerMessages = result;
    next();
  });
}

async function getConversation(req, res, next) {
  var sellerId = req.sellerId;
  var buyerId = req.buyerId;
  var listingId = req.listingId;

  var query =
    "SELECT DISTINCT message.buyer_id, message.seller_id, listing.title, message.listing_id, message.message, message.date FROM message, listing WHERE seller_id = " +
    sellerId +
    " AND buyer_id = " +
    buyerId +
    " AND listing_id = " +
    listingId +
    " AND message.listing_id = listing.id ORDER BY date ASC";

  await db.execute(query, (err, result) => {
    if (err) {
      req.conversation = "";
      next();
    }
    req.conversation = result;
    next();
  });
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

async function contactSeller(req, res, next) {
  var message = req.body.message;
  var buyerId = req.user.id;
  var sellerId = req.body.sellerId;
  var listingId = req.body.listingId;

  await db.execute(
    `INSERT INTO message (
        id, message, buyer_id, seller_id, listing_id, date) VALUES (?,?,?,?,?,?) `,
    ["NULL", message, buyerId, sellerId, listingId, "NULL"],
    (err, results) => {
      if (err) {
        next();
      }
      next();
    }
  );
}

async function createMessage(req, res, next) {
  var message = req.body.message;
  var buyerId = req.body.buyerId;
  var sellerId = req.body.sellerId;
  var listingId = req.body.listingId;

  await db.execute(
    `INSERT INTO message (
            id, message, buyer_id, seller_id, listing_id, date) VALUES (?,?,?,?,?,?) `,
    ["NULL", message, buyerId, sellerId, listingId, "NULL"],
    (err, results) => {
      if (err) {
        next();
      }
      next();
    }
  );
}

router.get(
  "/userMessages",
  getCategories,
  getSellerMessages,
  getBuyerMessages,
  (req, res) => {
    var categoriesList = req.categoriesList;
    var sellerMessages = req.sellerMessages;
    var buyerMessages = req.buyerMessages;
    // res.render("pages/userMessages", {
    //   sellerMessages: sellerMessages,
    //   buyerMessages: buyerMessages,
    //   categoriesList: categoriesList,
    //   searchTerm: "",
    //   searchCategory: "All"
    // });
  }
);

router.get(
  "/getConversation",
  //getCategories,
  getConversation,
  (req, res) => {
    // var categoriesList = req.categoriesList;
    var conversation = req.conversation;
    // render message box with conversation
  }
);

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

router.post("/contactSeller", getCategories, contactSeller, (req, res) => {});

router.post("/message", getCategories, createMessage, (req, res) => {});
