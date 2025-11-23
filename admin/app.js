document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const loginContainer = document.getElementById('login-container');
    const adminPanel = document.getElementById('admin-panel');
    const loginForm = document.getElementById('login-form');
    const speciesForm = document.getElementById('species-form');
    const speciesTbody = document.getElementById('species-tbody');
    const logoutBtn = document.getElementById('logout-btn');
    const adminUser = document.getElementById('admin-user');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');

    // API endpoints
    const authApi = 'api/auth.php';
    const speciesApi = 'api/species.php';

    // Função para renderizar as espécies na tabela
    const renderSpecies = (species) => {
        speciesTbody.innerHTML = '';
        species.forEach(s => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${s.id}</td>
                <td>${s.name_common}</td>
                <td>${s.name_scientific}</td>
                <td>
                    <button onclick="editSpecies(${s.id})">Editar</button>
                    <button onclick="deleteSpecies(${s.id})">Excluir</button>
                </td>
            `;
            speciesTbody.appendChild(row);
        });
    };

    // Função para buscar as espécies
    const fetchSpecies = async () => {
        try {
            const response = await fetch(speciesApi);
            const result = await response.json();
            if (result.success) {
                renderSpecies(result.data);
            }
        } catch (error) {
            console.error('Erro ao buscar espécies:', error);
        }
    };

    // Função para verificar a sessão
    const checkSession = async () => {
        try {
            const response = await fetch(authApi, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `action=check_session`
            });
            const result = await response.json();
            if (result.logged_in) {
                adminUser.textContent = `Usuário: ${result.username}`;
                loginContainer.style.display = 'none';
                adminPanel.style.display = 'block';
                fetchSpecies();
            } else {
                loginContainer.style.display = 'block';
                adminPanel.style.display = 'none';
            }
        } catch (error) {
            console.error('Erro ao verificar sessão:', error);
        }
    };

    // Evento de login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('action', 'login');
        formData.append('username', document.getElementById('username').value);
        formData.append('password', document.getElementById('password').value);

        try {
            const response = await fetch(authApi, { method: 'POST', body: formData });
            const result = await response.json();
            if (result.success) {
                checkSession();
            } else {
                document.getElementById('login-error').textContent = result.message;
            }
        } catch (error) {
            console.error('Erro de login:', error);
        }
    });

    // Evento de logout
    logoutBtn.addEventListener('click', async () => {
        await fetch(authApi, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=logout`
        });
        checkSession();
    });

    // Evento de salvar/editar espécie
    speciesForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('species-id').value;
        const data = {
            id: id,
            name_common: document.getElementById('name_common').value,
            name_scientific: document.getElementById('name_scientific').value,
            description_pt: document.getElementById('description_pt').value,
            description_en: document.getElementById('description_en').value,
            image_url: document.getElementById('image_url').value
        };

        const method = id ? 'PUT' : 'POST';

        try {
            await fetch(speciesApi, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            speciesForm.reset();
            cancelEditBtn.style.display = 'none';
            fetchSpecies();
        } catch (error) {
            console.error('Erro ao salvar espécie:', error);
        }
    });

    // Funções globais para botões de ação
    window.editSpecies = async (id) => {
        try {
            const response = await fetch(`${speciesApi}?id=${id}`);
            const result = await response.json();
            const species = result.data;

            document.getElementById('species-id').value = species.id;
            document.getElementById('name_common').value = species.name_common;
            document.getElementById('name_scientific').value = species.name_scientific;
            document.getElementById('description_pt').value = species.description_pt;
            document.getElementById('description_en').value = species.description_en;
            document.getElementById('image_url').value = species.image_url;
            cancelEditBtn.style.display = 'inline';
        } catch (error) {
            console.error('Erro ao carregar dados para edição:', error);
        }
    };

    window.deleteSpecies = async (id) => {
        if (confirm('Tem certeza que deseja excluir esta espécie?')) {
            await fetch(`${speciesApi}?id=${id}`, { method: 'DELETE' });
            fetchSpecies();
        }
    };

    cancelEditBtn.addEventListener('click', () => {
        speciesForm.reset();
        document.getElementById('species-id').value = '';
        cancelEditBtn.style.display = 'none';
    });

    // Verificação inicial da sessão
    checkSession();
});
