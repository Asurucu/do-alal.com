document.getElementById('addProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Ürün bilgilerini formdan alıyoruz
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const image = document.getElementById('imageUrl').value;
    const stock = document.getElementById('quantity').value; 

    // Token'ı alıyoruz ve kontrol ediyoruz
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Giriş yapmanız gerekiyor!');
        return; 
    }

    try {
        // Ürün ekleme isteği yapıyoruz
        const response = await fetch('/api/products/add', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ name, description, price, image, stock }) 
        });

        const data = await response.json();
        
        // İstek başarılı ise ürün ekleniyor
        if (response.ok) {
            alert('Ürün başarıyla eklendi');
            window.location.href = 'addProduct.html'; 
        } else {
            // Sunucudan gelen hata mesajını gösteriyoruz
            alert(data.error || 'Ürün ekleme hatası oluştu.');
        }
    } catch (error) {
        // İstek sırasında oluşabilecek hataları yakalıyoruz
        console.error('Ürün ekleme hatası:', error);
        alert('Ürün eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
});
