<?php
// download.php - ТОЛЬКО ЗАПИСЬ СТАТИСТИКИ
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// ПОДКЛЮЧЕНИЕ К БД
try {
    $pdo = new PDO("mysql:host=localhost;dbname=analitics;charset=utf8mb4", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Ошибка БД']);
    exit;
}

// ПОЛУЧАЕМ ДАННЫЕ
$action = $_GET['action'] ?? '';
$user_id = $_GET['ref'] ?? 'guest';

// ОПРЕДЕЛЕНИЕ УСТРОЙСТВА
function getDevice($ua) {
    $device = ['type' => 'Desktop', 'browser' => 'Unknown', 'os' => 'Unknown'];
    
    if (stripos($ua, 'Android') !== false) { $device['os'] = 'Android'; $device['type'] = 'Mobile'; }
    elseif (stripos($ua, 'iPhone') !== false) { $device['os'] = 'iOS'; $device['type'] = 'Mobile'; }
    elseif (stripos($ua, 'iPad') !== false) { $device['os'] = 'iOS'; $device['type'] = 'Tablet'; }
    elseif (stripos($ua, 'Windows') !== false) { $device['os'] = 'Windows'; }
    elseif (stripos($ua, 'Mac') !== false) { $device['os'] = 'macOS'; }
    elseif (stripos($ua, 'Linux') !== false) { $device['os'] = 'Linux'; }
    
    if (stripos($ua, 'Chrome') !== false && stripos($ua, 'Edg') === false) $device['browser'] = 'Chrome';
    elseif (stripos($ua, 'Firefox') !== false) $device['browser'] = 'Firefox';
    elseif (stripos($ua, 'Safari') !== false && stripos($ua, 'Chrome') === false) $device['browser'] = 'Safari';
    elseif (stripos($ua, 'Edg') !== false) $device['browser'] = 'Edge';
    
    if (stripos($ua, 'Mobile') !== false || stripos($ua, 'Tablet') !== false) $device['type'] = 'Mobile';
    
    return $device;
}

// СОХРАНЕНИЕ
function saveStat($pdo, $user_id, $is_download = false) {
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $device = getDevice($ua);
    
    // Сохраняем в download_stats
    $stmt = $pdo->prepare("
        INSERT INTO download_stats 
        (user_id, ip_address, user_agent, device_type, browser, os, is_download) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$user_id, $ip, $ua, $device['type'], $device['browser'], $device['os'], $is_download ? 1 : 0]);
    
    // Обновляем счетчик
    $stmt = $pdo->prepare("
        INSERT INTO download_counts (user_id, total_views, total_downloads) 
        VALUES (?, 0, 0) 
        ON DUPLICATE KEY UPDATE 
            total_views = total_views + 1,
            total_downloads = total_downloads + ?
    ");
    $stmt->execute([$user_id, $is_download ? 1 : 0]);
}

// ОБРАБОТКА
if ($action === 'view') {
    saveStat($pdo, $user_id, false);
    echo json_encode(['success' => true]);
} elseif ($action === 'download') {
    saveStat($pdo, $user_id, true);
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Неизвестное действие']);
}