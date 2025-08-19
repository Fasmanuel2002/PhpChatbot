const message_input = document.querySelector("#message-input");
const message_list = document.querySelector("#chat-messages");
const send_btn = document.querySelector("#send-btn");

const context = [];

// Enviar con ENTER
message_input.addEventListener("keyup", function(e) {
  if (e.keyCode == 13 && !e.shiftKey) {
    sendMessage();
  }
});

// Enviar con botón
send_btn.addEventListener("click", function() {
  sendMessage();
});

function sendMessage() {
  const message = message_input.value.trim();
  if (!message) return;

  add_message("outgoing", message);
  message_input.value = "";

  const botMessageDiv = add_message("incoming", "●●●");
  let botMessage = "";

  // Conexión SSE → PHP → FastAPI
  const eventSource = new EventSource("/chatbotphp/message.php?message=" + encodeURIComponent(message));

  eventSource.onmessage = function(event) {
    botMessage += event.data;
    botMessageDiv.innerHTML = "<p>" + botMessage + "</p>";
    message_list.scrollTop = message_list.scrollHeight;
  };

  eventSource.addEventListener("stop", function() {
    eventSource.close();
    botMessageDiv.innerHTML = "<p>" + botMessage + "</p>";
  });
}

function add_message(direction, message) {
  const message_item = document.createElement("div");
  message_item.classList.add("chat-message");
  message_item.classList.add(direction + "-message");
  message_item.innerHTML = "<p>" + message + "</p>";
  message_list.appendChild(message_item);
  message_list.scrollTop = message_list.scrollHeight;
  return message_item;
}

function update_message(message, new_message) {
  message.innerHTML = "<p>" + new_message + "</p>";
  message_list.scrollTop = message_list.scrollHeight;
}
