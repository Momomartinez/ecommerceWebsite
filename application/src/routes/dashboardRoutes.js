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

  var query =
    "SELECT DISTINCT user.username, message.sender_id FROM message, user WHERE message.receiver_id = " +
    uid +
    " AND user.id = message.sender_id;";

  await db.execute(query, (err, result) => {
    if (err) {
      req.userMessages = "";
      next();
    }
    req.userMessages = result;
    next();
  });
}

async function getConversation(req, res, next) {
  var uid = req.user.id;
  var partnerId = req.query.partnerId;
  //var listingId = req.listingId;

  var query =
    "SELECT DISTINCT user.username, message.sender_id, message.receiver_id, message.message, message.date FROM message, user WHERE ((message.receiver_id = " +
    uid +
    " && message.sender_id = " +
    partnerId +
    ") || (message.receiver_id = " +
    partnerId +
    " && message.sender_id = " +
    uid +
    ")) AND user.id = message.sender_id ORDER BY date ASC;";

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

// async function contactSeller(req, res, next) {
//   var message = req.body.message;
//   var buyerId = req.user.id;
//   var sellerId = req.body.sellerId;
//   var listingId = req.body.listingId;

//   await db.execute(
//     `INSERT INTO message (
//         id, message, buyer_id, seller_id, listing_id, date) VALUES (?,?,?,?,?,?) `,
//     ["NULL", message, buyerId, sellerId, listingId, "NULL"],
//     (err, results) => {
//       if (err) {
//         next();
//       }
//       next();
//     }
//   );
// }

async function createMessage(req, res, next) {
  var message = req.body.message;
  var senderId = req.body.buyerId;
  var receiverId = req.body.sellerId;
  //var listingId = req.body.listingId;

  await db.execute(
    `INSERT INTO message (
            id, message, sender_id, receiver_id, date) VALUES (?,?,?,?,?) `,
    ["NULL", message, buyerId, sellerId, "NULL"],
    (err, results) => {
      if (err) {
        next();
      }
      next();
    }
  );
}

router.get("/userMessages", getCategories, getMessages, (req, res) => {
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
});

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
