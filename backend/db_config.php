<?php
// Configurações do Banco de Dados
define('DB_HOST', 'localhost');
define('DB_USERNAME', 'adoteumaarvore_danilo'); // Altere para o seu usuário
define('DB_PASSWORD', 'danilo!@#');     // Altere para a sua senha
define('DB_NAME', 'adoteumaarvore_eco');

/**
 * Cria e retorna uma conexão PDO com o banco de dados.
 * @return PDO
 */
function connect_db() {
    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8';

    try {
        $pdo = new PDO($dsn, DB_USERNAME, DB_PASSWORD);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        // Em um ambiente de produção, logue o erro em vez de exibi-lo.
        die('Erro de conexão com o banco de dados: ' . $e->getMessage());
    }
}
?>
