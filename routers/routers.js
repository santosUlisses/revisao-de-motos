const express = require('express');
const router = express.Router();
const Codigos = require('../controller/controller');

const autenticarUser = require('../middleware/autenticarUser');
const autenticarAdm = require('../middleware/autenticarAdm');

router.get('/registrar', Codigos.pageRegistrar);
router.post('/registrar', Codigos.registrar);
router.get('/login', autenticarUser, Codigos.pageLogin);
router.post('/authlogin', Codigos.authLogin);
router.get('/logado', autenticarUser, Codigos.pageLogado);
router.get('/edit/user/:id', autenticarUser, Codigos.pageEditUser);
router.post('/edit/user', Codigos.editUser);
router.get('/addMotos', autenticarUser, Codigos.pageAddMotos);
router.post('/addMotos', Codigos.addMotos);
router.get('/listMotos', autenticarUser, Codigos.listMotos);
router.post('/deletemoto/:id', Codigos.deletarMoto);
router.get('/logout', Codigos.logOut);
router.get('/paineladm', autenticarAdm, Codigos.pagAdm);
router.get('/removerusuario', autenticarAdm, Codigos.listUser);
router.post('/delete/user/:id', Codigos.deleteUser);
router.get('/revisao/:id', Codigos.pageAgendarRevisao);
router.post('/addrevisao', Codigos.agendarRevisao);
router.get('/listRevisao', autenticarUser, Codigos.listRevisao);
router.post('/revisao/delete/:id', Codigos.cancelarRevisao);
router.get('/listRevisaoUsers', autenticarAdm, Codigos.listRevisaoUsers);
router.post('/revisao/edit', Codigos.editRevisao);




module.exports = router;