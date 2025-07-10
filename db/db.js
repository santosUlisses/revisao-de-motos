const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('srm', 'root', '', { host: 'localhost', dialect: 'mysql' });

module.exports = sequelize;