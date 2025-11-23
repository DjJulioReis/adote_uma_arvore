document.addEventListener('DOMContentLoaded', () => {
    const langSelect = document.getElementById('lang-select');
    let currentLang = localStorage.getItem('lang') || 'pt';
    let allSpecies = [];
    let currentPreviewSpecies = null;
    let map = null;

    const previewCard = document.getElementById('species-preview-card');
    const previewImage = document.getElementById('preview-image');
    const previewName = document.getElementById('preview-name');

    // Função para carregar e aplicar as traduções
    async function updateContent(lang) {
        try {
            const response = await fetch(`../locales/${lang}.json`);
            const translations = await response.json();
            document.querySelectorAll('[data-translate-key]').forEach(el => {
                const key = el.getAttribute('data-translate-key');
                if (translations[key]) el.textContent = translations[key];
            });
            document.title = translations.title || 'Adote uma Árvore';
        } catch (e) { console.error("Erro ao carregar traduções:", e); }
    }

    // Função para buscar as espécies da API e armazená-las
    async function fetchSpecies(lang) {
        try {
            const response = await fetch(`../backend/api.php?action=get_species&lang=${lang}`);
            const result = await response.json();
            if (result.success) {
                allSpecies = result.data;
                // A renderização de cards foi removida daqui, pois agora a interação é no mapa
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
                // Escolhe uma espécie aleatória para exibir
                const randomIndex = Math.floor(Math.random() * allSpecies.length);
                currentPreviewSpecies = allSpecies[randomIndex];

                previewImage.src = `../assets/images/${currentPreviewSpecies.image_url}`;
                previewName.textContent = currentPreviewSpecies.name;
                previewCard.style.display = 'flex';
            }
        });

        map.on('mouseout', () => {
            previewCard.style.display = 'none';
        });

        map.on('click', () => {
            if (currentPreviewSpecies) {
                // Redireciona para a página de detalhes da espécie
                window.location.href = `species.html?id=${currentPreviewSpecies.id}`;
            }
        });
    }

    // Event listener para o seletor de idioma
    langSelect.addEventListener('change', (e) => {
        currentLang = e.target.value;
        localStorage.setItem('lang', currentLang);
        loadPageContent();
    });

    // Função para carregar todo o conteúdo da página
    async function loadPageContent() {
        langSelect.value = currentLang;
        await updateContent(currentLang);
        await fetchSpecies(currentLang);
    }

    // Carga inicial
    loadPageContent().then(() => {
        initDiscoveryMap();
    });
});

// A função redirectToCheckout foi movida para species-detail.js
