document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authApi = '../backend/auth_user_api.php';

    // Se estiver na página de login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            formData.append('action', 'login');

            try {
                const response = await fetch(authApi, {
                    method: 'POST',
                    body: new URLSearchParams(formData)
                });
                const result = await response.json();

                if (result.success) {
                    window.location.href = 'dashboard.html'; // Redireciona para o painel do usuário
                } else {
                    document.getElementById('login-error').textContent = result.message;
                }
            } catch (error) {
                document.getElementById('login-error').textContent = 'Ocorreu um erro de conexão.';
            }
        });
    }

    // Se estiver na página de registro
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const messageEl = document.getElementById('register-message');
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;

            if (password !== confirmPassword) {
                messageEl.textContent = 'As senhas não coincidem.';
                messageEl.style.color = '#d9534f';
                return;
            }

            const formData = new FormData(registerForm);
            formData.append('action', 'register');

            try {
                const response = await fetch(authApi, {
                    method: 'POST',
                    body: new URLSearchParams(formData)
                });
                const result = await response.json();

                if (result.success) {
                    messageEl.textContent = 'Registro bem-sucedido! Você será redirecionado para o login.';
                    messageEl.style.color = 'green';
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    messageEl.textContent = result.message;
                    messageEl.style.color = '#d9534f';
                }
            } catch (error) {
                messageEl.textContent = 'Ocorreu um erro de conexão.';
                messageEl.style.color = '#d9534f';
            }
        });
    }
});
