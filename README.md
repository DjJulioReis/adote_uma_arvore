# Projeto Adote uma Árvore

Este é um site para a adoção de árvores, com o objetivo de arrecadar fundos para a preservação de uma área de Mata Atlântica em Pontal do Paraná.

## Funcionalidades

-   **Site Público:** Interface para usuários visualizarem e adotarem árvores.
-   **Multi-idioma:** Suporte para Português e Inglês.
-   **Painel Administrativo:** Interface segura para gerenciar as espécies de árvores.
-   **Pagamentos:** Integração pronta para o Stripe (Cartão de Crédito e PIX).
-   **Design Responsivo:** Adaptável a desktops, tablets e celulares.

## Pré-requisitos

-   Servidor web com suporte a PHP (ex: Apache, Nginx).
-   Banco de dados MySQL ou MariaDB.
-   (Opcional) Composer para gerenciar dependências PHP.

## Instalação

1.  **Clone o Repositório**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd <NOME_DO_DIRETORIO>
    ```

2.  **Importe o Banco de Dados**
    -   Crie um novo banco de dados no seu servidor MySQL (ex: `tree_adoption`).
    -   Importe o arquivo `database/schema.sql` para criar as tabelas.
    -   (Opcional) Importe `database/seeds.sql` para carregar dados de exemplo.

3.  **Configure o Backend**
    -   Abra o arquivo `backend/db_config.php`.
    -   Altere as constantes `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD` e `DB_NAME` com as suas credenciais do banco de dados.

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
    -   (Opcional, se for usar pagamentos) Instale a biblioteca do Stripe via Composer: `composer require stripe/stripe-php`.
    -   Abra o arquivo `backend/api.php`.
    -   Descomente as linhas relacionadas ao Stripe e insira suas chaves (secretas e publicáveis) nos locais indicados.
    -   Atualize a variável `$YOUR_DOMAIN` com a URL do seu site.

## Como Usar

### Site Público
Acesse o diretório `frontend/` no seu navegador. A página carregará as espécies e permitirá a troca de idiomas.

### Painel Administrativo
-   Acesse o diretório `admin/`.
-   Use o usuário e a senha que você criou na etapa 4 da instalação.
-   No painel, você pode adicionar, editar e excluir as espécies de árvores.

## Gerenciando Idiomas

Os textos do site são armazenados em `locales/pt.json` (Português) e `locales/en.json` (Inglês). Para adicionar ou modificar traduções, basta editar esses arquivos mantendo a mesma estrutura de chaves.
