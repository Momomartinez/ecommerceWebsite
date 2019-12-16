const express = require("express");
const db = require("../models/database.js");
const router = express.Router();
const passport = require("passport");

async function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) next();
  else res.redirect("/login");
}

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
    "SELECT DISTINCT message.id, listing.user_id AS seller_id, seller.username AS seller, message.sender_id, sender.username AS sender, message.receiver_id, receiver.username AS receiver, message.date, message.listing_id, listing.title AS listing, message.message FROM message, listing, user seller, user sender, user receiver WHERE (message.sender_id = " +
    uid +
    " || message.receiver_id = " +
    uid +
    ") AND message.listing_id = listing.id AND seller.username IN (SELECT username FROM user WHERE user.id = listing.user_id) AND sender.username IN (SELECT username FROM user WHERE user.id = message.sender_id) AND receiver.username IN (SELECT username FROM user WHERE user.id = message.receiver_id) ORDER BY date DESC";

  await db.execute(query, (err, result) => {
    if (err) {
      req.userMessages = "";
      next();
    }
    req.userMessages = result;
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
  var lid = req.body.listingId;
  console.log("lid: ", lid);

  var query = "UPDATE listing SET is_sold = 1 WHERE id = " + lid;
  await db.execute(query, (err, result) => {
    if (err) {
      console.log(err);
    }
    next();
  });
}

async function deleteListing(req, res, next) {
  var lid = req.body.listingId;
  console.log("lid: ", lid);

  var query = "DELETE FROM listing WHERE id = " + lid;
  await db.execute(query, (err, result) => {
    if (err) {
      console.log(err);
    }
    next();
  });
}

async function createMessage(req, res, next) {
  var message = req.body.message;
  var senderId = req.user.id;
  var receiverId = req.body.receiverId;
  var listingId = req.body.listingId;

  // console.log("senderId:", senderId);
  // console.log("message:", message);
  // console.log("receiverId:", receiverId);
  // console.log("listingId:", listingId);

  var query =
    `INSERT INTO message (message, sender_id, receiver_id, listing_id ) VALUES ( "` +
    message +
    `", ` +
    senderId +
    `, ` +
    receiverId +
    `, ` +
    listingId +
    `)`;

  console.log("query = ", query);

  await db.execute(query, (err, results) => {
    if (err) {
      console.log(err);
      next();
    }
    console.log("Succesful message");
    next();
  });
}

router.get(
  "/dashboard",
  checkAuthentication,
  getCategories,
  getMessages,
  getListings,
  (req, res) => {
    var categoriesList = req.categoriesList;
    var userMessages = req.userMessages;
    var userListings = req.listings;
    var userId = req.user.id;
    var username = req.user.username;
    console.log("username: ", username);

    // res.render("pages/dashboard", {
    //   userMessages: userMessages,
    //   userListings: userListings,
    //   categoriesList: categoriesList,
    //   searchTerm: "",
    //   searchCategory: "All"
    // });

    res.render("pages/messages", {
      categoriesList: categoriesList,
      searchTerm: "",
      searchCategory: "All",
      emails: userMessages,
      cards: userListings,
      userId: userId,
      isLoggedIn: req.isAuthenticated(),
      username: username
    });
  }
);

router.post(
  "/updateListing",
  checkAuthentication,
  updateListing,
  (req, res) => {
    res.redirect("/dashboard");
  }
);

router.post(
  "/deleteListing",
  checkAuthentication,
  deleteListing,
  (req, res) => {
    res.redirect("/dashboard");
  }
);

router.post("/message", checkAuthentication, createMessage, (req, res) => {
  res.redirect("/dashboard");
});

// async function getConversation(req, res, next) {
//   var uid = req.user.id;
//   var partnerId = req.query.partnerId;
//   //var listingId = req.listingId;

//   var query =
//     "SELECT DISTINCT user.username, message.sender_id, message.receiver_id, message.message, message.date FROM message, user WHERE ((message.receiver_id = " +
//     uid +
//     " && message.sender_id = " +
//     partnerId +
//     ") || (message.receiver_id = " +
//     partnerId +
//     " && message.sender_id = " +
//     uid +
//     ")) AND user.id = message.sender_id ORDER BY date ASC;";

//   await db.execute(query, (err, result) => {
//     if (err) {
//       req.conversation = "";
//       next();
//     }
//     req.conversation = result;
//     next();
//   });
// }

// router.get("/userMessages", getCategories, getMessages, (req, res) => {
//   var categoriesList = req.categoriesList;
//   var userMessages = req.userMessages;

//   // res.render("pages/userMessages", {
//   //
//   //   categoriesList: categoriesList,
//   //   searchTerm: "",
//   //   searchCategory: "All"
//   // });
// });

// router.get(
//   "/getConversation",
//   //getCategories,
//   getConversation,
//   (req, res) => {
//     // var categoriesList = req.categoriesList;
//     var conversation = req.conversation;
//     // render message box with conversation
//   }
// );

// router.get("/userListings", getCategories, getListings, (req, res) => {
//   var categoriesList = req.categoriesList;
//   var userListings = req.listings;
//   // res.render("pages/userListings", {
//   //   cards: userListings,
//   //   categoriesList: categoriesList,
//   //   searchTerm: "",
//   //   searchCategory: "All"
//   // });
// });

module.exports = router;