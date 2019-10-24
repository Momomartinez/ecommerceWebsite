const express = require("express");
const db = require("../models/database.js");
const router = express.Router();

// async function listingGet(req, res) {
//   const [type_rows, type_fields] = await db.execute(
//     "SELECT * FROM listing_type"
//   );
//   // const [listing_rows, listing_fields] = await db.execute('SELECT listing.id, listing.title, listing.price, listing.desc, listing.image FROM listing order by listing.id');
//   res.render("pages/mainpage", {
//     // types: type_rows,
//     cards: type_rows,
//     body: req.body
//   });
//   console.log("this is the cards row " + type_rows);
// }

// router.route("/").get((req, res) => {
//   listingGet(req, res);
// });

router.get("/categories", (req, res) => {
  db.query("SELECT * FROM listing_type", (err, rows) => {
    if (err) throw err;
    return res.json(rows);
  });
});

async function search(req, res, next) {
  var searchTerm = req.query.search;
  var categoryName = req.query.category;
  var categoryId = 0;

  var catquery =
    `SELECT * FROM listing_type WHERE name = '` + categoryName + `'`;
  await db.query(catquery, (err, results) => {
    // if (err) throw err;
    if (results.length <= 0) {
      req.searchResult = "";
      console.log("This is the result" + results);
      next();
    } else {
      categoryId = results[0].id;
      console.log("This is categoryId: " + categoryId);
      console.log(results);
      let query = "SELECT * FROM listing";
      if (searchTerm != "" && categoryId != 0) {
        query =
          `SELECT * FROM listing WHERE listing_type_id = '` +
          categoryId +
          `' AND (title LIKE '%` +
          searchTerm +
          `%' OR description LIKE '%` +
          searchTerm +
          `%')`;
      } else if (searchTerm != "" && categoryId == 0) {
        query =
          `SELECT * FROM listing WHERE (title LIKE '%` +
          searchTerm +
          `%' OR description LIKE '%` +
          searchTerm +
          `%')`;
      } else if (searchTerm == "" && categoryId != 0) {
        query =
          `SELECT * FROM listing WHERE listing_type_id = '` + categoryId + `'`;
      }

      console.log(query);
      db.query(query, (err, result) => {
        if (err) {
          req.searchResult = "";
          console.log(result);
          next();
        }
        req.searchResult = result;
        next();
      });
    }
  });
}

//   let query = "SELECT * FROM listing";
//   if (searchTerm != "" && categoryId != 0) {
//     query =
//       `SELECT * FROM listing WHERE listing_type_id = '` +
//       categoryId +
//       `' AND (title LIKE '%` +
//       searchTerm +
//       `%' OR description LIKE '%` +
//       searchTerm +
//       `%')`;
//   } else if (searchTerm != "" && categoryId == 0) {
//     query =
//       `SELECT * FROM listing WHERE (title LIKE '%` +
//       searchTerm +
//       `%' OR description LIKE '%` +
//       searchTerm +
//       `%')`;
//   } else if (searchTerm == "" && categoryId != 0) {
//     query =
//       `SELECT * FROM listing WHERE listing_type_id = '` + categoryId + `'`;
//   }

//   console.log(query);
//   db.query(query, (err, result) => {
//     if (err) {
//       req.searchResult = "";
//       console.log(result);
//       next();
//     }
//     req.searchResult = result;
//     next();
//   });

router.get("/search", search, (req, res) => {
  var searchResult = req.searchResult;
  res.render("pages/mainpage", {
    cards: searchResult
  });

  //res.json(searchResult);
});

// router.route("/:id(\\d+)").get((req, res) => {
//   console.log("the id is: " + req.params.id);
//   let sql = "SELECT * FROM listing WHERE listing_type_id = ?";
//   db.query(sql, req.params.id).then(([results, fields]) => {
//     // if (!results || results.length !== 1) {
//     //     res.status(404).send('404 - Page Not found');
//     //     return;
//     // }
//     res.render("pages/mainpage", { cards: results });
//     console.log(req.params.id);
//     console.log("hhhhhhh");
//     console.log(results);
//     console.log(sql);
//     console.log(req.params.id);
//   });
// });

module.exports = router;
