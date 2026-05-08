var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcrypt')
var User = require('../models/User');

router.get('/login', function (req, res, next) {
    res.render('login', { errors: {} });
});

router.post('/login', async function (req, res, next) {
    try {
        var user = await User.findOne({ email: req.body.email });
        if (user) {
            var match = await bcrypt.compare(req.body.password, user.password);
            if (match) {
                req.session.user = {
                    id: user._id,
                    email: user.email
                };
                res.status(200).redirect('/dashboard');
                return;
            }
        }
        res.render('login', { errors: 'login_failed' });
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;
