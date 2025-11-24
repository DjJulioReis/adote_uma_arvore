document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartApi = '../backend/cart_api.php';
    const checkoutApi = '../backend/api.php';
    const pricePerTree = 15;

    async function loadCart() {
        try {
            const response = await fetch(cartApi + '?action=get');
            const result = await response.json();

            if (result.success && result.data.length > 0) {
                cartItemsContainer.innerHTML = '';
                result.data.forEach(item => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'cart-item';
                    itemDiv.innerHTML = `
                        <img src="../assets/images/${item.image_url}" alt="${item.name_common}">
                        <h3>${item.name_common}</h3>
                        <p>Compensa: ${item.carbon_offset_kg} kg de CO₂/ano</p>
                        <button onclick="removeItem(${item.id})">Remover</button>
                    `;
                    cartItemsContainer.appendChild(itemDiv);
                });

                const total = result.data.length * pricePerTree;
                cartTotalContainer.textContent = `Total: US$ ${total.toFixed(2)}`;
            } else {
                cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
                checkoutBtn.style.display = 'none';
            }
        } catch (error) {
            cartItemsContainer.innerHTML = '<p>Erro ao carregar o carrinho.</p>';
        }
    }

    window.removeItem = async (speciesId) => {
        const formData = new URLSearchParams();
        formData.append('action', 'remove');
        formData.append('species_id', speciesId);

        await fetch(cartApi, {
            method: 'POST',
            body: formData
        });
        loadCart(); // Recarrega o carrinho
        // Poderíamos também chamar a função do header.js para atualizar o contador
    };

    checkoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        // Verifica se o usuário está logado antes de finalizar
        const authResponse = await fetch('../backend/auth_user_api.php', {
            method: 'POST',
            body: new URLSearchParams('action=check_session')
        });
        const authResult = await authResponse.json();

        if (!authResult.logged_in) {
            alert('Você precisa fazer login para finalizar a adoção.');
            window.location.href = 'login.html';
            return;
        }

        const stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY');
        try {
            const response = await fetch(checkoutApi + '?action=create_checkout_session', {
                method: 'POST'
            });
            const session = await response.json();

            if(session.id) {
                const result = await stripe.redirectToCheckout({ sessionId: session.id });
                if (result.error) {
                    alert(result.error.message);
                }
            } else {
                alert(session.message || 'Ocorreu um erro.');
            }
        } catch (error) {
            console.error('Erro ao iniciar checkout:', error);
        }
    });

    loadCart();
});
