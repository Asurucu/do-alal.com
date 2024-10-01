const express = require('express');
const router = express.Router();
const  User  = require('../models/User'); 

// Kullanıcıyı ID ile çekme
router.get('/users/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        console.log('userId:', userId);
        const user = await User.findOne({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
        }

        // Kullanıcı adını geri döndür
        res.json({ username: user.username });
    } catch (error) {
        console.error('Kullanıcı getirme hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

module.exports = router;
