
const express = require('express');
const db = require('../models/database.js');
const router = express.Router();

// const listing_type = {
//     Electronics: 1,
//     Books: 2,
//     Furniture: 3,
//     Other: 4,
// };

router.route('/')
    .get((req, res) => {

        db.query(' SELECT listing.id, listing.title, listing.price, listing.desc, listing.image FROM listing order by listing.id ')
            .then(([results, fields]) => {
                res.render('pages/mainpage', {
                    cards: results,
                    body: req.body,
                });
            });
    })
// .post((req, res) => {
//     let sql = 'SELECT * FROM listing ';
//     const conditions = [];
//     console.log(req.body);
//     console.log("fffffff");
//     console.log(req.body.listing_type_id);
//
//     // listing type id - temp solution
//     if (req.body.listing_type_id !== '') {
//         const id = listing_type[req.body.listing_type_id];
//         conditions.push(`listing.listing_type_id = ${id}`);
//     }
//     if (conditions.length !== 0) {
//         sql += ' AND ( ';
//         sql += conditions.join(' AND ');
//         sql += ' ) ';
//     }
//     db.query(sql)
//
//         .then(([results, _]) => {
//             res.render('pages/index', {
//
//
//                 body: req.body,
//                 objectArrayFromDb: results,
//             });
//         });
// });

router.route('/:id(\\d+)')
    .get((req, res) => {
        db.query('SELECT * '
            + 'FROM listing '
            + 'WHERE id = ?', req.params.id).then(([results, fields]) => {

            if (!results || results.length !== 1) {
                res.status(404).send('404 - Page Not found');
                return;
            }

            res.render('pages/mainpage', { objectArrayFromDb: results});
            console.log(req.params.id);
            console.log("hhhhhhh");
            console.log(results);
        });
    });

// router.get("/db", (req, res) => {
//     let sql = 'SELECT category.category_name FROM category';
//     db.query(sql, (err, result) =>{
//     if(err) throw err;
//     res.send(result);
//     });
// });

// let sql = ' SELECT category.category_name FROM category ;
// listingRouter.route('/')
//     .get((req,res) => db.query(sql, (err,result) => {
//         if(err) throw err;
//         res.send('database created ...');
//     })


module.exports = router;
