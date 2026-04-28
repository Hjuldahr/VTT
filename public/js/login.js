document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const passwordPeek = document.getElementById('password-peek');

    loginForm.addEventListener('submit', async (evt) => {
        evt.preventDefault();

        try {
            const res = await fetch('/login', {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: emailInput.value, 
                    password: passwordInput.value 
                }), 
            });

            const data = await res.json();

            if (res.ok) {
                window.location.replace(data.redirect);
            } else {
                alert(data.message || 'Login failed!');
                passwordInput.value = ''; // Clear password on failure
            }
        } catch (err) {
            console.error("Network or parsing error:", err);
        }
    });

    const showPassword = () => {
        passwordPeek.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Hide';
        passwordInput.type = 'text';
    };
    const hidePassword = () => {
        passwordPeek.innerHTML = '<i class="fa-solid fa-eye"></i> Show';
        passwordInput.type = 'password';
    };
    ['mousedown', 'touchstart'].forEach(evt => passwordPeek.addEventListener(evt, showPassword));
    ['mouseup', 'mouseleave', 'touchend'].forEach(evt => passwordPeek.addEventListener(evt, hidePassword));
});