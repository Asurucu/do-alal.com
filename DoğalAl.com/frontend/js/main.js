document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    setupCart();
});

// Ürünleri getir ve listele
function fetchProducts() {
    fetch('/api/products')
        .then(response => response.json())
        .then(products => {
            const productsList = document.getElementById('products-list');
            productsList.innerHTML = '';
            products.forEach(product => {
                const productCard = `
                    <div class="product-card">
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p>${product.price} TL</p>
                        <button onclick="promptQuantity(${product.id}, '${product.name}', ${product.price})">Sepete Ekle</button>
                    </div>
                `;
                productsList.innerHTML += productCard;
            });
        });
}

function promptQuantity(productId, productName, productPrice) {
    const quantity = prompt(`Kaç adet ${productName} eklemek istiyorsunuz?`);
    if (quantity && quantity > 0) {
        addToCart(productId, quantity);
    }
}

function addToCart(productId, quantity) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Giriş yapmanız gerekiyor!');
        window.location.href = 'login.html';
        return;
    }

    fetch('/api/cart/add', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productId: productId,
            quantity: parseInt(quantity)
        })
    })
    .then(response => {
        if (response.ok) {
            alert(`${quantity} adet ürün sepete eklendi.`);
        } else {
            alert('Sepete ekleme işlemi başarısız oldu.');
        }
    })
    .catch(error => {
        console.error('Sepete ekleme sırasında hata oluştu:', error);
        alert('Sepete ekleme işlemi sırasında bir hata oluştu.');
    });
}

function setupCart() {
    const viewCartButton = document.getElementById('view-cart');
    if (viewCartButton) {
        viewCartButton.addEventListener('click', () => {
            
        });
    } else {
        console.error('view-cart elementi bulunamadı.');
    }
}

document.addEventListener('DOMContentLoaded', setupCart);


// Ürün arama fonksiyonu
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value;

    // Ürünleri backend'den getiren fetch fonksiyonu
    fetch(`/api/products/search?name=${searchTerm}`)
        .then(response => response.json())
        .then(data => {
            const productList = document.getElementById('productList');
            productList.innerHTML = ''; 

            if (data.length > 0) {
                data.forEach(product => {
                    const productItem = `
                        <div class="product-card">
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p>${product.price} TL</p>
                        <button onclick="promptQuantity(${product.id}, '${product.name}', ${product.price})">Sepete Ekle</button>
                    </div>
                    `;
                    productList.innerHTML += productItem;
                });
            } else {
                productList.innerHTML = '<p>Ürün bulunamadı.</p>';
            }
        })
        .catch(error => {
            console.error('Ürün arama hatası:', error);
        });
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
