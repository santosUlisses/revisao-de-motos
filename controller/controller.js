const bcrypt = require('bcrypt');

const Motos = require('../models/Motos');
const User = require('../models/User');
const Revisao = require('../models/Revisao');


class Codigos {
    pageLogin(req, res) {
        if (req.session.userId) {
            res.redirect('/logado');
        }
        res.render('login')
    }

    async authLogin(req, res) {
        const nomeusuario = req.body.nomeusuario;
        const senha = req.body.senha;
        let auth = false
        try {
            const user = await User.findOne({ where: { nomeusuario: nomeusuario }, raw: true });
            if (user) {
                auth = await bcrypt.compare(senha, user.senha);
            }

            if (auth === true) {
                req.session.userId = user.id;
                req.session.nomeusuario = user.nomeusuario;
                req.session.email = user.email;
                console.log(`SESSÃO INICIADA`);
                if (req.session.email === 'ulisses.gc@hotmail.com') {
                    console.log('acesso adm');
                    req.session.admin = 'admin'
                    res.redirect('/paineladm');
                }
                console.log(req.session);
                res.redirect('/logado');
            } else {
                res.render('login', { erro: true })
            }
        } catch (error) {
            console.log(error)
        }

    }


    pageAddMotos(req, res) {
        if (req.session.userId) {
            res.render('addMotos');
        } else {
            res.redirect('/login');
        }
    }

    async addMotos(req, res) {
        const userId = req.session.userId;
        const nomeMoto = req.body.nome;
        try {
            Motos.create({ nome: nomeMoto, UserId: userId });
            res.redirect('/listMotos');
        } catch (error) {
            console.log(error);
        }
    }

    async deletarMoto(req, res) {
        const id = req.params.id;
        await Motos.destroy({ where: { id: id } });
        res.redirect('/listMotos');
    }

    async listMotos(req, res) {
        if (req.session.userId) {
            const userId = req.session.userId;
            const motos = await Motos.findAll({ where: { UserId: userId }, raw: true });
            res.render('motos', { motos });
        } else {
            res.redirect('/login');
        }
    }

    logOut(req, res) {
        req.session.destroy((error) => {
            if (error) {
                console.log(error)
            }
            res.clearCookie('connect.sid');
            res.redirect('/login');
        });
    }

    pageLogado(req, res) {
        if (req.session.userId) {
            res.render('logado');
        } else {
            res.redirect('/login')
        }
    }

    pageRegistrar(req, res) {
        res.render('registrar');
    }

    async registrar(req, res) {
        const nome = req.body.nome;
        const nomeusuario = req.body.nomeusuario;
        const email = req.body.email;
        const senha = req.body.senha;
        const salt = await bcrypt.genSalt(10);
        const hSenha = await bcrypt.hash(senha, salt);
        const verificarEmail = await User.findOne({ where: { email: email } });
        if (verificarEmail) {
            res.render('registrar', { verificarEmail });
            return
        } else {
            try {
                await User.create({ nome, nomeusuario, email, senha: hSenha });
            } catch (error) {
                console.log(`erro ao criar${error}`);
            }
            res.redirect('/login');
        }
    }

    async pagAdm(req, res) {
        const numRevisao = ((await Revisao.findAll()).filter(rev => rev.status === "agendado")).length
        res.render('paineladm', { numRevisao });
    }

    async pageEditUser(req, res) {
        const id = req.session.userId
        try {
            const user = await User.findOne({ where: { id: id }, raw: true });
            res.render('editarDados', { user, userId: id });
        } catch (error) {
            console.log(error)
        }
    }

    async editUser(req, res) {
        const { id, nome, nomeusuario, email, senha } = req.body;
        console.log({ id, nome, nomeusuario, email, senha })
        const salt = await bcrypt.genSalt(10)
        const senhaCript = await bcrypt.hash(senha, salt);
        try {
            await User.update({ nome, nomeusuario, email, senha: senhaCript }, { where: { id: id } });
            res.redirect('/logado');
        } catch (error) {
            console.log(error)
        }
    }

    async listUser(req, res) {
        const users = await User.findAll({ include: Motos }, { raw: true });
        const userFilter = users.filter(user => user.id != 1).map(user => user.get({ plain: true }));

        res.render('removerusuario', { userFilter });
    }
    async deleteUser(req, res) {
        const id = req.params.id
        await Revisao.destroy({ where: { UserId: id } });
        await Motos.destroy({ where: { UserId: id } });
        await User.destroy({ where: { id: id } });
        res.redirect('/removerusuario');
    }

    async pageAgendarRevisao(req, res) {
        const motoId = req.params.id
        const userId = req.session.userId
        res.render('revisao', { motoId, userId });
    }

    async agendarRevisao(req, res) {
        const date = req.body.date;
        const motoId = req.body.motoId;
        const userId = req.session.userId;
        console.log(date);
        await Revisao.create({ data: date, UserId: userId, MotoId: motoId });
        res.redirect('/listRevisao');
    }

    async listRevisao(req, res) {
        const id = req.session.userId;
        const revisoes = (await Revisao.findAll({
            where: { userId: id },
            include: [{ model: Motos, attributes: ['nome'] }]
        })).map(rev => {
            const plain = rev.get({ plain: true });
            plain.dataFormatada = new Date(plain.data).toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });

            return plain;
        });
        const revisaoAgendada = revisoes.filter(rev => rev.status === "agendado");
        const revisaoAndamento = revisoes.filter(rev => rev.status === "em andamento");
        const revisaoConcluido = revisoes.filter(rev => rev.status === "concluido");

        res.render('listRevisao', { revisaoAgendada, revisaoAndamento, revisaoConcluido });
    }

    async listRevisaoUsers(req, res) {
        const revisoes = (await Revisao.findAll({
            include: [{ model: Motos, attributes: ['nome'] },
            { model: User, attributes: ['nome'] }]
        })).map(revisao => {
            const plain = revisao.get({ plain: true });
            plain.dataFormatada = new Date(plain.data).toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });

            return plain;
        });
        const revisoesAgendada = revisoes.filter(rev => rev.status === "agendado")
        const revisoesAndamento = revisoes.filter(rev => rev.status === "em andamento")
        const revisoesConcluido = revisoes.filter(rev => rev.status === "concluido")

        res.render('listRevisaoUsers', { revisoes, revisoesAgendada, revisoesAndamento, revisoesConcluido });
    }

    async cancelarRevisao(req, res) {
        const id = req.params.id
        await Revisao.destroy({ where: { id: id } });
        res.redirect('/listRevisao');
    }

    async editRevisao(req, res) {
        const id = req.body.id;
        const status = req.body.status;
        const descricao = req.body.descricao;
        console.log({ id, status, descricao });
        try {
            await Revisao.update({ status: status, descricao: descricao }, { where: { id: id } });
        } catch (error) {
            console.log(error)
        }
        res.redirect('/listRevisaoUsers');

    }

}

module.exports = new Codigos();