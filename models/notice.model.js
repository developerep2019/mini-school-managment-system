// Database connection => 
const db = require('../util/db.util');
const { DataTypes } = require('sequelize');

const notice = db.define('notice', {
    title: {
        allowNull: false,
        type: DataTypes.STRING
    },
    file: {
        allowNull: false,
        type: DataTypes.STRING
    }
})

module.exports = notice;