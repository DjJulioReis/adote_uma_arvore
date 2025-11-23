<?php
session_start();
header('Content-Type: application/json');
require_once '../../backend/db_config.php';

// Protege a API
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Acesso negado.']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$pdo = connect_db();

try {
    switch ($method) {
        // Obter uma ou todas as espécies
        case 'GET':
            if (isset($_GET['id'])) {
                $stmt = $pdo->prepare("SELECT * FROM species WHERE id = :id");
                $stmt->execute(['id' => $_GET['id']]);
                $species = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode(['success' => true, 'data' => $species]);
            } else {
                $stmt = $pdo->query("SELECT * FROM species ORDER BY id DESC");
                $species = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode(['success' => true, 'data' => $species]);
            }
            break;

        // Criar uma nova espécie
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            $sql = "INSERT INTO species (name_pt, name_en, description_pt, description_en, image_url) VALUES (:name_pt, :name_en, :description_pt, :description_en, :image_url)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($data);
            echo json_encode(['success' => true, 'message' => 'Espécie adicionada com sucesso.']);
            break;

        // Atualizar uma espécie
        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            $sql = "UPDATE species SET name_pt = :name_pt, name_en = :name_en, description_pt = :description_pt, description_en = :description_en, image_url = :image_url WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($data);
            echo json_encode(['success' => true, 'message' => 'Espécie atualizada com sucesso.']);
            break;

        // Deletar uma espécie
        case 'DELETE':
            $id = $_GET['id'] ?? null;
            if (!$id) throw new Exception("ID da espécie é necessário.");

            $stmt = $pdo->prepare("DELETE FROM species WHERE id = :id");
            $stmt->execute(['id' => $id]);
            echo json_encode(['success' => true, 'message' => 'Espécie deletada com sucesso.']);
            break;

        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Método não permitido.']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro no servidor: ' . $e->getMessage()]);
}
?>
