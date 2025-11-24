<?php
session_start();
header('Content-Type: application/json');
require_once 'db_config.php';

// Inicializa o carrinho se não existir
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

$action = $_POST['action'] ?? $_GET['action'] ?? '';
$pdo = connect_db();

try {
    switch ($action) {
        case 'add':
            $species_id = $_POST['species_id'] ?? null;
            if (!$species_id) throw new Exception("ID da espécie é necessário.");

            // Evita adicionar o mesmo item duas vezes
            if (!in_array($species_id, $_SESSION['cart'])) {
                $_SESSION['cart'][] = $species_id;
            }

            echo json_encode(['success' => true, 'message' => 'Item adicionado ao carrinho.', 'cart' => $_SESSION['cart']]);
            break;

        case 'remove':
            $species_id = $_POST['species_id'] ?? null;
            if (!$species_id) throw new Exception("ID da espécie é necessário.");

            $_SESSION['cart'] = array_filter($_SESSION['cart'], function($id) use ($species_id) {
                return $id != $species_id;
            });

            echo json_encode(['success' => true, 'message' => 'Item removido do carrinho.', 'cart' => array_values($_SESSION['cart'])]);
            break;

        case 'get':
            if (empty($_SESSION['cart'])) {
                echo json_encode(['success' => true, 'data' => []]);
                exit;
            }

            // Busca os detalhes dos itens no carrinho
            $placeholders = implode(',', array_fill(0, count($_SESSION['cart']), '?'));
            $sql = "SELECT id, name_common, image_url, carbon_offset_kg FROM species WHERE id IN ({$placeholders})";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(array_values($_SESSION['cart']));
            $cart_items = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode(['success' => true, 'data' => $cart_items]);
            break;

        default:
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Ação não encontrada.']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro no servidor: ' . $e->getMessage()]);
}
?>
