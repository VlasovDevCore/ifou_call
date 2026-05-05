<?php
// save_early_access.php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input && $_POST) {
    $input = $_POST;
}

if (!$input || !isset($input['phone']) || !isset($input['os'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Phone and OS are required']);
    exit();
}

$phone = trim($input['phone']);
$os = trim($input['os']);

// Проверка формата телефона: +7 и затем 9 и еще 9 цифр (всего 11 символов с +7)
if (!preg_match('/^\+7(9\d{9})$/', $phone, $matches)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Номер должен начинаться с 9 (например: +79XXXXXXXXX)']);
    exit();
}

// Дополнительная проверка, что после +7 идет 9
$numberAfterCode = substr($phone, 2); // убираем +7
if ($numberAfterCode[0] !== '9') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Номер должен начинаться с 9']);
    exit();
}

if (!in_array($os, ['android', 'ios'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid OS selection']);
    exit();
}

$ipAddress = getClientIP();
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

try {
    $pdo = getDBConnection();
    
    // Проверка на дубликаты за последние 24 часа
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM early_access_users WHERE phone = ? AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)");
    $stmt->execute([$phone]);
    $recentCount = $stmt->fetchColumn();
    
    if ($recentCount > 0) {
        echo json_encode([
            'success' => false, 
            'error' => 'Этот номер уже регистрировался за последние 24 часа'
        ]);
        exit();
    }
    
    $stmt = $pdo->prepare("
        INSERT INTO early_access_users (phone, os, ip_address, user_agent) 
        VALUES (?, ?, ?, ?)
    ");
    
    $stmt->execute([$phone, $os, $ipAddress, $userAgent]);
    $userId = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'message' => 'Successfully registered for early access',
        'data' => [
            'id' => $userId,
            'phone' => $phone,
            'os' => $os,
            'created_at' => date('Y-m-d H:i:s')
        ]
    ]);
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error occurred']);
}
?>