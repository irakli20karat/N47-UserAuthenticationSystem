var express = require('express');
var User = require('../models/User');
var Todo = require('../models/Todo');
const bcrypt = require('bcrypt');
var router = express.Router();

router.get('/', async function (req, res) {
    var user = await User.findOne({ email: req.session.user.email });
    var todos = await Todo.find({ user: user._id });
    console.log(todos, user._id);

    res.render('dashboard', {
        id: user._id,
        todos: todos,
        error: {}
    });
});

router.post('/todo/create', async function (req, res) {
    try {
        var { title, description } = req.body;
        var todo = await Todo.create({ title, description, user: req.session.user.id });
        res.status(201).redirect('/dashboard')
    } catch (error) {
        res.status(400).redirect('/dashboard')
    }
})

router.post('/todo/update', async function (req, res) {
    try {
        const { title, description } = req.body;
        const isFinished = req.body.isFinished === 'on';

        await Todo.updateOne({ _id: req.body.id }, { title, description, isFinished });

        res.redirect('/dashboard');
    } catch (error) {
        res.status(400).redirect('/dashboard');
    }
});

router.post('/todo/delete', async function (req, res) {
    try {
        await Todo.deleteOne({ _id: req.body.id });

        res.redirect('/dashboard');
    } catch (error) {
        res.status(400).redirect('/dashboard');
    }
});

module.exports = router;
