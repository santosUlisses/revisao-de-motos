const { DataTypes } = require('sequelize');
const conn = require('../db/db');

const User = conn.define('User', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
    },
    nomeusuario: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
    },
    email: {
        type: DataTypes.STRING,
    },
    senha: {
        type: DataTypes.STRING,
        required: true,
    }
});

module.exports = User;