const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const jwt = require('jsonwebtoken'); 
const SECRET_KEY = 'x6c0r3s2a'; 

// Ürün ekleme
router.post('/add', async (req, res) => {
    try {
        const { name, description, price, stock, image } = req.body;

        // Token'ı al ve doğrula
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(403).json({ error: 'Yetkisiz işlem, token bulunamadı.' });
        }

        const decoded = jwt.verify(token, SECRET_KEY); 
        const userId = decoded.id; 

        // Tüm alanların dolu olup olmadığını kontrol et
        if (!name || !description || !price || !stock || !image) {
            return res.status(400).json({ error: 'Tüm alanlar doldurulmalıdır.' });
        }

        // Ürün oluştur ve userId'yi ekle
        const product = await Product.create({ name, description, price, stock, image, userId });
        res.status(201).json(product);
    } catch (error) {
        console.error('Ürün ekleme hatası:', error);
        res.status(500).json({ error: 'Ürün ekleme hatası' });
    }
});

// Ürün güncelleme (PUT)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { price, stock } = req.body;

        // Boş alan kontrolü
        if (!price || !stock) {
            return res.status(400).json({ error: 'Fiyat ve stok bilgileri doldurulmalıdır.' });
        }

        // Ürün bul ve güncelle
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Ürün bulunamadı.' });
        }

        product.price = price;
        product.stock = stock;

        await product.save();
        res.status(200).json({ message: 'Ürün başarıyla güncellendi.', product });
    } catch (error) {
        console.error('Ürün güncelleme hatası:', error);
        res.status(500).json({ error: 'Ürün güncelleme hatası.' });
    }
});

// Ürün silme işlemi
router.delete('/:id', async (req, res) => {
    const productId = req.params.id; 

    try {
        // Ürünü bul ve sil
        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({ error: 'Ürün bulunamadı.' });
        }

        await product.destroy(); 
        res.status(200).json({ message: 'Ürün başarıyla silindi.' });
    } catch (error) {
        console.error('Ürün silme hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

// Tüm ürünleri listeleme
router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Ürünleri listeleme hatası' });
    }
});

// Kullanıcıya ait ürünleri listeleme (Çiftçi ürünleri)
router.get('/farmer', async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(403).json({ error: 'Yetkisiz işlem, token bulunamadı.' });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.id;

        const farmerProducts = await Product.findAll({ where: { userId } }); 
        res.json(farmerProducts);
    } catch (error) {
        console.error('Çiftçi ürünlerini listeleme hatası:', error);
        res.status(500).json({ error: 'Çiftçi ürünlerini listeleme hatası' });
    }
});

// Ürün arama
router.get('/search', async (req, res) => {
    try {
        const { name } = req.query;
        console.log('Arama terimi:', name);

        // Ürün ismine göre filtrele
        const { Op } = require('sequelize');
        const products = await Product.findAll({
            where: {
                name: {
                    [Op.like]: `%${name}%` // Benzer isimleri bul
                }
            }
        });

        res.json(products);
    } catch (error) {
        console.error('Ürün arama hatası:', error);
        res.status(500).json({ error: 'Ürün arama sırasında hata oluştu.' });
    }
});

module.exports = router;
