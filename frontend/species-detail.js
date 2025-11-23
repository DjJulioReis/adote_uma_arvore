document.addEventListener('DOMContentLoaded', () => {
    const speciesDetailContent = document.getElementById('species-detail-content');
    const loadingMessage = document.getElementById('loading-message');
    const speciesImg = document.getElementById('species-img');
    const speciesName = document.getElementById('species-name');
    const speciesDescription = document.getElementById('species-description');
    const adoptButton = document.getElementById('adopt-button');

    // Pega o ID da espécie da URL
    const urlParams = new URLSearchParams(window.location.search);
    const speciesId = urlParams.get('id');
    const lang = localStorage.getItem('lang') || 'pt';

    if (!speciesId) {
        loadingMessage.textContent = 'Erro: ID da espécie não fornecido.';
        return;
    }

    // Busca os detalhes da espécie na API
    async function fetchSpeciesDetails() {
        try {
            const response = await fetch(`../backend/api.php?action=get_species&id=${speciesId}&lang=${lang}`);
            const result = await response.json();

            if (result.success && result.data) {
                const species = result.data;
                document.title = species.name;
                speciesImg.src = `../assets/images/${species.image_url}`;
                speciesImg.alt = species.name;
                speciesName.textContent = species.name;
                speciesDescription.textContent = species.description;

                loadingMessage.style.display = 'none';
                speciesDetailContent.style.display = 'grid';

                // Adiciona o evento de clique para o botão de adotar
                adoptButton.addEventListener('click', () => {
                    redirectToCheckout(species.id, species.name);
                });

            } else {
                throw new Error(result.message || 'Espécie não encontrada.');
            }
        } catch (error) {
            loadingMessage.textContent = `Erro ao carregar detalhes: ${error.message}`;
        }
    }

    // Função para redirecionar para o checkout
    async function redirectToCheckout(id, name) {
        const stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY');
        try {
            const response = await fetch('../backend/api.php?action=create_checkout_session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ species_id: id, species_name: name })
            });
            const session = await response.json();

            const result = await stripe.redirectToCheckout({ sessionId: session.id });
            if (result.error) {
                alert(result.error.message);
            }
        } catch (error) {
            console.error('Erro ao iniciar checkout:', error);
        }
    }

    fetchSpeciesDetails();
});
