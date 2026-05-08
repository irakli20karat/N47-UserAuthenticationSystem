function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }

    res.status(401).redirect('/auth/login');
}

module.exports = isAuthenticated;