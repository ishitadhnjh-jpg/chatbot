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

function getBotReply(userMsg) {
  // Inquisitive, question‑driven replies
  const lower = userMsg.toLowerCase();
  if (lower.includes('hello') || lower.includes('hi')) return "Hello! What would you like to talk about today?";
  if (lower.includes('how are you')) return "I'm just code, but I'm curious — how’s your day going?";
  if (lower.includes('joke')) return "Why did the developer go broke? Because they used up all their cache! 😄 Do you have a favorite joke?";
  if (lower.includes('thanks') || lower.includes('thank you')) return "You’re welcome! Is there anything else you’d like to discuss?";
  // Default fallback – ask a follow‑up question
  const genericQuestions = [
    "That’s interesting. What else is on your mind?",
    "Can you tell me more about that?",
    "How does that make you feel?",
    "What do you think will happen next?",
    "Why do you think that is?"
  ];
  return genericQuestions[Math.floor(Math.random() * genericQuestions.length)];
}

chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const userMsg = userInput.value.trim();
  if (!userMsg) return;
  const now = new Date();
  const timeStr = formatTime(now);
  // Render user message
  renderMessage('user', userMsg, timeStr);
  saveMessage('user', userMsg, timeStr);
  userInput.value = '';
  // Simulate bot typing delay
  setTimeout(() => {
    const botReply = getBotReply(userMsg);
    const botTime = formatTime(new Date());
    renderMessage('bot', botReply, botTime);
    saveMessage('bot', botReply, botTime);
  }, 600);
});

// Initialise
loadHistory();
