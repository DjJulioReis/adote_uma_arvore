<?php
session_start();
header('Content-Type: application/json');
require_once 'db_config.php';

$action = $_POST['action'] ?? '';

try {
    $pdo = connect_db();

    switch ($action) {
        case 'register':
            $name = $_POST['name'] ?? '';
            $email = $_POST['email'] ?? '';
            $password = $_POST['password'] ?? '';

            if (empty($name) || empty($email) || empty($password)) {
                throw new Exception('Todos os campos são obrigatórios.');
            }
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                throw new Exception('E-mail inválido.');
            }

            // Verifica se o e-mail já existe
            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email");
            $stmt->execute(['email' => $email]);
            if ($stmt->fetch()) {
                throw new Exception('Este e-mail já está cadastrado.');
            }

            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            $sql = "INSERT INTO users (name, email, password) VALUES (:name, :email, :password)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['name' => $name, 'email' => $email, 'password' => $hashed_password]);

            echo json_encode(['success' => true, 'message' => 'Registro bem-sucedido!']);
            break;

        case 'login':
            $email = $_POST['email'] ?? '';
            $password = $_POST['password'] ?? '';

            if (empty($email) || empty($password)) {
                throw new Exception('E-mail e senha são obrigatórios.');
            }

            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
            $stmt->execute(['email' => $email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($password, $user['password'])) {
                $_SESSION['user_logged_in'] = true;
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_name'] = $user['name'];
                echo json_encode(['success' => true, 'message' => 'Login bem-sucedido.']);
            } else {
                throw new Exception('Credenciais inválidas.');
            }
            break;

        case 'logout':
            session_destroy();
            echo json_encode(['success' => true, 'message' => 'Logout bem-sucedido.']);
            break;

        case 'check_session':
            if (isset($_SESSION['user_logged_in']) && $_SESSION['user_logged_in'] === true) {
                echo json_encode(['success' => true, 'logged_in' => true, 'name' => $_SESSION['user_name']]);
            } else {
                echo json_encode(['success' => true, 'logged_in' => false]);
            }
            break;

        default:
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Ação não encontrada.']);
            break;
    }
} catch (Exception $e) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
