/* script.js */
// Friendly chatbot front‑end logic
// This is a placeholder reply engine that mimics a human‑like conversation.
// Later you can replace `getBotReply` with an API call to a real LLM.

const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

// Load saved conversation from localStorage (if any)
function loadHistory() {
  const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
  history.forEach(msg => renderMessage(msg.role, msg.text, msg.time));
}

// Save a single message to localStorage
function saveMessage(role, text, time) {
  const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
  history.push({ role, text, time });
  localStorage.setItem('chatHistory', JSON.stringify(history));
}

// Helper to format time as HH:MM
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function renderMessage(role, text, time) {
  const messageEl = document.createElement('div');
  messageEl.classList.add('message', role);
  messageEl.textContent = text;
  messageEl.dataset.time = time;
  chatWindow.appendChild(messageEl);
  // Auto‑scroll to newest message
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function fetchReply(message, history) {
  // Send chat history (including the new user message) to the backend proxy
  const payload = {
    messages: [...history, { role: 'user', content: message }]
  };
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    // Depending on API shape, extract content
    return data.content || data.message?.content || '';
  } catch (err) {
    console.error('Error fetching reply:', err);
    return "Oops, I couldn’t think of a reply right now. Try again later.";
  }
}

chatForm.addEventListener('submit', async e => {
  e.preventDefault();
  const userMsg = userInput.value.trim();
  if (!userMsg) return;
  const now = new Date();
  const timeStr = formatTime(now);
  // Render user message
  renderMessage('user', userMsg, timeStr);
  saveMessage('user', userMsg, timeStr);
  userInput.value = '';
  // Show loading indicator
  const loadingEl = document.createElement('div');
  loadingEl.classList.add('message', 'bot', 'loading');
  loadingEl.textContent = '…';
  chatWindow.appendChild(loadingEl);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  // Gather history for context
  const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
  const botReply = await fetchReply(userMsg, history);
  // Remove loading
  loadingEl.remove();
  const botTime = formatTime(new Date());
  renderMessage('bot', botReply, botTime);
  saveMessage('bot', botReply, botTime);
});

// Initialise
loadHistory();
