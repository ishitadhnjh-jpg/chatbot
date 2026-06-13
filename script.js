/* script.js */
// FriendBot – powered by Claude AI (claude-sonnet-4-6)

const API_KEY = "YOUR_ANTHROPIC_API_KEY"; // 🔑 Replace with your key from console.anthropic.com
const API_URL = "https://api.anthropic.com/v1/messages";

const SYSTEM_PROMPT = `You are FriendBot, a super friendly, warm, and fun AI best friend.
Talk casually like a close human friend — use informal language, contractions, slang, and emojis sometimes.
Keep replies short and conversational (2-4 sentences max), like a real chat.
Be supportive, funny when appropriate, and always make the person feel heard and good about themselves.
Never sound robotic, formal, or like an assistant. Be real, relatable, and fun!`;

const chatWindow = document.getElementById('chat-window');
const chatForm   = document.getElementById('chat-form');
const userInput  = document.getElementById('user-input');

// In-memory conversation history for context
let conversationHistory = [];

// Helper: format time as HH:MM
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Render a message bubble
function renderMessage(role, text, time) {
  const el = document.createElement('div');
  el.classList.add('message', role === 'user' ? 'user' : 'bot');
  el.textContent = text;
  el.dataset.time = time;
  chatWindow.appendChild(el);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Show animated typing indicator
function showTyping() {
  const el = document.createElement('div');
  el.classList.add('message', 'bot', 'typing');
  el.id = 'typing-indicator';
  el.innerHTML = '<span></span><span></span><span></span>';
  chatWindow.appendChild(el);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

// Call Claude API
async function getBotReply(userMsg) {
  conversationHistory.push({ role: 'user', content: userMsg });

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: conversationHistory
    })
  });

  const data = await res.json();
  const reply = data.content?.[0]?.text || "Oops, my brain glitched 😅 Say that again?";
  conversationHistory.push({ role: 'assistant', content: reply });
  return reply;
}

// Handle form submit
chatForm.addEventListener('submit', async e => {
  e.preventDefault();
  const userMsg = userInput.value.trim();
  if (!userMsg) return;

  const timeStr = formatTime(new Date());
  renderMessage('user', userMsg, timeStr);
  userInput.value = '';
  userInput.disabled = true;

  showTyping();

  try {
    const reply = await getBotReply(userMsg);
    removeTyping();
    renderMessage('bot', reply, formatTime(new Date()));
  } catch (err) {
    removeTyping();
    renderMessage('bot', "Ugh, something broke on my end 😬 Try again!", formatTime(new Date()));
    console.error(err);
  }

  userInput.disabled = false;
  userInput.focus();
});

// Greeting on load
window.addEventListener('load', () => {
  renderMessage('bot', "Hey hey! 👋 I'm FriendBot, your AI bestie! What's on your mind?", formatTime(new Date()));
});
