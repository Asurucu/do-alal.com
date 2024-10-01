document.addEventListener('DOMContentLoaded', async () => {
    try {
        
        const token = localStorage.getItem('token');

        console.log("Token:", token);

        
        if (!token) {
            alert('Giriş yapmanız gerekiyor!');
            window.location.href = 'login.html'; 
            return;
        }

        
        const decodedToken = parseJwt(token);
        const userId = decodedToken.id; 
        console.log("Decoded UserId:", userId);

        // Siparişleri çekmek için API isteği yap
        const response = await fetch(`/api/orders/farmer/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json',
            }
        });

        console.log("API response status:", response.status); 
        console.log("API response ok:", response.ok); 

        if (!response.ok) {
            throw new Error(`Siparişler getirilirken hata oluştu. Status: ${response.status}`);
        }

        const orders = await response.json();
        console.log("Orders:", orders); 

        const ordersContainer = document.getElementById('orders-container');
        ordersContainer.innerHTML = ''; 

        // Siparişler ekrana yazdır
        orders.forEach(order => {
            const orderItem = document.createElement('div');
            orderItem.classList.add('order-item');
            orderItem.innerHTML = `
                <h3>Sipariş ID: ${order.id}</h3>
                <p>Müşteri: ${order.User ? order.User.name : 'Bilinmeyen müşteri'}</p>
                <p>Ürün: ${order.Product ? order.Product.name : 'Bilinmeyen ürün'}</p>
                <p>Adet: ${order.quantity}</p>
                <p>Toplam Fiyat: ${order.Product ? order.Product.price * order.quantity : '0'} TL</p>
                <button class="confirm-btn" data-id="${order.id}">Onayla</button>
            `;
            ordersContainer.appendChild(orderItem);
        });

        // Sipariş onaylama
        document.querySelectorAll('.confirm-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const orderId = event.target.getAttribute('data-id');
                await confirmOrder(orderId, token);
            });
        });

    } catch (error) {
        console.error('Siparişler getirilirken hata oluştu:', error);
        alert('Siparişler getirilirken bir hata oluştu.');
    }
});


// Sipariş onaylama fonksiyonu
async function confirmOrder(orderId, token) {
    try {
        const response = await fetch(`/api/orders/confirm/${orderId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        console.log("Confirm API response status:", response.status); 
        console.log("Confirm API response ok:", response.ok); 

        if (!response.ok) {
            throw new Error('Sipariş onaylama başarısız oldu.');
        }

        const updatedOrder = await response.json();
        alert(`Sipariş ID: ${updatedOrder.id} onaylandı!`);
        location.reload();

    } catch (error) {
        console.error('Sipariş onaylanırken hata oluştu:', error);
        alert('Sipariş onaylanırken bir hata oluştu.');
    }
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
