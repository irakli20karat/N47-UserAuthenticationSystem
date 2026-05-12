var express = require('express');
var User = require('../models/User');
const bcrypt = require('bcrypt');
var router = express.Router();

router.get('/', async function (req, res, next) {
    var user = await User.findOne({ email: req.session.user.email });
    res.render('dashboard', {
        bio: {
            id: user._id
        }
    });
});

module.exports = router;
