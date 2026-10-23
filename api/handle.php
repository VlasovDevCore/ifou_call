<?php
// handle.php - кто за короткой ссылкой https://ifou.ru/<код> (ник или ссылка канала).
//
//   GET /api/handle.php?code=vlasov           -> JSON бэкенда мессенджера
//       { ok, kind: "user", user: { nickname, name, avatarUrl } }
//       { ok, kind: "channel", channel: { slug, title, description, avatarUrl, isPrivate, memberCount } }
//       404 { ok: false } - код свободен
//   GET /api/handle.php?code=vlasov&avatar=1  -> сама аватарка (image/*)
//
// Ходит на бэкенд сервером, а не из браузера: бэкенду не нужен CORS для сайта,
// а аватарку браузер не загрузил бы с чужого домена (helmet, CORP same-origin).
// avatarUrl в ответе подменяется на этот же скрипт - наружу адрес бэкенда не уходит.

declare(strict_types=1);

// Адрес бэкенда: переменная окружения IFOU_BACKEND_URL или константа
// IFOU_BACKEND_URL в ../../config/db_config.php (вне веб-папки), иначе - по умолчанию.
$configPath = __DIR__ . '/../../config/db_config.php';
if (file_exists($configPath)) {
    require_once $configPath;
}
$backend = getenv('IFOU_BACKEND_URL') ?: (defined('IFOU_BACKEND_URL') ? IFOU_BACKEND_URL : 'https://vevx.ru');
$backend = rtrim((string)$backend, '/');

header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');

function fail(int $status): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode(['ok' => false]);
    exit();
}

/** GET [url]: [status, body, contentType]. */
function fetchUrl(string $url, int $maxBytes): array {
    $ch = curl_init($url);
    $body = '';
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => false,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_CONNECTTIMEOUT => 4,
        CURLOPT_TIMEOUT => 8,
        CURLOPT_PROTOCOLS => CURLPROTO_HTTP | CURLPROTO_HTTPS,
        CURLOPT_HTTPHEADER => ['Accept: application/json, image/*'],
        CURLOPT_WRITEFUNCTION => function ($ch, string $chunk) use (&$body, $maxBytes): int {
            $body .= $chunk;
            // Больше лимита - обрываем загрузку.
            return strlen($body) > $maxBytes ? 0 : strlen($chunk);
        },
    ]);
    $ok = curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    $type = (string)curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
    curl_close($ch);
    if ($ok === false) return [0, '', ''];
    return [$status, $body, $type];
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') fail(405);

$code = (string)($_GET['code'] ?? '');
if (!preg_match('/^[a-zA-Z0-9_]{3,50}$/', $code)) fail(404);

[$status, $body] = fetchUrl($backend . '/api/public/handle/' . rawurlencode($code), 64 * 1024);
if ($status === 404) fail(404);
if ($status !== 200) fail(502);
$data = json_decode($body, true);
if (!is_array($data) || ($data['ok'] ?? false) !== true) fail(502);

$entity = $data['kind'] === 'channel' ? ($data['channel'] ?? null) : ($data['user'] ?? null);
if (!is_array($entity)) fail(502);
$avatar = is_string($entity['avatarUrl'] ?? null) ? $entity['avatarUrl'] : null;

if (isset($_GET['avatar'])) {
    if ($avatar === null) fail(404);
    // Только с хоста бэкенда - не открытый прокси.
    $backendHost = parse_url($backend, PHP_URL_HOST);
    if (parse_url($avatar, PHP_URL_HOST) !== $backendHost) fail(404);
    [$imgStatus, $img, $type] = fetchUrl($avatar, 10 * 1024 * 1024);
    if ($imgStatus !== 200 || !preg_match('#^image/(jpeg|png|webp|gif)#', $type)) fail(404);
    header('Content-Type: ' . $type);
    header('Cache-Control: public, max-age=300');
    header("Content-Security-Policy: default-src 'none'");
    echo $img;
    exit();
}

if ($avatar !== null) {
    $entity['avatarUrl'] = '/api/handle.php?code=' . rawurlencode($code) . '&avatar=1';
}
if ($data['kind'] === 'channel') $data['channel'] = $entity; else $data['user'] = $entity;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=60');
echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
