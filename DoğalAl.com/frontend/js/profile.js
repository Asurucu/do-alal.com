document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token'); 
    const decodedToken = parseJwt(token); 
    const userId = decodedToken.id; 

    try {
        console.log('userId:', userId);
        // Kullanıcı adını çekmek için API isteği
        const response = await fetch(`/api/users/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        const userData = await response.json();
        const username = userData.username;

        // Kullanıcı adını header'da göster
        const usernameElement = document.getElementById('username-display');
        usernameElement.textContent = username;

    } catch (error) {
        console.error('Kullanıcı adı getirilirken hata oluştu:', error);
    }

    try {
        // Kullanıcıya ait siparişleri çekmek için API isteği
        const response = await fetch(`/api/orders/user/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        const orders = await response.json();
        const ordersContainer = document.getElementById('orders-container');
        ordersContainer.innerHTML = ''; 

        orders.forEach(order => {
            const orderItem = document.createElement('div');
            orderItem.innerHTML = `
                <h3>Sipariş ID: ${order.id}</h3>
                <p>Ürün: ${order.Product.name}</p>
                <p>Adet: ${order.quantity}</p>
                <p>Fiyat: ${order.Product.price}</p>
            `;
            ordersContainer.appendChild(orderItem);
        });

    } catch (error) {
        console.error('Siparişler getirilirken hata oluştu:', error);
    }

});

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
