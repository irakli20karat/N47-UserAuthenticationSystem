var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/User');

router.get('/register', function (req, res, next) {
  res.render('register', { errors: {}, formData: {} });
});

router.post('/register', async function (req, res, next) {
  try {
    var user = await User.create(req.body);
    res.status(201).redirect('/auth/login');
  } catch {
    let errors = {};
    const existingUser = await User.findOne({ email: req.body.email });

    if (req.body.password.trim().length < 6) errors.password = 'Password must be at least 6 characters long!'
    if (existingUser) errors.email = 'User with the same email already exists!'

    res.status(400).render('register', { errors: errors });
  }
})

module.exports = router;
