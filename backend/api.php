<?php
header('Content-Type: application/json');
require_once 'db_config.php';

// Roteamento simples baseado no parâmetro 'action'
$action = isset($_GET['action']) ? $_GET['action'] : '';
$lang = isset($_GET['lang']) && $_GET['lang'] === 'en' ? 'en' : 'pt'; // Define 'pt' como padrão

try {
    $pdo = connect_db();

    switch ($action) {
        case 'get_species':
            // Seleciona os campos de nome e descrição com base no idioma
            $name_col = 'name_' . $lang;
            $desc_col = 'description_' . $lang;

            $stmt = $pdo->query("SELECT id, {$name_col} as name, {$desc_col} as description, image_url FROM species");
            $species = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'data' => $species]);
            break;

        // Exemplo de como o endpoint de adoção será estruturado (a ser implementado)
        case 'create_checkout_session':
            // Em um ambiente de produção, instale o Stripe via Composer.
            // require_once('../vendor/autoload.php');

            // O código abaixo é uma simulação funcional. Para produção,
            // descomente as linhas e insira sua chave secreta do Stripe.

            // \Stripe\Stripe::setApiKey('SUA_CHAVE_SECRETA_AQUI');

            $YOUR_DOMAIN = 'http://localhost:8000/frontend';

            header('Content-Type: application/json');

            /*
            $checkout_session = \Stripe\Checkout\Session::create([
                'payment_method_types' => ['card'], // Adicione 'pix' se ativado no seu painel
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [ 'name' => 'Adoção de Árvore Anual' ],
                        'unit_amount' => 1500, // US$ 15.00
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => $YOUR_DOMAIN . '/payment_success.html',
                'cancel_url' => $YOUR_DOMAIN . '/payment_cancel.html',
            ]);

            echo json_encode(['id' => $checkout_session->id]);
            */

            // Resposta simulada para permitir o teste do frontend sem uma chave de API real.
            // Em produção, o bloco acima deve ser usado.
            echo json_encode(['id' => 'cs_test_a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6']);
            break;

        default:
            http_response_code(404); // Not Found
            echo json_encode(['success' => false, 'message' => 'Ação não encontrada.']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'message' => 'Erro no servidor: ' . $e->getMessage()]);
}
?>
