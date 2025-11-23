<?php
header('Content-Type: application/json');
require_once 'db_config.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';
$lang = isset($_GET['lang']) && $_GET['lang'] === 'en' ? 'en' : 'pt';

try {
    $pdo = connect_db();

    switch ($action) {
        case 'get_species':
            $name_col = 'name_' . $lang;
            $desc_col = 'description_' . $lang;

            if (isset($_GET['id'])) {
                $stmt = $pdo->prepare("SELECT id, {$name_col} as name, {$desc_col} as description, image_url FROM species WHERE id = :id");
                $stmt->execute(['id' => $_GET['id']]);
                $species = $stmt->fetch(PDO::FETCH_ASSOC);
            } else {
                $stmt = $pdo->query("SELECT id, {$name_col} as name, {$desc_col} as description, image_url FROM species");
                $species = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
            echo json_encode(['success' => true, 'data' => $species]);
            break;

        case 'create_checkout_session':
            // require_once('../vendor/autoload.php');
            // \Stripe\Stripe::setApiKey('SUA_CHAVE_SECRETA_AQUI');

            $data = json_decode(file_get_contents('php://input'), true);
            $species_id = $data['species_id'] ?? null;

            if (!$species_id) throw new Exception("ID da espécie é necessário.");

            // Busca o nome da espécie para o checkout
            $stmt = $pdo->prepare("SELECT name_pt FROM species WHERE id = :id");
            $stmt->execute(['id' => $species_id]);
            $species = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$species) throw new Exception("Espécie não encontrada.");

            $YOUR_DOMAIN = 'http://localhost:8000/frontend';
            /*
            $checkout_session = \Stripe\Checkout\Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [ 'name' => 'Adoção: ' . $species['name_pt'] ],
                        'unit_amount' => 1500,
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => $YOUR_DOMAIN . '/payment_success.html',
                'cancel_url' => $YOUR_DOMAIN . '/payment_cancel.html',
            ]);
            echo json_encode(['id' => $checkout_session->id]);
            */

            echo json_encode(['id' => 'cs_test_a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6_' . $species_id]);
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
