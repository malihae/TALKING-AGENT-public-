const logEl = document.getElementById('log');
const textInput = document.getElementById('textInput');
const sendBtn = document.getElementById('sendBtn');
const btnF = document.getElementById('btnF');
const btnM = document.getElementById('btnM');
const agentName = document.getElementById('agentName');
const avatarIcon = document.getElementById('avatarIcon');

let persona = 'f';

// Fully separate state per persona: own message history AND own chat log
const STATE = {
  f: {
    name: 'Aria', icon: '🌸',
    system: 'You are Aria, a warm, playful, curious 20-year-old woman. Keep replies short, casual, friendly, like texting a close friend. No emoji spam, no long paragraphs.',
    history: [],
    log: [{ text: "Hey! I'm Aria 🌸 Type a message to start.", who: 'agent' }]
  },
  m: {
    name: 'Kai', icon: '⚡',
    system: 'You are Kai, a laid-back, witty, confident 20-year-old man. Keep replies short, casual, like texting a close friend. No emoji spam, no long paragraphs.',
    history: [],
    log: [{ text: "Yo, I'm Kai ⚡ Type something to start.", who: 'agent' }]
  }
};

function renderLog() {
  logEl.innerHTML = '';
  STATE[persona].log.forEach(m => {
    const d = document.createElement('div');
    d.className = 'msg ' + m.who;
    d.textContent = m.text;
    logEl.appendChild(d);
  });
  logEl.scrollTop = logEl.scrollHeight;
}

function pushMsg(text, who) {
  STATE[persona].log.push({ text, who });
  const d = document.createElement('div');
  d.className = 'msg ' + who;
  d.textContent = text;
  logEl.appendChild(d);
  logEl.scrollTop = logEl.scrollHeight;
}

btnF.onclick = () => setPersona('f');
btnM.onclick = () => setPersona('m');

function setPersona(g) {
  persona = g;
  document.body.classList.toggle('male', g === 'm');
  btnF.classList.toggle('active', g === 'f');
  btnM.classList.toggle('active', g === 'm');
  agentName.textContent = STATE[g].name;
  avatarIcon.textContent = STATE[g].icon;
  renderLog();
}
renderLog();

async function reply(userText) {
  const state = STATE[persona];
  state.history.push({ role: 'user', content: userText });

  const typingEl = document.createElement('div');
  typingEl.className = 'typing';
  typingEl.textContent = state.name + ' is typing...';
  logEl.appendChild(typingEl);
  logEl.scrollTop = logEl.scrollHeight;

  try {
    // Calls YOUR OWN backend, never Anthropic directly — see server/ and README.
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 300,
        system: state.system,
        messages: state.history
      })
    });
    const data = await response.json();
    const textBlock = (data.content || []).find(b => b.type === 'text');
    const text = textBlock ? textBlock.text : "...sorry, blank on that one.";
    typingEl.remove();
    pushMsg(text, 'agent');
    state.history.push({ role: 'assistant', content: text });
  } catch (err) {
    typingEl.remove();
    pushMsg('Connection hiccup — try again in a sec.', 'agent');
  }
}

function send() {
  const val = textInput.value.trim();
  if (!val) return;
  pushMsg(val, 'user');
  textInput.value = '';
  reply(val);
}
sendBtn.onclick = send;
textInput.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
