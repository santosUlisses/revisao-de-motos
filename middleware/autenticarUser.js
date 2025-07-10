const autenticar = (req, res, next) => {
    const user = req.session.userId
    if (!user) {
        return res.render('login');
    }
    next();
}

module.exports = autenticar;