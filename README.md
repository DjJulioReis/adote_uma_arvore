# Projeto Adote uma Árvore

Este é um site para a adoção de árvores, com o objetivo de arrecadar fundos para a preservação de uma área de Mata Atlântica em Pontal do Paraná. O projeto utiliza um mapa interativo para a descoberta de espécies nativas da região.

## Funcionalidades

-   **Mapa de Descoberta:** Uma experiência interativa onde os usuários exploram espécies nativas ao mover o mouse pelo mapa.
-   **Páginas de Detalhes:** Perfis detalhados para cada espécie, com informações e botão para adoção.
-   **Painel Administrativo:** Interface segura para gerenciar as espécies (Nome Popular, Nome Científico, descrições, etc.).
-   **Pagamentos:** Integração pronta para o Stripe (Cartão de Crédito e PIX).
-   **Design Responsivo:** Adaptável a desktops, tablets e celulares.
-   **Banco de Dados Completo:** O sistema já vem populado com 30 espécies nativas da região de Pontal do Paraná.

## Pré-requisitos

-   Servidor web com suporte a PHP (ex: Apache, Nginx).
-   Banco de dados MySQL ou MariaDB.

## Instalação

1.  **Clone o Repositório**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd <NOME_DO_DIRETORIO>
    ```

2.  **Importe o Banco de Dados**
    -   Crie um novo banco de dados no seu servidor MySQL (ex: `adoteumaarvore_eco`).
    -   Importe o arquivo `database/schema.sql` para criar as tabelas.
    -   Importe `database/seeds.sql` para carregar a lista completa de 30 espécies.

3.  **Configure o Backend**
    -   Abra o arquivo `backend/db_config.php`.
    -   Altere as constantes `DB_HOST`, `DB_USERNAME` e `DB_PASSWORD` com as suas credenciais. O `DB_NAME` já vem configurado como `adoteumaarvore_eco`.

4.  **Crie um Administrador (Obrigatório)**
    -   Para acessar o painel administrativo, você precisa criar um usuário. Execute o seguinte script PHP no seu terminal ou crie um arquivo temporário para executá-lo. **Lembre-se de deletar este arquivo depois.**

    ```php
    <?php
    require 'backend/db_config.php';
    $pdo = connect_db();
    $username = 'admin'; // Escolha seu nome de usuário
    $password = 'admin123'; // Escolha uma senha forte
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("INSERT INTO admins (username, password) VALUES (:username, :password)");
    $stmt->execute(['username' => $username, 'password' => $hashed_password]);
    echo "Administrador criado com sucesso!";
    ?>
    ```

5.  **Configure a Integração com o Stripe**
    -   Instale a biblioteca do Stripe via Composer na raiz do projeto: `composer require stripe/stripe-php`.
    -   **Chave Secreta:** Abra `backend/api.php`, descomente as duas linhas indicadas e insira sua chave secreta do Stripe (`sk_test_...`).
    -   **Chave Publicável:** Abra `frontend/cart.js`, encontre a linha `const stripe = Stripe(...)` e insira sua chave publicável (`pk_test_...`).

## Como Usar

### Site Público
Acesse o diretório `frontend/` no seu navegador. A página carregará o mapa interativo para exploração.

### Painel Administrativo
-   Acesse o diretório `admin/`.
-   Use o usuário e a senha que você criou na etapa 4 da instalação.
-   No painel, você pode adicionar, editar e excluir as espécies de árvores.
