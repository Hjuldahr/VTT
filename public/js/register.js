let score = 0;

const minLength = 12;
const labels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const usernameInput = document.getElementById('username-input');
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const passwordConfirmInput = document.getElementById('password-confirm-input');
    const passwordPeek = document.getElementById('password-peek');
    const passwordStrengthMeter = document.getElementById('password-strength-meter');
    const passwordStrengthLabel = document.getElementById('password-strength-label');

    registerForm.addEventListener('submit', async (evt) => {
        evt.preventDefault();

        let warnings = [];

        if (zxcvbn(passwordInput.value).score <= 2) {
            warnings.push('Password strength is insufficient.')
        }

        if (passwordInput.value !== passwordConfirmInput.value) {
            warnings.push('Passwords do not match.')
        }

        if (warnings.length > 0) {
            alert(warnings.join('\n'));
            passwordConfirmInput.value = '';
            return;
        }

        try {
            const res = await fetch('/register', {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    // fallback to email as default usename if not directly provided
                    username: usernameInput.value || emailInput.value, 
                    email: emailInput.value, 
                    password: passwordInput.value 
                }), 
            });

            const data = await res.json();

            if (res.ok) {
                window.location.replace(data.redirect);
            } else {
                alert(data.message || 'Signup failed!');
            }
        } catch (err) {
            console.error("Network or parsing error:", err);
        }
    });

    passwordInput.addEventListener("input", (e) => { 
        score = zxcvbn(e.target.value).score;

        const l = passwordInput.value.length;
        
        if (l == 0) { 
            passwordStrengthLabel.innerText = '';
        } else if (l < minLength) {
            passwordStrengthLabel.innerText = `Only ${l} character${l == 1 ? '' : 's'} long, but must be at least ${minLength} characters`;
        } else {
            passwordStrengthLabel.innerText = labels[score];
        }
        passwordStrengthMeter.value = score;
    }); 

    const showPassword = () => {
        passwordPeek.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Hide';
        passwordInput.type = 'text';
        passwordConfirmInput.type = 'text';
    };
    const hidePassword = () => {
        passwordPeek.innerHTML = '<i class="fa-solid fa-eye"></i> Show';
        passwordInput.type = 'password';
        passwordConfirmInput.type = 'password';
    };
    ['mousedown', 'touchstart'].forEach(evt => passwordPeek.addEventListener(evt, showPassword));
    ['mouseup', 'mouseleave', 'touchend'].forEach(evt => passwordPeek.addEventListener(evt, hidePassword));
});