const autenticarAdm = (req, res, next) => {
    const userAdm = req.session.admin
    if (!userAdm) {
        return res.redirect('/logado');
    }
    next();
}

module.exports = autenticarAdm;