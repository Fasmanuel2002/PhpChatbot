<?php
set_time_limit(0);
header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");
header("Connection: keep-alive");
header("Access-Control-Allow-Origin: *");
ob_implicit_flush(true);


$userMessage = isset($_GET['message']) ? $_GET['message'] : "";
if (!$userMessage) {
    echo "event: error\n";
    echo "data: No se recibió mensaje del usuario.\n\n";
    echo "event: stop\n";
    echo "data: [END]\n\n";
    exit;
}


$fastapi_url = "http://127.0.0.1:9000/chatAzureOpenAI";


$data = json_encode(["user_input" => $userMessage]);

// cURL para POST a FastAPI
$ch = curl_init($fastapi_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$response = curl_exec($ch);

if($response === false) {
    $error = curl_error($ch);
    echo "event: error\n";
    echo "data: Error en cURL: $error\n\n";
    echo "event: stop\n";
    echo "data: [END]\n\n";
    curl_close($ch);
    exit;
}

curl_close($ch);


$result = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo "event: error\n";
    echo "data: Error al decodificar JSON\n\n";
    echo "event: stop\n";
    echo "data: [END]\n\n";
    exit;
}

$botMessage = isset($result['response']) ? $result['response'] : "Error: no hay respuesta";


$words = explode(' ', $botMessage);
$wordCount = count($words);

foreach (str_split($botMessage) as $letter) {
    echo "event: message\n";
    echo "data: $letter\n\n";  
    flush();                   
    usleep(100 * 100);         
}


echo "event: stop\n";
echo "data: [END]\n\n";
flush();
?>