
const express = require('express');
const db = require('../models/database.js');
const router = express.Router();


async function listingGet(req, res){
    const [type_rows, type_fields] = await db.execute('SELECT * FROM listing_type');
    const [listing_rows, listing_fields] = await db.execute('SELECT listing.id, listing.title, listing.price, listing.desc, listing.image FROM listing order by listing.id');

    res.render('pages/mainpage', {
        cards: type_rows,
        listings: listing_rows,
        body: req.body,
    });
    console.log(type_rows);
    console.log("hello")
    console.log(listing_rows);
}

router.route('/')
    .get((req, res) => {
        listingGet(req, res);
    })

//     .get((req, res) => {
//     console.log("fffffff");
//     let sql = ' SELECT * FROM listing ';
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
//
//     }
//
//     db.query(sql)
//         .then(([results, _]) => {
//             res.render('pages/index', {
//                 body: req.body,
//                 cards: results,
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

            res.render('pages/mainpage', { cards: results});
            console.log(req.params.id);
            console.log("hhhhhhh");
            console.log(results);
        });
    });




module.exports = router;
