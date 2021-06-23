const { DataTypes } = require('sequelize');
const db = require('../util/db.util');


const teacher = db.define('teacher', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = teacher;