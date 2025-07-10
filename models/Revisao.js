const conn = require('../db/db')
const { DataTypes, ENUM } = require('sequelize');
const User = require('./User');
const Motos = require('./Motos');


const Revisao = conn.define('Revisao', {
    data: {
        type: DataTypes.DATE,
    },
    status: {
        type: ENUM("agendado", "em andamento", "concluido"),
        defaultValue: "agendado",
    },
    descricao: {
        type: DataTypes.STRING,
    }
}, { tableName: "revisoes" });

Revisao.belongsTo(User, {
    foreignKey: {
        allowNull: false
    }
});

Revisao.belongsTo(Motos, {
    foreignKey: {
        allowNull: false
    }
});


module.exports = Revisao;