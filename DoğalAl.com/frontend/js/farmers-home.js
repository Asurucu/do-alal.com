document.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Giriş yapmanız gerekiyor!');
            window.location.href = 'login.html'; 
            return;
        }

        const response = await fetch('/api/products/farmer', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Ürünler getirilirken hata oluştu.');
        }

        const products = await response.json();
        const productList = document.getElementById('products-list');
        productList.innerHTML = ''; 

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            // Ürün bilgilerini göster
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>${product.price} TL</p>
                <p>Stok: ${product.stock}</p>
                <button onclick="editProduct(${product.id})">Düzenle</button>
                <button onclick="deleteProduct(${product.id})">Sil</button>
            `;

            productList.appendChild(productCard);
        });
    } catch (error) {
        console.error('Ürünler getirilirken hata oluştu:', error);
        alert('Ürünler getirilirken bir hata oluştu.');
    }
});

// Ürün düzenleme fonksiyonu
function editProduct(productId) {
    const newPrice = prompt('Yeni fiyatı girin:');
    const newStock = prompt('Yeni stok miktarını girin:');
    
    if (newPrice && newStock) {
        fetch(`/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ price: newPrice, stock: newStock })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('Ürün güncellenemedi.');
            } else {
                alert('Ürün başarıyla güncellendi.');
                window.location.reload(); 
            }
        })
        .catch(error => console.error('Güncelleme hatası:', error));
    }
}

// Ürün silme fonksiyonu
function deleteProduct(productId) {
    const confirmDelete = confirm('Bu ürünü silmek istediğinize emin misiniz?');

    if (confirmDelete) {
        fetch(`/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Ürün başarıyla silindi.');
                window.location.reload(); 
            } else {
                alert('Ürün silinemedi.');
            }
        })
        .catch(error => console.error('Silme hatası:', error));
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            window.location.href = 'login.html'; 
            return;
        }

        const decodedToken = parseJwt(token);
        const username = decodedToken.username; 

        // Kullanıcı adını header kısmına ekleme
        const userProfileElement = document.getElementById('user-profile'); 
        userProfileElement.innerHTML = `<a href="profile.html">${username}</a>`; 

    } catch (error) {
        console.error('Kullanıcı bilgileri yüklenirken hata:', error);
    }
});

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
});

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
