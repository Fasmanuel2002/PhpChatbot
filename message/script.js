const message_input = document.querySelector("#message-input");
const message_list = document.querySelector("#chat-messages");

const context = [];

message_input.addEventListener("keyup", function(e) {
    if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault();
        add_message("outgoing", message_input.value);
        send_message();
    }
});

function send_message() {
    let question = message_input.value;
    let message = add_message("incoming", '<div id="cursor"></div>');
    message_input.value = "";

    // Abrir conexión SSE hacia PHP
    const evtSource = new EventSource("message.php?message=" + encodeURIComponent(question));

    let botMessage = "";

    evtSource.onmessage = function(event) {
        botMessage += event.data;
        message.innerHTML = "<p>" + botMessage + "</p>";
        message_list.scrollTop = message_list.scrollHeight;
    };

    evtSource.addEventListener("stop", function() {
        evtSource.close();
        context.push([question, botMessage]);
        message_input.focus();
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
