const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');
const Cart = require('../models/Cart');

// Sipariş oluşturma (Sepeti siparişe dönüştürme)
router.post('/checkout', async (req, res) => {
    const { userId } = req.body;
    const transaction = await sequelize.transaction();

    try {
        // Kullanıcının sepetindeki ürünleri al
        const cartItems = await Cart.findAll({ where: { userId } });

        if (cartItems.length === 0) {
            return res.status(400).json({ error: 'Sepetiniz boş!' });
        }

        // Her bir ürün için sipariş oluştur ve stok güncelle
        for (const item of cartItems) {
            const product = await Product.findByPk(item.productId, { transaction });

            if (!product) {
                await transaction.rollback(); 
                return res.status(404).json({ error: 'Ürün bulunamadı' });
            }

            if (product.stock < item.quantity) {
                await transaction.rollback(); 
                return res.status(400).json({ error: `Yeterli stok yok: ${product.name}` });
            }

            const farmerId = product.farmerId;

            // Stok düşürme
            product.stock -= item.quantity;
            await product.save({ transaction });

            // Siparişi orders tablosuna ekleme
            await Order.create({
                userId: userId,
                farmerId: farmerId, 
                productId: item.productId,
                quantity: item.quantity
            }, { transaction });
        }

        // Sepeti temizle
        await Cart.destroy({ where: { userId }, transaction });

        await transaction.commit();

        res.status(201).json({ message: 'Siparişler başarıyla oluşturuldu!' });

    } catch (error) {
        // Hata durumunda işlemi geri al
        await transaction.rollback();
        console.error('Sipariş oluşturma hatası:', error);
        res.status(500).json({ error: 'Sipariş oluşturulurken hata oluştu.' });
    }
});


// Çiftçiye ait siparişleri çekme
router.get('/farmer/:userId', async (req, res) => {
    const farmerId = req.params.userId;
    const status = req.query.status;

    try {
        const orders = await Order.findAll({
            where: { farmerId , status:'beklemede'}, 
            include: [
                { model: Product } 
            ]
        });

        if (orders.length === 0) {
            return res.status(404).json({ error: 'Bu çiftçiye ait sipariş bulunamadı.' });
        }

        res.json(orders);

    } catch (error) {
        console.error('Sipariş getirme hatası:', error);
        res.status(500).json({ error: 'Sipariş getirme hatası' });
    }
});

// Sipariş onaylama
router.put('/confirm/:orderId', async (req, res) => {
    const orderId = req.params.orderId;

    try {
        const order = await Order.findByPk(orderId);

        if (!order) {
            return res.status(404).json({ error: 'Sipariş bulunamadı' });
        }

        order.status = 'Onaylandı'; 
        await order.save();

        res.json(order);

    } catch (error) {
        console.error('Sipariş onaylama hatası:', error);
        res.status(500).json({ error: 'Sipariş onaylama hatası' });
    }
});

// Kullanıcıya ait siparişleri çekme
router.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const orders = await Order.findAll({
            where: { userId }, 
            include: [
                { model: Product } 
            ]
        });

        if (orders.length === 0) {
            return res.status(404).json({ error: 'Bu kullanıcıya ait sipariş bulunamadı.' });
        }

        res.json(orders);

    } catch (error) {
        console.error('Siparişler getirilirken hata oluştu:', error);
        res.status(500).json({ error: 'Sipariş getirme hatası' });
    }
});

router.get('/orders/user/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const orders = await Order.findAll({
            where: { userId },
            include: [
                { model: Product } 
            ]
        });

        if (orders.length === 0) {
            return res.status(404).json({ error: 'Bu kullanıcıya ait sipariş bulunamadı.' });
        }

        res.json(orders);

    } catch (error) {
        console.error('Sipariş getirme hatası:', error);
        res.status(500).json({ error: 'Sipariş getirme hatası' });
    }
});


module.exports = router;
