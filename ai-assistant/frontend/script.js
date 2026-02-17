const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");

// Use a user icon SVG for the user avatar
const userAvatar = "https://cdn-icons-png.flaticon.com/512/1077/1077012.png"; // User icon
const aiAvatar = "https://cdn-icons-png.flaticon.com/512/4712/4712035.png"; // AI avatar icon

function playSendSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.value = 520;
    g.gain.value = 0.07;
    o.connect(g); g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.09);
    o.onended = () => ctx.close();
  } catch {}
}

function appendMessageRow(type, text, isTyping = false) {
  const row = document.createElement("div");
  row.className = `message-row${type === "user" ? " user" : " ai"}`;

  const avatar = document.createElement("img");
  avatar.className = "avatar";
  avatar.src = type === "user" ? userAvatar : aiAvatar;
  avatar.alt = type === "user" ? "User" : "AI";

  const msg = document.createElement("div");
  msg.className = `message ${type}${isTyping ? " typing" : ""}`;
  msg.innerText = text;
  msg.style.opacity = 0;

  if (type === "user") {
    row.appendChild(msg);
    row.appendChild(avatar);
  } else {
    row.appendChild(avatar);
    row.appendChild(msg);
  }

  chatBox.appendChild(row);
  setTimeout(() => { msg.style.transition = 'opacity 0.5s'; msg.style.opacity = 1; }, 30);
  chatBox.scrollTop = chatBox.scrollHeight;
  return row;
}

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  // Show user's message with avatar
  appendMessageRow("user", message);
  input.value = "";
  playSendSound();

  // Show typing indicator with AI avatar
  const typingRow = appendMessageRow("ai", "AI is typing...", true);

  // Send to backend
  try {
    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data = await res.json();

    // Remove typing indicator
    typingRow.remove();

    // Show AI response with avatar
    appendMessageRow("ai", data.response);
  } catch (e) {
    typingRow.remove();
    appendMessageRow("ai", "Sorry, I couldn't connect to the server.");
  }
}

input.addEventListener("keydown", function(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

