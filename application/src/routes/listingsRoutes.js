var express = require('express');
var router = express.Router();

router.get('/search', (req, res) => {
  var items = [
    { itemImage: '/images/chair.jpg', itemName: 'Chair', itemPrice: '$100.00' },
    {
      itemImage: '/images/greenCouch.jpg',
      itemName: 'Couch',
      itemPrice: '$80.00'
    },
    { itemImage: '/images/stool.jpg', itemName: 'Stool chair', itemPrice: '$20.00' },
    {
      itemImage: '/images/bluechair.jpg',
      itemName: 'Desk chair',
      itemPrice: '$30.00'
    },
    { itemImage: '/images/chair.jpg', itemName: 'Chair', itemPrice: '$100.00' },
    {
      itemImage: '/images/greenCouch.jpg',
      itemName: 'Couch',
      itemPrice: '$80.00'
    },
    { itemImage: '/images/stool.jpg', itemName: 'chair', itemPrice: '$20.00' },
    {
      itemImage: '/images/bluechair.jpg',
      itemName: 'chair',
      itemPrice: '$30.00'
    },
    { itemImage: '/images/chair.jpg', itemName: 'chair', itemPrice: '$100.00' },
    {
      itemImage: '/images/greenCouch.jpg',
      itemName: 'chair',
      itemPrice: '$80.00'
    },
    { itemImage: '/images/stool.jpg', itemName: 'chair', itemPrice: '$20.00' },
    {
      itemImage: '/images/bluechair.jpg',
      itemName: 'chair',
      itemPrice: '$30.00'
    }
  ];

  res.render('pages/categoriesList', { cards: items });
});

module.exports = router;
