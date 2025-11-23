<?php
session_start();
header('Content-Type: application/json');
require_once '../../backend/db_config.php';

$action = isset($_POST['action']) ? $_POST['action'] : '';

try {
    $pdo = connect_db();

    switch ($action) {
        case 'login':
            $username = $_POST['username'] ?? '';
            $password = $_POST['password'] ?? '';

            if (empty($username) || empty($password)) {
                throw new Exception('Usuário e senha são obrigatórios.');
            }

            $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = :username");
            $stmt->execute(['username' => $username]);
            $admin = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($admin && password_verify($password, $admin['password'])) {
                $_SESSION['admin_logged_in'] = true;
                $_SESSION['admin_username'] = $admin['username'];
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
            if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
                echo json_encode(['success' => true, 'logged_in' => true, 'username' => $_SESSION['admin_username']]);
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
    http_response_code(401); // Unauthorized
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
