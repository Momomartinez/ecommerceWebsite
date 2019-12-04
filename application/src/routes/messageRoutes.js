const express = require('express');
const db = require('../models/database.js');
const router = express.Router();

async function getCategories(req, res, next) {
  await db.execute('SELECT * FROM category', (err, categories) => {
    if (err) throw err;
    //console.log(categories);
    req.categoriesList = categories;
    next();
  });
}

async function getRecentListings(req, res, next) {
  let query =
    'SELECT listing.id, listing.title, listing.price, listing.description, listing.image, listing.is_sold, listing.date, category.name FROM listing INNER JOIN category ON listing.category_id = category.id WHERE is_sold = 0 ORDER BY date DESC LIMIT 9;';

  await db.execute(query, (err, results) => {
    if (err) {
      req.searchResult = '';
      next();
    }
    req.searchResult = results;
    next();
  });
}

async function getRecentElectronics(req, res, next) {
  let electronicsQ =
    'SELECT * FROM listing WHERE category_id = 1 AND is_sold = 0 ORDER BY date DESC LIMIT 3;';

  await db.execute(electronicsQ, (err, recentElectronics) => {
    if (err) {
      req.recentElectronics = '';
      next();
    }
    req.recentElectronics = recentElectronics;
    next();
  });
}
async function getRecentBooks(req, res, next) {
  let booksQ =
    'SELECT * FROM listing WHERE category_id = 2 AND is_sold = 0 ORDER BY date DESC LIMIT 3;';

  await db.execute(booksQ, (err, recentBooks) => {
    if (err) {
      req.recentBooks = '';
      next();
    }
    req.recentBooks = recentBooks;
    next();
  });
}
async function getRecentFurniture(req, res, next) {
  let furnitureQ =
    'SELECT * FROM listing WHERE category_id = 3 AND is_sold = 0 ORDER BY date DESC LIMIT 3;';

  await db.execute(furnitureQ, (err, recentFurniture) => {
    if (err) {
      req.recentFurniture = '';
      next();
    }
    req.recentFurniture = recentFurniture;
    next();
  });
}
async function getRecentOther(req, res, next) {
  let otherQ =
    'SELECT * FROM listing WHERE category_id = 4 AND is_sold = 0 ORDER BY date DESC LIMIT 3;';

  await db.execute(otherQ, (err, recentOther) => {
    if (err) {
      req.recentOther = '';
      next();
    }
    req.recentOther = recentOther;
    next();
  });
}

//Search function
async function search(req, res, next) {
  var searchTerm = req.query.search;
  var category = req.query.category;

  let join =
    'SELECT listing.id, listing.title, listing.price, listing.description, listing.image, listing.is_sold, listing.date, category.name FROM listing INNER JOIN category ON listing.category_id = category.id';
  let query = '';
  if (searchTerm != '' && category != '' && category != 'All') {
    query =
      ` WHERE name = '` +
      category +
      `' AND (title LIKE '%` +
      searchTerm +
      `%' OR description LIKE '%` +
      searchTerm +
      `%') AND is_sold = 0;`;
  } else if (searchTerm != '' && (category == '' || category == 'All')) {
    query =
      ` WHERE (title LIKE '%` +
      searchTerm +
      `%' OR description LIKE '%` +
      searchTerm +
      `%') AND is_sold = 0;`;
  } else if (searchTerm == '' && category != '' && category != 'All') {
    query = ` WHERE name = '` + category + `' AND is_sold = 0;`;
  } else if (searchTerm == '' && category == 'All') {
    query = ` WHERE is_sold = 0;`;
  }

  let sql = join + query;
  //console.log("this is sql: " + sql);
  await db.execute(sql, (err, result) => {
    if (err) {
      req.searchResult = '';
      next();
    }
    req.searchResult = result;
    next();
  });
}

//Landing page
router.get('/', getRecentListings, getCategories, (req, res) => {
  var searchResult = req.searchResult;
  var categoriesList = req.categoriesList;
  res.render('pages/mainpage', {
    cards: searchResult,
    categoriesList: categoriesList,
    searchTerm: '',
    searchCategory: 'All'
  });
});

router.get('/posts', (req, res) => {
  res.render('partials/postlistings', {});
});

//search
//gets search results and renders searchpage
router.get('/search', search, getCategories, (req, res) => {
  var searchResult = req.searchResult;
  var categoriesList = req.categoriesList;
  res.render('pages/mainpage', {
    cards: searchResult,
    categoriesList: categoriesList,
    searchTerm: req.query.search,
    searchCategory: req.query.category
  });
});

// // Message page
// router.get('/msgs', getCategories, (req, res) => {
//   var categoriesList = req.categoriesList;
//   res.render('pages/messages', {
//     categoriesList: categoriesList,
//     searchTerm: '',
//     searchCategory: 'All'
//   });
// });

router.get('/msgs', function(req, res, next) {
  let emailsRecieved = [
    {
      sender: 'Donner Conner',
      publishedAt: new Date('2016-03-19'),
      message: 'some info for some thing i dont know what to sAY...',
      id: 1
    },
    {
      sender: 'Megan Hagen',
      publishedAt: new Date('2016-04-19'),
      message: 'some info for some thing i dont know what to sAY...',
      id: 2
    },
    {
      sender: 'Sally Dolly',
      publishedAt: new Date('2016-06-19'),
      message: 'some info for some thing i dont know what to sAY...',
      id: 3
    }
  ];
  res.render('pages/messages', { emails: emailsRecieved });
});

router.get('/messages/:id', (req,res,next) =>{
  let messagesId = {
    1: {sender:"Conner Conner",
        messages:[
            {send:"seller",
            message:"seller message1",
            timestamp: new Date("2019-03-22")},
            {send:"buyer",
            message:"seller message1",
            timestamp: new Date("2019-03-22")},
            {send:"buyer",
            message:"seller message1",
            timestamp: new Date("2019-03-22")},
            {send:"seller",
            message:"seller message1",
            timestamp: new Date("2019-03-22")},
            {send:"buyer",
            message:"seller message1",
            timestamp: new Date("2019-03-22")}]},
    2: ["message2", "message22"],
    3: ["message33", "message33"],
    
  };
  console.log(req.params.id);
  console.log(JSON.stringify({ messagesId: req.params.id }));
  res.json({"messages":messagesId[req.params.id]});
})

module.exports = router;
