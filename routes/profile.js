var express = require('express');
var User = require('../models/User');
const bcrypt = require('bcrypt');
var router = express.Router();

router.get('/', async function (req, res, next) {
    var user = await User.findOne({ email: req.session.user.email });
    res.render('profile', {
        bio: {
            userName: user.email.charAt(0).toUpperCase() + user.email.split('@')[0].slice(1),
        }
    });
});

router.get('/logOut', async function (req, res, next) {
    req.session.destroy();
    res.status(200).redirect('/auth/login');
})

router.get('/changePassword', function (req, res, next) {
    res.render('changePassword', { errors: {} });
});

router.post('/changePassword', async function (req, res, next) {
    try {
        const user = await User.findOne({ email: req.session.user.email });

        let oldPassword = req.body.oldPassword.trim();
        if (!bcrypt.compare(oldPassword, user.password)) {
            res.status(400).render('changePassword', { errors: { oldPassword: 'Old password is incorrect!' } });
            return;
        }

        if (user) {
            user.password = req.body.newPassword.trim();
            await user.save();
            req.session.destroy();
        }
        res.status(200).redirect('/auth/login');
    } catch {
        let errors = {};

        if (req.body.newPassword.trim().length < 8) errors.password = 'Password must be at least 8 characters long!'
        res.status(400).render('changePassword', { errors: errors });
    }
})

module.exports = router;
