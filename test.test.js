const express = require('express');
const recaptcha = require('./index');

const app = express();

app.use(express.json);
app.use(express.urlencoded);

app.post('/endpoint', recaptcha(), (req, res) => {
    res.json({ message: '/endpoint' });
});


