require('dotenv').config();
const express = require('express');
const app = express();
const formidable = require('formidable');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const process = require('process');
const fetch = require('node-fetch');

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
    var verified = await checkCaptcha(fields['g-recaptcha-response']);
    if (verified === true) {
      mailgunClient.messages.create(process.env.MAILGUN_SENDING_DOMAIN, {
        from: fields.name + " <mailgun@" + process.env.MAILGUN_SENDING_DOMAIN + ">",
        to: [process.env.CONTACT_FORM_RECEIVING_EMAIL],
        subject: "Contact Me -- " + fields.name || "",
        html: "<h4>Name: " + fields.name + "</h4>" +
        "<h4>Email: " + fields.email + "</h4>" +
        "<h4>Phone: " + fields.phone + "</h4>" +
        "<p>Message: " + fields.message + "</p>"
      })
      .then(msg => console.log("mailgun response: ", msg)) // logs response data
      .catch(err => console.err("mailgun error: ", err)); // logs any error
    }
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

var application = {};

process.on('SIGINT', function onSigint() {
  application.shutdown();
});

process.on('SIGTERM', function onSigterm() {
  application.shutdown();
});

application.shutdown = function () {
  // clean up your resources and exit
  process.exit();
};

const checkCaptcha = async (captcha_response) => {
  var verified = false;
  if (captcha_response) {
    var secret = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${captcha_response}`, {
      method: 'post',
    });
    const json = await response.json();
    console.log('verification response: ', json);
    if (json.success === true) {
      verified = true;
    }
  }
  return verified;
}

module.exports = application;