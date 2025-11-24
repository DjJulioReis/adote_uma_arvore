document.addEventListener('DOMContentLoaded', () => {
    const speciesDetailContent = document.getElementById('species-detail-content');
    const loadingMessage = document.getElementById('loading-message');
    const speciesImg = document.getElementById('species-img');
    const speciesName = document.getElementById('species-name');
    const speciesDescription = document.getElementById('species-description');
    const speciesCarbonOffset = document.getElementById('species-carbon-offset');
    const addToCartButton = document.getElementById('add-to-cart-button');
    const cartApi = '../backend/cart_api.php';

    const urlParams = new URLSearchParams(window.location.search);
    const speciesId = urlParams.get('id');

    if (!speciesId) {
        loadingMessage.textContent = 'Erro: ID da espécie não fornecido.';
        return;
    }

    async function fetchSpeciesDetails() {
        try {
            const response = await fetch(`../backend/api.php?action=get_species&id=${speciesId}`);
            const result = await response.json();

            if (result.success && result.data) {
                const species = result.data;
                document.title = species.name_common;
                speciesImg.src = `../assets/images/${species.image_url}`;
                speciesImg.alt = species.name_common;
                speciesName.innerHTML = `${species.name_common} <br><small><em>(${species.name_scientific})</em></small>`;
                speciesDescription.textContent = species.description_pt;
                speciesCarbonOffset.textContent = `Compensação de Carbono: ${species.carbon_offset_kg} kg de CO₂/ano.`;

                loadingMessage.style.display = 'none';
                speciesDetailContent.style.display = 'grid';

                addToCartButton.addEventListener('click', () => {
                    addToCart(species.id);
                });

            } else {
                throw new Error(result.message || 'Espécie não encontrada.');
            }
        } catch (error) {
            loadingMessage.textContent = `Erro ao carregar detalhes: ${error.message}`;
        }
    }

    async function addToCart(id) {
        const formData = new URLSearchParams();
        formData.append('action', 'add');
        formData.append('species_id', id);

        try {
            await fetch(cartApi, {
                method: 'POST',
                body: formData
            });
            addToCartButton.textContent = 'Adicionado!';
            addToCartButton.disabled = true;
            // Atualiza o header (se a função for global)
            if (window.updateHeader) window.updateHeader();
        } catch (error) {
            alert('Erro ao adicionar ao carrinho.');
        }
    }

    fetchSpeciesDetails();
});
