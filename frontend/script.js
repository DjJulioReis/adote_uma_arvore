document.addEventListener('DOMContentLoaded', () => {
    // A remoção do seletor de idiomas simplifica o código.
    // A lógica de tradução agora se aplicará apenas a textos estáticos.
    let allSpecies = [];
    let currentPreviewSpecies = null;
    let map = null;

    const previewCard = document.getElementById('species-preview-card');
    const previewImage = document.getElementById('preview-image');
    const previewName = document.getElementById('preview-name');

    // Função para buscar as espécies da API e armazená-las
    async function fetchSpecies() {
        try {
            // A API agora retorna name_common e name_scientific
            const response = await fetch(`../backend/api.php?action=get_species`);
            const result = await response.json();
            if (result.success) {
                allSpecies = result.data;
            }
        } catch (e) { console.error("Erro ao buscar espécies:", e); }
    }

    // Função para inicializar o mapa de descoberta
    function initDiscoveryMap() {
        const coords = [-25.665863, -48.466011];
        map = L.map('map').setView(coords, 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker(coords).addTo(map)
            .bindPopup('Nossa área de preservação.<br> Explore as espécies!')
            .openPopup();

        // Eventos do mapa para a descoberta
        map.on('mousemove', (e) => {
            if (allSpecies.length > 0) {
                const randomIndex = Math.floor(Math.random() * allSpecies.length);
                currentPreviewSpecies = allSpecies[randomIndex];

                // Exibe o nome comum na pré-visualização
                previewImage.src = `../assets/images/${currentPreviewSpecies.image_url}`;
                previewName.textContent = currentPreviewSpecies.name_common;
                previewCard.style.display = 'flex';
            }
        });

        map.on('mouseout', () => {
            previewCard.style.display = 'none';
        });

        map.on('click', () => {
            if (currentPreviewSpecies) {
                window.location.href = `species.html?id=${currentPreviewSpecies.id}`;
            }
        });
    }

    // Carga inicial
    fetchSpecies().then(() => {
        initDiscoveryMap();
    });
});
