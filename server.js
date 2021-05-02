var express = require('express');
var app = express();

const PORT = 3003;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public/assets'));

app.get('/', async function (req, res) {
  res.render('pages/index');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});