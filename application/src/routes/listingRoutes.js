
const express = require('express');
const db = require('../models/database.js');
const router = express.Router();


async function listingGet(req, res){
    const [type_rows, type_fields] = await db.execute('SELECT * FROM listing_type');
    // const [listing_rows, listing_fields] = await db.execute('SELECT listing.id, listing.title, listing.price, listing.desc, listing.image FROM listing order by listing.id');
    res.render('pages/mainpage', {
        // types: type_rows,
        cards: type_rows,
        body: req.body,
    });
    console.log("this is the cards row " +type_rows);
}

router.route('/')
    .get((req, res) => {
        listingGet(req, res);
    })


router.route('/:id(\\d+)')
    .get((req, res) => {
        console.log("the id is: "+req.params.id);
        let sql = 'SELECT * FROM listing WHERE listing_type_id = ?';
        db.query(sql , req.params.id).then(([results, fields]) => {
            // if (!results || results.length !== 1) {
            //     res.status(404).send('404 - Page Not found');
            //     return;
            // }
            res.render('pages/mainpage', { cards: results});
            console.log(req.params.id);
            console.log("hhhhhhh");
            console.log(results);
            console.log(sql);
            console.log(req.params.id);
        });
    });




module.exports = router;
