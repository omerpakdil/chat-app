const socket = io.connect('http://localhost:3000');

const sender = document.getElementById('sender');
const message = document.getElementById('message');
const btn = document.getElementById('send');
const output = document.getElementById('output');
const feedback = document.getElementById('feedback');

// Store username in localStorage
if (localStorage.getItem('username')) {
    sender.value = localStorage.getItem('username');
}

btn.addEventListener('click', sendMessage);
message.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    } else {
        socket.emit('typing', sender.value);
    }
});

function sendMessage() {
    if (message.value && sender.value) {
        socket.emit('chat', {
            message: message.value,
            sender: sender.value
        });
        localStorage.setItem('username', sender.value);
        message.value = '';
    }
}

socket.on('chat', (data) => {
    feedback.innerHTML = '';
    output.innerHTML += `
        <div class="message ${data.sender === sender.value ? 'own-message' : ''}">
            <strong>${data.sender}</strong>
            <p>${data.message}</p>
        </div>
    `;
    output.scrollTop = output.scrollHeight;
});

socket.on('typing', (data) => {
    feedback.innerHTML = `<p><em>${data} is typing...</em></p>`;
});

// Auto focus
window.onload = () => {
    if (!sender.value) {
        sender.focus();
    } else {
        message.focus();
    }
};

// Add to the end of existing code

socket.on('userCount', (count) => {
    console.log('Number of connected users:', count);
    document.getElementById('userCount').textContent = `Online: ${count}`;
});