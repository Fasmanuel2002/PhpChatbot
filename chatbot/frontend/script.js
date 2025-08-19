const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const chat = document.getElementById('chat');

const context = [];

// Event listeners
sendBtn.addEventListener('click', function() {
    sendMessage();
});

userInput.addEventListener('keyup', function(e) {
    if (e.keyCode === 13) { // Enter key
        sendMessage();
    }
});

function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;
    
    // Mostrar mensaje del usuario
    addMessage('user', 'Usuario: ' + message);
    
    // Limpiar input y desactivar mientras procesa
    userInput.value = '';
    userInput.disabled = true;
    sendBtn.disabled = true;
    
    // Crear mensaje del bot con indicador de carga
    const botMessageDiv = addMessage('bot', 'Bot: <span id="typing-indicator">●●●</span>');
    
    let botMessage = '';
    let isFirstChunk = true;
    
    // Conectar con SSE
    const eventSource = new EventSource('message.php?message=' + encodeURIComponent(message));
    
    eventSource.onmessage = function(event) {
        if (isFirstChunk) {
            // Reemplazar el indicador de carga con el primer caracter
            botMessage = event.data;
            botMessageDiv.innerHTML = 'Bot: ' + botMessage + '<span class="cursor">|</span>';
            isFirstChunk = false;
        } else {
            // Agregar caracteres sucesivos
            botMessage += event.data;
            botMessageDiv.innerHTML = 'Bot: ' + botMessage + '<span class="cursor">|</span>';
        }
        scrollToBottom();
    };
    
    eventSource.addEventListener('stop', function(event) {
        eventSource.close();
        // Quitar cursor y finalizar
        botMessageDiv.innerHTML = 'Bot: ' + botMessage;
        context.push([message, botMessage]);
        
        // Reactivar controles
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus();
        scrollToBottom();
    });
    
    eventSource.addEventListener('error', function(event) {
        eventSource.close();
        botMessageDiv.innerHTML = 'Bot: ❌ Error: ' + (event.data || 'Error de conexión');
        
        // Reactivar controles
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus();
        scrollToBottom();
    });
    
    eventSource.onerror = function(event) {
        console.error('EventSource failed:', event);
        eventSource.close();
        botMessageDiv.innerHTML = 'Bot: ❌ Error de conexión con el servidor';
        
        // Reactivar controles
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus();
        scrollToBottom();
    };
}

function addMessage(type, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = type;
    messageDiv.innerHTML = message;
    chat.appendChild(messageDiv);
    scrollToBottom();
    return messageDiv;
}

function scrollToBottom() {
    chat.scrollTop = chat.scrollHeight;
}

// Función adicional para limpiar chat (opcional)
function clearChat() {
    chat.innerHTML = '';
    context.length = 0;
}

// Agregar estilos CSS dinámicamente para mejorar la apariencia
const style = document.createElement('style');
style.textContent = `
    #typing-indicator {
        animation: pulse 1.5s infinite;
        color: #888;
        font-weight: bold;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 1; }
    }
    
    .cursor {
        animation: blink 1s infinite;
        font-weight: bold;
    }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
    
    input:disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
    }
    
    button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
    
    .bot {
        word-wrap: break-word;
    }
    
    .user {
        word-wrap: break-word;
    }
`;
document.head.appendChild(style);