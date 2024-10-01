document.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Giriş yapmanız gerekiyor!');
            window.location.href = 'login.html';
            return;
        }

        // Sepeti getir
        const response = await fetch('/api/cart', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Sepet getirilemedi.');
        }

        const cartItems = await response.json();
        console.log(cartItems); 

        const cartList = document.getElementById('cart-items');
        const totalPriceElement = document.getElementById('total-price');
        let totalPrice = 0;

        // Sepetteki ürünleri listele
        cartItems.forEach(item => {
            const productItem = document.createElement('div');
            productItem.classList.add('cart-item');
            productItem.innerHTML = `
                <p>Ürün: ${item.productName}</p>
                <p>Miktar: ${item.quantity}</p>
                <p>Fiyat: ${item.price} TL</p>
                <p>Toplam: ${item.price * item.quantity} TL</p>
                <button class="remove-btn" data-id="${item.productId}">Ürünü Çıkar</button>
            `;
            cartList.appendChild(productItem);

            // Toplam fiyatı hesapla
            totalPrice += item.price * item.quantity;
        });

        // Toplam fiyatı göster
        totalPriceElement.textContent = `Toplam Fiyat: ${totalPrice} TL`;

        // Sepetten ürün çıkarma butonlarına olay ekleme
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const productId = event.target.getAttribute('data-id');
                await removeFromCart(productId);
            });
        });

    } catch (error) {
        console.error('Sepet getirilirken hata oluştu:', error);
        alert('Sepet getirilirken bir hata oluştu.');
    }
});

// Sepetten ürün çıkarma fonksiyonu
async function removeFromCart(productId) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`/api/cart/remove/${productId}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('Ürün sepetten çıkarıldı.');
            window.location.reload(); 
        } else {
            alert('Ürün çıkarılamadı.');
        }
    } catch (error) {
        console.error('Ürün çıkarma sırasında bir hata oluştu:', error);
        alert('Ürün çıkarma işlemi başarısız oldu.');
    }
}

// Butonlara olay ekleyici
document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', async (event) => {
        const productId = event.target.getAttribute('data-id');
        await removeFromCart(productId);
    });
});

// Ödeme işlemi için butona tıklama olayı
document.getElementById('checkout-btn').addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Giriş yapmanız gerekiyor!');
        return;
    }
    try {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, 
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log('Sunucudan gelen yanıt:', data);

        if (response.ok) {
            alert('Alışveriş başarıyla tamamlandı!');
        } else {
            console.error('Hata:', data.error);
            alert(`Hata: ${data.error}`);
        }
    } catch (error) {
        console.error('Beklenmeyen hata:', error);
        alert('Beklenmeyen bir hata oluştu.');
    }
});

