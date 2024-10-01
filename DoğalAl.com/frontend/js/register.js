document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const isFarmer = document.getElementById('isFarmer').checked;

    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, phone, password, isFarmer })
    });

    const data = await response.json();
    if (response.ok) {
        window.location.href = 'login.html';
    } else {
        alert(data.error);
    }
});
