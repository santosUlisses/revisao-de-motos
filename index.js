const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');

const app = express();
const conn = require('./db/db.js');


app.use(session({
    secret: ' ',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 360000 },
}));

app.use((req, res, next) => {
    res.locals.nomeusuario = req.session.nomeusuario || null;
    res.locals.sessaoAtiva = !!req.session.userId;
    res.locals.admin = !!req.session.admin;
    next();
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.use(express.static('public'));


const rotas = require('./routers/routers.js');

app.use('/', rotas);
app.use((req, res) => { res.status(404).render('404') });




conn.sync({ force: false }).then(() => { app.listen(3000) }).catch(error => console.log(error));
