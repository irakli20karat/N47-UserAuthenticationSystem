var express = require('express');
var User = require('../models/User');
var router = express.Router();

router.get('/', async function (req, res, next) {
    var user = await User.findOne({ email: req.session.user.email });
    res.render('dashboard', {
        bio: {
            id: user._id,
            email: user.email,
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
        if (user) {
            user.password = req.body.newPassword;
            await user.save();
            req.session.destroy();
        }
        res.status(200).redirect('/auth/login');
    } catch {
        let errors = {};

        if (req.body.newPassword.trim().length < 6) errors.password = 'Password must be at least 6 characters long!'
        res.status(400).render('changePassword', { errors: errors });
    }
})

module.exports = router;
