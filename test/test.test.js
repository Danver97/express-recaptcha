require('dotenv').config()
const express = require('express');
const fs = require('fs');
const recaptcha = require('../index');

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.set('view engine', 'ejs');

const recaptchaMiddleware = recaptcha({ siteSecret: process.env.SITE_SECRET });

app.get('/', async (req, res) => {
    res.render('index.ejs', { siteKey: process.env.SITE_KEY, success: false });
    // res.json({ message: '/endpoint' });
});

app.post('/endpoint', recaptchaMiddleware, (req, res) => {
    res.json({ message: '/endpoint' });
    // res.render('index.ejs', { siteKey: process.env.SITE_KEY });
});

app.listen(3000, () => console.log('Listening on 3000...'));
