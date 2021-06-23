const db = require('../util/db.util');
const { DataTypes } = require('sequelize');

const user = db.define('user', {
    user: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    pass: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = user;

