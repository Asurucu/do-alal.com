document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId); 
        
        if (data.isFarmer) {
            window.location.href = '/farmer-dashboard.html'; // Çiftçi için yönlendirme
        } else {
            window.location.href = '/index.html'; // Normal kullanıcı için yönlendirme
        }
    } else {
        alert('Giriş başarısız: ' + data.error);
    }
});

const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
});

if (response.ok) {
    const data = await response.json();
    localStorage.setItem('token', data.token); 
    localStorage.setItem('userId', data.userId); 
    window.location.href = 'index.html'; 
} else {
    alert('Giriş başarısız!');
}
console.log(data); 
