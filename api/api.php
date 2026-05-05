<?php
// api.php - универсальный API эндпоинт
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['PATH_INFO'] ?? '/';
$input = json_decode(file_get_contents('php://input'), true);

try {
    $pdo = getDBConnection();
    
    switch ($method) {
        case 'POST':
            if ($path === '/register' || $path === '/') {
                handleRegistration($pdo, $input);
            } else {
                throw new Exception('Endpoint not found', 404);
            }
            break;
            
        case 'GET':
            if ($path === '/stats') {
                handleStats($pdo);
            } else {
                throw new Exception('Endpoint not found', 404);
            }
            break;
            
        default:
            throw new Exception('Method not allowed', 405);
    }
} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

function handleRegistration($pdo, $input) {
    if (!isset($input['phone']) || !isset($input['os'])) {
        throw new Exception('Phone and OS are required', 400);
    }
    
    $phone = trim($input['phone']);
    $os = trim($input['os']);
    
    // Валидация
    if (!preg_match('/^\+7[0-9]{10}$/', $phone)) {
        throw new Exception('Invalid phone number format', 400);
    }
    
    if (!in_array($os, ['android', 'ios'])) {
        throw new Exception('Invalid OS selection', 400);
    }
    
    $ipAddress = getClientIP();
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
    
    $stmt = $pdo->prepare("
        INSERT INTO early_access_users (phone, os, ip_address, user_agent) 
        VALUES (?, ?, ?, ?)
    ");
    
    $stmt->execute([$phone, $os, $ipAddress, $userAgent]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Successfully registered for early access',
        'id' => $pdo->lastInsertId()
    ]);
}

function handleStats($pdo) {
    $stmt = $pdo->query("
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN os = 'android' THEN 1 ELSE 0 END) as android_count,
            SUM(CASE WHEN os = 'ios' THEN 1 ELSE 0 END) as ios_count,
            COUNT(DISTINCT ip_address) as unique_ips,
            DATE(created_at) as date
        FROM early_access_users
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 30
    ");
    
    $stats = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'stats' => $stats
    ]);
}
?>