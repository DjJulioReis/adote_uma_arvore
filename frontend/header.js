document.addEventListener('DOMContentLoaded', () => {
    const userNav = document.getElementById('user-nav');
    const authApi = '../backend/auth_user_api.php';
    const cartApi = '../backend/cart_api.php';

    async function updateHeader() {
        // 1. Verifica o status do login
        const authResponse = await fetch(authApi, {
            method: 'POST',
            body: new URLSearchParams('action=check_session')
        });
        const authResult = await authResponse.json();

        // 2. Verifica o status do carrinho
        const cartResponse = await fetch(cartApi + '?action=get');
        const cartResult = await cartResponse.json();
        const cartItemCount = cartResult.success ? cartResult.data.length : 0;

        let navHTML = '';
        if (authResult.logged_in) {
            navHTML += `
                <span>Bem-vindo, ${authResult.name}!</span> |
                <a href="dashboard.html">Minhas Adoções</a> |
                <a href="#" id="logout-btn">Sair</a>
            `;
        } else {
            navHTML += `
                <a href="login.html">Login</a> |
                <a href="register.html">Registrar</a>
            `;
        }

        // Adiciona o link do carrinho
        navHTML += ` | <a href="cart.html">Carrinho (${cartItemCount})</a>`;

        userNav.innerHTML = navHTML;

        // Adiciona evento de logout se o botão existir
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await fetch(authApi, { method: 'POST', body: new URLSearchParams('action=logout') });
                window.location.href = 'index.html';
            });
        }
    }

    if (userNav) {
        updateHeader();
    }
});
