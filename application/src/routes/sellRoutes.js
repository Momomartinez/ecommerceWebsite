const express = require("express");
const multer = require('multer');
const Jimp = require('jimp');
const path = require('path');
const db = require("../models/database.js");
const router = express.Router();

//Set Storage for file uploads
const storage = multer.diskStorage({
    destination: '../public/images/',
    filename(req, file, cb) {
        cb(null, file.fieldname + '-'+Date.now() +
        path.extname(file.originalname));
    },
});
// const storage = multer.diskStorage({
//     destination(req, file, cb) {
//         cb(null, 'uploads');
//     },
//     filename(req, file, cb) {
//         cb(null, `${file.fieldname}-${Date.now()}`);
//     },
// });

//Initialize the upload variable
const upload = multer({ storage });

async function getCategories(req, res, next) {
    await db.execute("SELECT * FROM category", (err, categories) => {
        if (err) throw err;
        req.categoriesList = categories;
        next();
    });
}

async function makeThumb(path) {
    try {
        const buffer = await Jimp.read(path)
            .then(lenna => lenna
                .resize(300, Jimp.AUTO) // resize
                .quality(60) // set JPEG quality
                .getBufferAsync(Jimp.MIME_JPEG));
        return buffer;
    } catch (err) {
        return 'err';
    }
}


//gets search results and renders searchpage
router.get("/sell", getCategories, (req, res) => {
    // var searchResult = req.searchResult;
    var categoriesList = req.categoriesList;
    var userid = req.user.id;

    res.render("pages/postlistings", {
        // cards: searchResult,
        categoriesList: categoriesList,
        searchTerm: req.query.search,
        searchCategory: req.query.category
    });
});


router.post('/sell',  upload.single('thumb'), (req, res) => {
    // const img = fs.readFileSync(req.file.path);
    (async () => {
        let thumb;
        if (req.file) {
            thumb = await makeThumb(req.file.path);
            console.log(req.file);
        }
        if (thumb === 'err') {
            console.log("there is an error in making tumb");
            //return;
        }

        const insertRes = await db.query(`INSERT INTO listing (
       title, price, description, 
      image, is_sold, date, user_id, category_id
      ) VALUES (?,?,?,?,?,?,?,?) `,
            [req.body.title, req.body.price, req.body.description, req.file.path.substring(9),
                 0, '2019/11/23', req.user.id, 2]);
        console.log("req.body: "+req.user.id);
        console.log("date: "+Date.now());

        res.redirect('register');
    })();

});


module.exports = router;