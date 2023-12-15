import 'dotenv/config'
import express from 'express';
const app = express();
import formidable from 'formidable';
import * as FormData from 'form-data';
import Mailgun from 'mailgun.js';
const mailgun = new Mailgun(FormData);
import process from 'process';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3003;
const mailgunClient = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
  public_key: process.env.MAILGUN_PUBLIC_KEY || ''
});

import BLACKLIST from './blacklist.js';

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public/assets'));
app.disable('x-powered-by');

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
    if (checkBlacklist(fields.name, fields.email)) {
      fs.appendFileSync('blacklisted.log', "(" + currentTime() + ") - " + JSON.stringify(fields) + "\n");
      res.status(418);
      return res.send("I'm a teapot");
    }
    //console.log(fields);

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

const checkBlacklist = (name, email) => {
  let blacklisted = false;
  if (BLACKLIST.includes(name.toLowerCase()) || BLACKLIST.includes(email.toLowerCase())) {
    blacklisted = true;
  }
  return blacklisted;
}

const currentTime = () => {
  var date_ob = new Date();
  var day = ("0" + date_ob.getDate()).slice(-2);
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var year = date_ob.getFullYear();

  var hours = date_ob.getHours();
  var minutes = date_ob.getMinutes();
  var seconds = date_ob.getSeconds();

  var dateTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
  return dateTime;
}