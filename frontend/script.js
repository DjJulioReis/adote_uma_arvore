document.addEventListener('DOMContentLoaded', () => {
    const langSelect = document.getElementById('lang-select');
    let currentLang = localStorage.getItem('lang') || 'pt'; // Padrão para 'pt'

    // Função para carregar e aplicar as traduções
    async function updateContent(lang) {
        try {
            const response = await fetch(`../locales/${lang}.json`);
            if (!response.ok) throw new Error('Arquivo de tradução não encontrado.');

            const translations = await response.json();
            document.querySelectorAll('[data-translate-key]').forEach(el => {
                const key = el.getAttribute('data-translate-key');
                if (translations[key]) {
                    el.textContent = translations[key];
                }
            });
            // Atualiza o título da página também
            document.title = translations.title || 'Adote uma Árvore';
        } catch (error) {
            console.error("Erro ao carregar traduções:", error);
        }
    }

    // Função para buscar e exibir as espécies da API
    async function fetchSpecies(lang) {
        try {
            const response = await fetch(`../backend/api.php?action=get_species&lang=${lang}`);
            if (!response.ok) throw new Error('Falha ao buscar espécies.');

            const result = await response.json();
            const speciesList = document.getElementById('species-list');
            speciesList.innerHTML = ''; // Limpa a lista antes de adicionar novos itens

            if (result.success && result.data) {
                result.data.forEach(species => {
                    const card = document.createElement('div');
                    card.className = 'species-card';
                    card.innerHTML = `
                        <img src="../assets/${species.image_url}" alt="${species.name}">
                        <h3>${species.name}</h3>
                        <p>${species.description || ''}</p>
                        <button onclick="redirectToCheckout('${species.id}')">Adotar</button>
                    `;
                    speciesList.appendChild(card);
                });
            }
        } catch (error) {
            console.error("Erro ao buscar espécies:", error);
        }
    }

    // Função para redirecionar para o checkout do Stripe
    window.redirectToCheckout = async (speciesId) => {
        // Cole sua chave publicável do Stripe aqui
        const stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY');

        try {
            // Chame a API para criar a sessão de checkout
            const response = await fetch('../backend/api.php?action=create_checkout_session', { method: 'POST' });
            const session = await response.json();

            // Redirecione para o checkout do Stripe
            const result = await stripe.redirectToCheckout({
                sessionId: session.id,
            });

            if (result.error) {
                // Se `redirectToCheckout` falhar, exiba o erro
                alert(result.error.message);
            }
        } catch (error) {
            console.error('Erro ao redirecionar para o checkout:', error);
        }
    }

    // Event listener para o seletor de idioma
    langSelect.addEventListener('change', (e) => {
        currentLang = e.target.value;
        localStorage.setItem('lang', currentLang);
        loadPageContent();
    });

    // Função para carregar todo o conteúdo da página
    function loadPageContent() {
        langSelect.value = currentLang;
        updateContent(currentLang);
        fetchSpecies(currentLang);
    }

    // Função para inicializar o mapa
    function initMap() {
        const coords = [-25.665863, -48.466011]; // Coordenadas Corretas - Balneário Guarapari
        const map = L.map('map').setView(coords, 15); // Aumentei o zoom para 15 para melhor visualização

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker(coords).addTo(map)
            .bindPopup('Nossa área de preservação.<br> Adote uma árvore aqui!')
            .openPopup();
    }

    // Carga inicial
    loadPageContent();
    initMap();
});
