<?php
$apiKey = "TU_API_KEY";
$deployment = "gpt-4o";
$apiVersion = "2025-01-01-preview";
$endpoint = "https://test-openai-mcp.openai.azure.com/openai/deployments/$deployment/chat/completions?api-version=$apiVersion";

header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');

$userMessage = $_GET['message'] ?? "Hola";

$data = [
    "messages" => [
        ["role" => "system", "content" => "You are a helpful assistant."],
        ["role" => "user", "content" => $userMessage]
    ],
    "max_tokens" => 200,
    "temperature" => 0.7,
    "stream" => true
];

$ch = curl_init($endpoint);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "api-key: $apiKey"
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_WRITEFUNCTION, function($ch, $data) {
    $lines = explode("\n", $data);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === "" || strpos($line, "data:") !== 0) continue;

        $payload = substr($line, 5); // quitar "data:"
        if ($payload === "[DONE]") {
            echo "event: stop\n";
            echo "data: \n\n";
            ob_flush();
            flush();
            return strlen($data);
        }

        $json = json_decode($payload, true);
        if (isset($json['choices'][0]['delta']['content'])) {
            $chunk = $json['choices'][0]['delta']['content'];
            echo "data: " . $chunk . "\n\n";
            ob_flush();
            flush();
        }
    }
    return strlen($data);
});
curl_exec($ch);
curl_close($ch);
