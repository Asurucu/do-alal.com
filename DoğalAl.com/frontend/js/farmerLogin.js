document.getElementById('farmerLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        window.location.href = 'products.html'; 
    } else {
        alert(data.error);
    }
});
