document.addEventListener('DOMContentLoaded', () => {
    let allSpecies = [];
    let currentPreviewSpecies = null;
    let map = null;

    const previewCard = document.getElementById('species-preview-card');
    const previewImage = document.getElementById('preview-image');
    const previewName = document.getElementById('preview-name');

    // Função para buscar as espécies da API
    async function fetchSpecies() {
        try {
            const response = await fetch(`../backend/api.php?action=get_species`);
            const result = await response.json();
            if (result.success) {
                allSpecies = result.data;
            }
        } catch (e) { console.error("Erro ao buscar espécies:", e); }
    }

    // Função para inicializar o mapa de descoberta
    function initDiscoveryMap() {
        const centerCoords = [-25.665863, -48.466011];
        map = L.map('map').setView(centerCoords, 17); // Zoom aumentado para 17
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        // Função para gerar uma coordenada aleatória dentro de uma área
        function getRandomCoords(lat, lon, radiusInMeters) {
            const r = radiusInMeters / 111320; // Aproximação de metros para graus
            const u = Math.random();
            const v = Math.random();
            const w = r * Math.sqrt(u);
            const t = 2 * Math.PI * v;
            const x = w * Math.cos(t);
            const y = w * Math.sin(t);
            return [lat + y, lon + x];
        }

        // Gera múltiplos marcadores espalhados
        allSpecies.forEach(species => {
            // Cria 3 marcadores por espécie para um mapa mais preenchido
            for (let i = 0; i < 3; i++) {
                const randomCoords = getRandomCoords(centerCoords[0], centerCoords[1], 300); // 600m de diâmetro

                const dynamicIcon = L.divIcon({
                    className: 'tree-icon',
                    html: `<div style="background-image: url('../assets/images/${species.image_url}');"></div>`,
                    iconSize: [32, 32]
                });

                const marker = L.marker(randomCoords, { icon: dynamicIcon }).addTo(map);

                marker.on('mouseover', () => {
                    currentPreviewSpecies = species;
                    previewImage.src = `../assets/images/${species.image_url}`;
                    previewName.textContent = species.name_common;
                    previewCard.style.display = 'flex';
                });

                marker.on('mouseout', () => {
                    previewCard.style.display = 'none';
                });

                marker.on('click', () => {
                    if (species) {
                        window.location.href = `species.html?id=${species.id}`;
                    }
                });
            }
        });
    }

    // Carga inicial
    fetchSpecies().then(() => {
        initDiscoveryMap();
    });
});
