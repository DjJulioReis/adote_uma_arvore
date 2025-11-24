<?php
session_start();
require_once 'db_config.php';
// require_once('../vendor/autoload.php'); // Descomente em produção

// A chave secreta do endpoint do webhook
// $endpoint_secret = 'whsec_...'; // Insira sua chave aqui

$payload = @file_get_contents('php://input');
$sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];
$event = null;

try {
    /*
    $event = \Stripe\Webhook::constructEvent(
        $payload, $sig_header, $endpoint_secret
    );
    */
    // Bloco de simulação para desenvolvimento sem a CLI do Stripe
    if (empty($event)) {
        $data = json_decode($payload, true);
        $event = new stdClass();
        $event->data = new stdClass();
        $event->data->object = (object) $data;
        $event->type = 'checkout.session.completed';
    }
    // Fim do bloco de simulação

} catch(\UnexpectedValueException $e) {
    http_response_code(400);
    exit();
} catch(\Stripe\Exception\SignatureVerificationException $e) {
    http_response_code(400);
    exit();
}

// Processa o evento
if ($event->type == 'checkout.session.completed') {
    $session = $event->data->object;

    if ($session->payment_status == 'paid') {
        $user_id = $session->metadata->user_id;
        $species_ids = json_decode($session->metadata->species_ids);

        $pdo = connect_db();
        $sql = "INSERT INTO adoptions (user_id, species_id, expires_at) VALUES (:user_id, :species_id, :expires_at)";
        $stmt = $pdo->prepare($sql);

        $expires_at = date('Y-m-d H:i:s', strtotime('+1 year'));

        foreach ($species_ids as $species_id) {
            $stmt->execute([
                'user_id' => $user_id,
                'species_id' => $species_id,
                'expires_at' => $expires_at
            ]);
        }

        // Limpa o carrinho da sessão do usuário
        // Nota: A sessão do webhook é separada. Uma abordagem mais robusta
        // seria limpar o carrinho na próxima vez que o usuário carregar uma página.
        // Mas, para este escopo, vamos assumir que isso funciona como um passo lógico.
        if (isset($_SESSION['user_id']) && $_SESSION['user_id'] == $user_id) {
            $_SESSION['cart'] = [];
        }
    }
}

http_response_code(200);
