<?php
// save_early_access.php
require_once 'config.php';

// Проверяем метод запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

// Получаем данные из запроса
$input = json_decode(file_get_contents('php://input'), true);

// Если данные не в JSON, пробуем получить из POST
if (!$input && $_POST) {
    $input = $_POST;
}

// Валидация данных
if (!$input || !isset($input['phone']) || !isset($input['os'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Phone and OS are required']);
    exit();
}

$phone = trim($input['phone']);
$os = trim($input['os']);

// Валидация телефона (должен быть в формате +7XXXXXXXXXX)
if (!preg_match('/^\+7[0-9]{10}$/', $phone)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid phone number format']);
    exit();
}

// Валидация ОС
if (!in_array($os, ['android', 'ios'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid OS selection']);
    exit();
}

// Получаем IP и User Agent
$ipAddress = getClientIP();
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

// Проверяем, не регистрировался ли уже этот номер за последние 24 часа
try {
    $pdo = getDBConnection();
    
    // Опционально: проверка на дубликаты (можно закомментировать)
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM early_access_users WHERE phone = ? AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)");
    $stmt->execute([$phone]);
    $recentCount = $stmt->fetchColumn();
    
    if ($recentCount > 0) {
        echo json_encode([
            'success' => false, 
            'error' => 'This phone number was already registered in the last 24 hours'
        ]);
        exit();
    }
    
    // Сохраняем данные
    $stmt = $pdo->prepare("
        INSERT INTO early_access_users (phone, os, ip_address, user_agent) 
        VALUES (?, ?, ?, ?)
    ");
    
    $stmt->execute([$phone, $os, $ipAddress, $userAgent]);
    $userId = $pdo->lastInsertId();
    
    // Успешный ответ
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