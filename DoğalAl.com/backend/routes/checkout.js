const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Cart = require('../models/Cart');
const Product = require('../models/product');
const Order = require('../models/order'); 
const sequelize = require('../db'); 

// Ödeme işlemi route'u
router.post('/checkout', async (req, res) => {
    const transaction = await sequelize.transaction(); 
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            console.log('Token bulunamadı');
            return res.status(401).json({ error: 'Yetkisiz işlem' });
        }

        const decoded = jwt.verify(token, 'x6c0r3s2a'); 
        const userId = decoded.id;
        console.log('Ödeme işlemi yapan kullanıcı ID:', userId);

        // Kullanıcının sepetindeki ürünleri al
        const cartItems = await Cart.findAll({ where: { userId } });
        console.log('Sepetteki ürünler:', cartItems);

        if (cartItems.length === 0) {
            console.log('Sepet boş.');
            return res.status(400).json({ error: 'Sepetiniz boş!' });
        }

        // Sipariş tablosuna ekleme ve stok güncelleme işlemleri
        for (const item of cartItems) {
            const product = await Product.findByPk(item.productId, { transaction }); 
            console.log('İşlem gören ürün:', product);

            if (!product) {
                console.log('Ürün bulunamadı:', item.productId);
                await transaction.rollback(); 
                return res.status(404).json({ error: 'Ürün bulunamadı.' });
            }

            if (product.stock < item.quantity) {
                console.log(`${product.name} ürünü için yeterli stok yok.`);
                await transaction.rollback(); 
                return res.status(400).json({ error: `${product.name} ürünü için yeterli stok yok.` });
            }

            // Stok düşme işlemi
            product.stock -= item.quantity;
            await product.save({ transaction }); 
            console.log(`Stok güncellendi: ${product.name}, Kalan stok: ${product.stock}`);

            // Siparişi orders tablosuna ekleme
            const newOrder = await Order.create({
                userId: userId,
                productId: item.productId,
                quantity: item.quantity,
                farmerId: product.userId 
            }, { transaction });
            console.log(`Sipariş eklendi: User ${userId}, Product ${item.productId}, Quantity ${item.quantity}`);
        }

        // Sepeti temizle
        await Cart.destroy({ where: { userId }, transaction });
        console.log('Sepet temizlendi.');

        await transaction.commit(); 
        res.status(200).json({ message: 'Alışveriş başarıyla tamamlandı ve sipariş oluşturuldu.' });

    } catch (error) {
        await transaction.rollback(); 
        console.error('Ödeme hatası:', error);
        res.status(500).json({ error: 'Ödeme işlemi sırasında hata oluştu.' });
    }
});

module.exports = router;
