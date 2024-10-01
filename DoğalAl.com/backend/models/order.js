const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Product = require('./product'); 
const User = require('./User');

const Order = sequelize.define('Order', {
    userId: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        } 
    }, 
    farmerId: { 
        type: DataTypes.INTEGER, 
        allowNull: true,
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
        allowNull: false 
    }, 
    status: { 
        type: DataTypes.STRING, 
        defaultValue: 'Beklemede' 
    } 
});

// İlişkiler
Order.belongsTo(Product, { foreignKey: 'productId' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'Buyer' }); 
Order.belongsTo(User, { foreignKey: 'farmerId', as: 'Farmer' }); 

module.exports = Order;
