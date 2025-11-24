// frontend/i18n.js
document.addEventListener('DOMContentLoaded', () => {
    const langSelect = document.getElementById('lang-select');

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
            // Tenta atualizar o título da página principal
            if (document.title.includes('Adote uma Árvore') || document.title.includes('Adopt a Tree')) {
                 document.title = translations.title;
            }
        } catch (error) {
            console.error("Erro ao carregar traduções:", error);
        }
    }

    function setLanguage(lang) {
        localStorage.setItem('lang', lang);
        if (langSelect) langSelect.value = lang;
        updateContent(lang);
    }

    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }

    // Carga inicial
    const currentLang = localStorage.getItem('lang') || 'pt';
    setLanguage(currentLang);
});
