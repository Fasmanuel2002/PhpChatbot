document.addEventListener("DOMContentLoaded", () => {
    const chatWindow = document.getElementById('chat-window');
    const input = document.getElementById('UserInput');
    const btn = document.getElementById('sendBtn');

    btn.addEventListener('click', async () => {
        const msg = input.value.trim();
        if (!msg) return;

        // Mostrar mensaje del usuario
        const userMsg = document.createElement('p');
        userMsg.style = "text-align: right; color: blue;";
        userMsg.textContent = `You: ${msg}`;
        chatWindow.appendChild(userMsg);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        input.value = '';


        //Aqui se conecta al enpoint y pide el application/Json
        const res = await fetch('/ChatBot/SendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserInput: msg })
        });

      

        if (res.ok) {
            const data = await res.json();
            const botMsg = document.createElement('p');
            botMsg.style = "text-align: left; color: green;";
            botMsg.textContent = `AzureBot: ${data.reply}`;
            chatWindow.appendChild(botMsg);
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    });
});