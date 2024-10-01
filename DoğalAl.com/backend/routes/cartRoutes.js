const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/product');
const Order = require('../models/order'); 
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'x6c0r3s2a'; 

// Sepete ürün ekleme
router.post('/add', async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        console.log('Sepete eklenen ürün:', { productId, quantity });
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Yetkisiz işlem' });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.id;
        console.log('Kullanıcı ID:', userId);

        // Sepete eklenmiş ürün var mı diye kontrol et
        const existingCartItem = await Cart.findOne({ where: { userId, productId } });
        console.log('Sepetteki mevcut ürün:', existingCartItem);

        if (existingCartItem) {
            // Ürün sepette varsa, miktarı güncelle
            existingCartItem.quantity += quantity;
            await existingCartItem.save();
            console.log('Ürün miktarı güncellendi:', existingCartItem);
        } else {
            // Ürün sepette yoksa, yeni bir öğe oluştur
            const newCartItem = await Cart.create({ userId, productId, quantity });
            console.log('Yeni ürün sepete eklendi:', newCartItem);
        }

        res.status(200).json({ message: 'Ürün sepete eklendi.' });
    } catch (error) {
        console.error('Sepete ekleme hatası:', error);
        res.status(500).json({ error: 'Sepete ekleme hatası' });
    }
});

// Sepeti görüntüleme
router.get('/', async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Yetkisiz işlem' });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.id;
        console.log('Sepeti görüntüleyen kullanıcı ID:', userId);

        // Kullanıcının sepetindeki ürünleri getir
        const cartItems = await Cart.findAll({ where: { userId }, include: [Product] });
        console.log('Sepetteki ürünler:', cartItems);

        // Sepetteki ürünleri ayrıntılı olarak döndür
        const detailedCartItems = cartItems.map(item => ({
            productName: item.Product.name,
            price: item.Product.price,
            quantity: item.quantity,
            productId: item.Product.id
        }));

        res.json(detailedCartItems);
    } catch (error) {
        console.error('Sepet getirme hatası:', error);
        res.status(500).json({ error: 'Sepet getirme hatası' });
    }
});

// Sepetten ürün çıkarma
router.delete('/remove/:productId', async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Yetkisiz işlem' });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.id;
        const { productId } = req.params;
        console.log('Kullanıcı ID:', userId, 'Çıkarılacak ürün ID:', productId);

        // Sepetten ürünü sil
        const deletedRows = await Cart.destroy({ where: { userId, productId } });
        console.log('Silinen satır sayısı:', deletedRows);

        if (deletedRows) {
            res.status(200).json({ message: 'Ürün sepetten çıkarıldı.' });
        } else {
            res.status(404).json({ error: 'Ürün bulunamadı.' });
        }
    } catch (error) {
        console.error('Ürün çıkarma hatası:', error);
        res.status(500).json({ error: 'Ürün çıkarma hatası' });
    }
});

module.exports = router;
