const { Sequelize, DataTypes } = require('sequelize');
const db = require('../util/db.util');

const contact = db.define('contact', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
});

module.exports = contact;