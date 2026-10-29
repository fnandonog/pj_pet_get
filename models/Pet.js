//requerer somente o metodo DataTypes do Sequelize
const { DataTypes } = require('sequelize')
//requerer a conexão com banco
const conn = require('../db/conn')
//requerer o model do usuario para fazer o relacionamento
const User = require('./Users')

//definir o model pet
const Pet = conn.define('pets', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING
    },
    //se o pet ainda esta disponivel para adocao
    available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
})

//relacionamento: um usuario tem varios pets e o pet pertence a um usuario (dono)
//isso cria a coluna userId na tabela pets
//onDelete CASCADE: se o usuario for apagado, os pets dele tambem sao
User.hasMany(Pet, { onDelete: 'CASCADE' })
Pet.belongsTo(User)

module.exports = Pet
