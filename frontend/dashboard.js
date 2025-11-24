document.addEventListener('DOMContentLoaded', () => {
    const welcomeMessage = document.getElementById('welcome-message');
    const totalCarbonOffset = document.getElementById('total-carbon-offset');
    const adoptionList = document.getElementById('adoption-list');
    const dashboardApi = '../backend/dashboard_api.php';

    async function loadDashboard() {
        try {
            const response = await fetch(dashboardApi);
            if (!response.ok) {
                // Se a API retornar um erro (ex: 403 Forbidden), o usuário não está logado
                if (response.status === 403) {
                    window.location.href = 'login.html'; // Redireciona para o login
                }
                throw new Error('Falha ao carregar os dados.');
            }

            const result = await response.json();

            if (result.success) {
                const { adoptions, total_carbon_offset } = result.data;

                // Pega o nome do usuário do cabeçalho, se disponível
                const userName = document.querySelector('#user-nav span')?.textContent.replace('Bem-vindo, ', '').replace('!', '');
                if(userName) welcomeMessage.textContent = `Bem-vindo, ${userName}!`;

                totalCarbonOffset.textContent = `${total_carbon_offset.toFixed(2)} kg`;

                if (adoptions.length > 0) {
                    adoptionList.innerHTML = '';
                    adoptions.forEach(item => {
                        const adoptionDiv = document.createElement('div');
                        adoptionDiv.className = 'adoption-item';
                        const adoptionDate = new Date(item.adoption_date).toLocaleDateString('pt-BR');
                        adoptionDiv.innerHTML = `
                            <img src="../assets/images/${item.image_url}" alt="${item.name_common}">
                            <div>
                                <h3>${item.name_common}</h3>
                                <p>Adotada em: ${adoptionDate}</p>
                            </div>
                        `;
                        adoptionList.appendChild(adoptionDiv);
                    });
                } else {
                    adoptionList.innerHTML = '<p>Você ainda não adotou nenhuma árvore.</p>';
                }
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            adoptionList.innerHTML = `<p>${error.message}</p>`;
        }
    }

    loadDashboard();
});
