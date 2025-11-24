<?php
session_start(); // Garante que a sessão está ativa para acessar o carrinho
header('Content-Type: application/json');
require_once 'db_config.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';
$pdo = connect_db();

try {
    switch ($action) {
        case 'get_species':
            // ... (código existente para get_species)
            if (isset($_GET['id'])) {
                $stmt = $pdo->prepare("SELECT id, name_common, name_scientific, description_pt, description_en, image_url, carbon_offset_kg FROM species WHERE id = :id");
                $stmt->execute(['id' => $_GET['id']]);
                $species = $stmt->fetch(PDO::FETCH_ASSOC);
            } else {
                $stmt = $pdo->query("SELECT id, name_common, name_scientific, image_url FROM species");
                $species = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
            echo json_encode(['success' => true, 'data' => $species]);
            break;

        case 'create_checkout_session':
            if (empty($_SESSION['cart'])) {
                throw new Exception("O carrinho está vazio.");
            }
            if (!isset($_SESSION['user_logged_in']) || !$_SESSION['user_logged_in']) {
                throw new Exception("Você precisa estar logado para finalizar a adoção.");
            }

            // require_once('../vendor/autoload.php');
            // \Stripe\Stripe::setApiKey('SUA_CHAVE_SECRETA_AQUI');

            $placeholders = implode(',', array_fill(0, count($_SESSION['cart']), '?'));
            $sql = "SELECT id, name_common FROM species WHERE id IN ({$placeholders})";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(array_values($_SESSION['cart']));
            $cart_items = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $line_items = [];
            $price_per_tree = 1500; // US$ 15.00 em centavos

            foreach ($cart_items as $item) {
                $line_items[] = [
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => ['name' => 'Adoção: ' . $item['name_common']],
                        'unit_amount' => $price_per_tree,
                    ],
                    'quantity' => 1,
                ];
            }

            $YOUR_DOMAIN = 'http://localhost:8000/frontend';

            // require_once('../vendor/autoload.php'); // 1. Instale o Stripe via Composer
            // \Stripe\Stripe::setApiKey('sk_test_...'); // 2. Insira sua chave secreta do Stripe aqui

            $checkout_session = \Stripe\Checkout\Session::create([
                'payment_method_types' => ['card'],
                'line_items' => $line_items,
                'mode' => 'payment',
                'success_url' => $YOUR_DOMAIN . '/payment_success.html?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => $YOUR_DOMAIN . '/payment_cancel.html',
                'metadata' => [
                    'user_id' => $_SESSION['user_id'],
                    'species_ids' => json_encode($_SESSION['cart'])
                ]
            ]);
            echo json_encode(['id' => $checkout_session->id]);
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
