//requerer somente o metodo DataTypes do Sequelize
const { DataTypes } = require('sequelize')
//requerer a conexão com banco
const conn = require('../db/conn')

//definir o model user
const User = conn.define('users', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        //nao deixa ter dois usuarios com o mesmo email
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = User
