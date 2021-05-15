require('dotenv').config();
const express = require('express');
const app = express();
const formidable = require('formidable');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const PORT = 3003;
const mailgunClient = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
  public_key: process.env.MAILGUN_PUBLIC_KEY || ''
});

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public/assets'));

app.get('/', async function (req, res) {
  res.render('pages/index');
});

app.post('/contact', async (req, res) => {
  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields) => {
    if (err) {
      next(err);
      return;
    }
    console.log(fields);
    let contactMeEmail = mailgunClient.messages.create(process.env.MAILGUN_SENDING_DOMAIN, {
      from: fields.name + " <mailgun@" + process.env.MAILGUN_SENDING_DOMAIN + ">",
      to: [process.env.CONTACT_FORM_RECEIVING_EMAIL],
      subject: "Contact Me -- " + fields.name || "",
      html: "<h4>Name: " + fields.name + "</h4>" +
      "<h4>Email: " + fields.email + "</h4>" +
      "<h4>Phone: " + fields.phone + "</h4>" +
      "<p>Message: " + fields.message + "</p>"
    })
    .then(msg => console.log(msg)) // logs response data
    .catch(err => console.log(err)); // logs any error
    redirectTo("/", res);
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

function redirectTo(location, res) {
  try {
    res.statusCode = 302;
    res.setHeader('Location', location);
    return res.end();
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    return res.end();
  }
}