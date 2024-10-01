const { checkConnection } = require('./db');

checkConnection((isConnected) => {
    if (isConnected) {
        console.log('Veritabanı bağlantısı kontrol edildi: Başarılı');
    } else {
        console.log('Veritabanı bağlantısı kontrol edildi: Başarısız');
    }
});


