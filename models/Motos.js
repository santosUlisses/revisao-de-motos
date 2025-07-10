const { DataTypes } = require('sequelize');
const conn = require('../db/db');
const User = require('./User');

const Motos=conn.define('Motos',{
    nome:{
        type:DataTypes.STRING,
    }
});
User.hasMany(Motos);
Motos.belongsTo(User);
module.exports=Motos;