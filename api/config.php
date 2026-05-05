<?php
// config.php

// Строгий режим
declare(strict_types=1);

// Запрет прямого доступа к config файлу
if (basename($_SERVER['PHP_SELF']) === 'config.php') {
    http_response_code(403);
    die('Access denied');
}

// Конфигурация БД - вынесите за пределы веб-доступа
// Создайте файл вне public_html и подключите его
// Например: /home/user/config/db_config.php
$configPath = __DIR__ . '/../../config/db_config.php';
if (file_exists($configPath)) {
    require_once $configPath;
} else {
    // Для локальной разработки (НЕ ИСПОЛЬЗОВАТЬ НА ПРОДАКШЕНЕ)
    define('DB_HOST', 'localhost');
    define('DB_NAME', 'ifou_tel');
    define('DB_USER', 'root');
    define('DB_PASS', '');
    
    // Флаг окружения
    define('IS_PRODUCTION', false);
}

// Настройки безопасности
define('MAX_REQUESTS_PER_IP', 5); // максимум запросов с одного IP
define('TIME_WINDOW_MINUTES', 60); // за последние 60 минут
define('REQUEST_TIMEOUT', 30); // секунд

// Секретный ключ для CSRF (сохраните в отдельном файле)
// define('CSRF_SECRET', 'your-strong-secret-here');

// Настройки CORS (динамические)
function getCorsHeaders() {
    $allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'https://yourdomain.com',
        'https://www.yourdomain.com'
    ];
    
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, $allowedOrigins)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Credentials: true');
    }
    
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token, X-Requested-With');
    header('Access-Control-Max-Age: 86400'); // 24 часа кэширования preflight
    header('Content-Type: application/json; charset=utf-8');
}

// Обработка preflight запросов
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    getCorsHeaders();
    http_response_code(200);
    exit();
}

// Применяем CORS заголовки
getCorsHeaders();

// Безопасные заголовки для защиты
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Функция для получения реального IP
function getClientIP(): string {
    $headers = [
        'HTTP_CF_CONNECTING_IP',
        'HTTP_X_FORWARDED_FOR',
        'HTTP_X_REAL_IP',
        'HTTP_CLIENT_IP'
    ];
    
    foreach ($headers as $header) {
        if (!empty($_SERVER[$header])) {
            $ips = explode(',', $_SERVER[$header]);
            $ip = trim($ips[0]);
            
            // Валидация IP
            if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                return $ip;
            }
        }
    }
    
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    
    // Для локальной разработки
    if (!IS_PRODUCTION && ($ip === '127.0.0.1' || $ip === '::1')) {
        return $ip;
    }
    
    // Проверка на приватные IP
    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
        return '0.0.0.0';
    }
    
    return $ip;
}

// Функция для ограничения количества запросов (Rate Limiting)
function checkRateLimit(PDO $pdo, string $ip): bool {
    $stmt = $pdo->prepare("
        SELECT COUNT(*) FROM rate_limit 
        WHERE ip_address = ? AND created_at > DATE_SUB(NOW(), INTERVAL ? MINUTE)
    ");
    $stmt->execute([$ip, TIME_WINDOW_MINUTES]);
    $count = $stmt->fetchColumn();
    
    if ($count >= MAX_REQUESTS_PER_IP) {
        http_response_code(429);
        echo json_encode([
            'success' => false, 
            'error' => 'Слишком много запросов. Попробуйте позже.'
        ]);
        return false;
    }
    
    // Логируем запрос
    $stmt = $pdo->prepare("
        INSERT INTO rate_limit (ip_address) VALUES (?)
    ");
    $stmt->execute([$ip]);
    
    return true;
}

// Функция для санитизации входящих данных
function sanitizeInput(string $input): string {
    // Удаляем пробелы в начале и конце
    $input = trim($input);
    // Удаляем нулевые байты
    $input = str_replace(chr(0), '', $input);
    // HTML-сущности (опционально)
    // $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    
    return $input;
}

// Функция для подключения к БД с SSL (для продакшена)
function getDBConnection(): PDO {
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_TIMEOUT => REQUEST_TIMEOUT
    ];
    
    // SSL для продакшена
    if (IS_PRODUCTION) {
        $options[PDO::MYSQL_ATTR_SSL_CA] = '/path/to/ca-cert.pem';
        $options[PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT] = true;
    }
    
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        
        // Устанавливаем режим SQL для безопасности
        $pdo->exec("SET sql_mode = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION'");
        $pdo->exec("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
        
        return $pdo;
    } catch (PDOException $e) {
        // Логируем ошибку без деталей для продакшена
        if (IS_PRODUCTION) {
            error_log("Database connection failed: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Database connection failed']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $e->getMessage()]);
        }
        exit();
    }
}

// Функция для генерации CSRF токена
function generateCSRFToken(): string {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    
    return $_SESSION['csrf_token'];
}

// Функция для валидации CSRF токена
function validateCSRFToken(string $token): bool {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    if (!isset($_SESSION['csrf_token'])) {
        return false;
    }
    
    return hash_equals($_SESSION['csrf_token'], $token);
}
?>