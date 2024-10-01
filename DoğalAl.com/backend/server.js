const express = require('express');
const path = require('path');
const app = express();
const sequelize = require('./db');
const User = require('./models/User');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const bodyParser = require('body-parser');
const cartRoutes = require('./routes/cartRoutes');
const router = require('./routes/cartRoutes'); 
const checkout = require('./routes/checkout'); 
const userRoutes = require('./routes/userRoutes'); 



app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Rotalar
app.use('/api', userRoutes);
app.use('/api', checkout);
app.use('/api', router);
app.use('/api/cart', cartRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Anasayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/src/index.html')); 
});

app.get('/add-product', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/src/addProducts.html'));
});


app.get('/orders', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/src/orders.html'));
});

// Çiftçi ana sayfası 
app.get('/farmer-home', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/src/farmer-home.html'));
});

// Diğer HTML dosyalarını dinamik olarak sunma 
app.get('/:page', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, `../frontend/src/${page}`));
});

sequelize.sync().then(() => {
    app.listen(3000, () => console.log('Sunucu 3000 portunda çalışıyor'));
});

