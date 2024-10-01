const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ecommerce_db', 'root', 'x6c0r3s2a', {
  host: 'localhost',
  dialect: 'mysql'
});

// Bağlantıyı test et
sequelize.authenticate()
  .then(() => {
    console.log('Veritabanına başarıyla bağlanıldı.');
  })
  .catch(err => {
    console.error('Veritabanına bağlanırken hata:', err);
  });

module.exports = sequelize;
