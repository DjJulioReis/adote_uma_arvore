document.addEventListener('DOMContentLoaded', () => {
    const speciesDetailContent = document.getElementById('species-detail-content');
    const loadingMessage = document.getElementById('loading-message');
    const speciesImg = document.getElementById('species-img');
    const speciesName = document.getElementById('species-name');
    const speciesDescription = document.getElementById('species-description');
    const adoptButton = document.getElementById('adopt-button');

    const urlParams = new URLSearchParams(window.location.search);
    const speciesId = urlParams.get('id');

    if (!speciesId) {
        loadingMessage.textContent = 'Erro: ID da espécie não fornecido.';
        return;
    }

    // Busca os detalhes da espécie na API
    async function fetchSpeciesDetails() {
        try {
            // A API agora retorna os nomes corretos sem necessidade de parâmetro de idioma
            const response = await fetch(`../backend/api.php?action=get_species&id=${speciesId}`);
            const result = await response.json();

            if (result.success && result.data) {
                const species = result.data;
                document.title = species.name_common; // Usa o nome comum como título
                speciesImg.src = `../assets/images/${species.image_url}`;
                speciesImg.alt = species.name_common;
                // Exibe ambos os nomes para clareza
                speciesName.innerHTML = `${species.name_common} <br><small><em>(${species.name_scientific})</em></small>`;
                speciesDescription.textContent = species.description_pt; // Usa a descrição em PT por padrão

                loadingMessage.style.display = 'none';
                speciesDetailContent.style.display = 'grid';

                adoptButton.addEventListener('click', () => {
                    redirectToCheckout(species.id, species.name_common);
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
                body: JSON.stringify({ species_id: id })
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
