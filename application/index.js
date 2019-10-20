const express = require('express');
const path = require('path');
const PORT = 3000;

const app = express();
const aboutRouter = require('./src/routes/aboutRoutes');
app.set('views', path.join(__dirname, './src/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, './public')));
app.use('/about', aboutRouter);

app.get('/', (req, res) => {
  var items = [
    { itemImage: 'images/chair.jpg', itemName: 'chair', itemPrice: '$100.00' },
    {
      itemImage: 'images/greenCouch.jpg',
      itemName: 'chair',
      itemPrice: '$80.00'
    },
    { itemImage: 'images/stool.jpg', itemName: 'chair', itemPrice: '$20.00' },
    {
      itemImage: 'images/bluechair.jpg',
      itemName: 'chair',
      itemPrice: '$30.00'
    }
  ];
  res.render('pages/mainpage', { cards: items });
});

app.listen(PORT, () => console.log('server started on port', PORT));
