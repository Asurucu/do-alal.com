fetch('/api/products')
    .then(response => response.json())
    .then(data => {
        data.forEach(product => {
            // Ürünleri sayfada görüntüleme işlemi
        });
        
    });
