// config/database.js
const { Sequelize } = require('sequelize');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite' // This is where your SQLite file will be stored
});

module.exports = sequelize;
