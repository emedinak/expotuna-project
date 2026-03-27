const toggle   = document.getElementById('chat-toggle');
const box      = document.getElementById('chat-box');
const close    = document.getElementById('chat-close');
const input    = document.getElementById('chat-input');
const send     = document.getElementById('chat-send');
const messages = document.getElementById('chat-messages');

let history = [];

toggle.addEventListener('click', () => box.classList.toggle('open'));
close.addEventListener('click',  () => box.classList.remove('open'));
input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg(); });
send.addEventListener('click', sendMsg);

async function sendMsg() {
    const text = input.value.trim();
    if (!text) return;
    input.value = '';

    addMsg(text, 'user');
    history.push({ role: 'user', content: text });

    const typing = addMsg('Typing...', 'bot typing');

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: history })
        });
        const data = await res.json();
        typing.remove();
        addMsg(data.reply, 'bot');
        history.push({ role: 'assistant', content: data.reply });
    } catch {
        typing.remove();
        addMsg('Something went wrong. Please try again.', 'bot');
    }
}

function addMsg(text, cls) {
    const div = document.createElement('div');
    div.className = 'msg ' + cls;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
}