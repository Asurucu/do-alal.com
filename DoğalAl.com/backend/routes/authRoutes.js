const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'x6c0r3s2a';

// Kullanıcı kayıt
router.post('/register', async (req, res) => {
    try {
        const { username, email, phone, password, isFarmer } = req.body;

        if (!username || !email || !phone || !password) {
            return res.status(400).json({ error: 'Tüm alanlar doldurulmalıdır.' });
        }

        // Aynı e-posta ile kayıtlı bir kullanıcı var mı kontrol et
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Bu e-posta ile zaten bir kullanıcı mevcut.' });
        }

        // Şifreyi hash'le
        const hashedPassword = await bcrypt.hash(password, 10);

        // Kullanıcı oluştur
        const user = await User.create({
            username,
            email,
            phone,
            password: hashedPassword,
            isFarmer
        });

        res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu.', user });
    } catch (error) {
        console.error('Kullanıcı kayıt hatası:', error); // Hata loglama
        res.status(500).json({ error: 'Sunucu hatası: ' + error.message });
    }
});

// Kullanıcı giriş
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });

        // Kullanıcı doğrulama
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre.' });
        }

        // Token oluşturma
        const token = jwt.sign({ id: user.id, isFarmer: user.isFarmer }, SECRET_KEY);

        // Kullanıcı bilgileri ve token'ı döndür
        res.json({ token, userId: user.id, isFarmer: user.isFarmer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
