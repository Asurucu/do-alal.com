const { DataTypes } = require('sequelize');
const sequelize = require('../db'); 
const Product = require('./product'); 
const User = require('./User'); 

const Cart = sequelize.define('Cart', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', 
            key: 'id'
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Products', 
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, {
    tableName: 'carts', 
    timestamps: false 
});

// İlişkileri tanımla
Cart.belongsTo(Product, { foreignKey: 'productId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

module.exports = Cart;
