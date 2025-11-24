<?php
session_start();
header('Content-Type: application/json');
require_once 'db_config.php';

// Protege a API, exigindo que o usuário esteja logado
if (!isset($_SESSION['user_logged_in']) || !$_SESSION['user_logged_in']) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Acesso negado. Por favor, faça login.']);
    exit;
}

$pdo = connect_db();
$user_id = $_SESSION['user_id'];

try {
    // Busca as adoções do usuário, juntando com os detalhes da espécie
    $sql = "SELECT
                s.name_common,
                s.image_url,
                s.carbon_offset_kg,
                a.adoption_date,
                a.expires_at
            FROM adoptions a
            JOIN species s ON a.species_id = s.id
            WHERE a.user_id = :user_id
            ORDER BY a.adoption_date DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['user_id' => $user_id]);
    $adoptions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Calcula o total de carbono compensado
    $total_carbon_offset = 0;
    foreach ($adoptions as $adoption) {
        $total_carbon_offset += $adoption['carbon_offset_kg'];
    }

    echo json_encode([
        'success' => true,
        'data' => [
            'adoptions' => $adoptions,
            'total_carbon_offset' => $total_carbon_offset
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro no servidor: ' . $e->getMessage()]);
}
?>
