// ==================== CONFIG ====================
const API_URL = "https://smart-chatbot-backend-w5tq.onrender.com";
let TOKEN = ""; // Set after login
let csrfToken = "";

// Block execution if TOKEN is missing
function ensureToken() {
  if (!TOKEN) {
    alert("Security Error: No access token found. Please log in again.");
    window.location.href = "index.html";
    throw new Error("TOKEN missing");
  }
}
ensureToken();

// ==================== DOM ELEMENTS ====================
const profileSection = document.getElementById("profileSection");
const chatSection = document.getElementById("chatSection");
const chatBox = document.getElementById("chatBox");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const profileBtn = document.getElementById("profileBtn");
const statusMsg = document.getElementById("statusMsg");
const bgColorInput = document.getElementById("bgColorInput");
const studentInfoDiv = document.getElementById("studentInfo");

// ==================== STATE ====================
let studentProfile = null;
let chatLock = false;
let warningsCount = 0;

// ==================== INIT ====================
window.onload = async () => {
  await loadProfileFromServer();
  await applyBackgroundColorFromServer();
  await loadChatHistoryFromServer();
  await fetchWarningsAndLock();
};

// ==================== SECURE FETCH ====================
async function secureFetch(url, options = {}) {
  ensureToken();

  if (!csrfToken) {
    const r = await fetch(`${API_URL}/csrf-token`, { method: "GET", credentials: "include" });
    const d = await r.json();
    csrfToken = d.csrfToken;
  }

  const opts = {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers || {}),
      "Authorization": `Bearer ${TOKEN}`,
      "x-csrf-token": csrfToken,
    },
  };

  const res = await fetch(url, opts);

  if (res.status === 401) {
    alert("Session expired. Please login again.");
    window.location.href = "index.html";
    return;
  }

  return res;
}

// ==================== PROFILE ====================
async function loadProfileFromServer() {
  try {
    const res = await secureFetch(`${API_URL}/api/me`);
    if (!res.ok) throw new Error("Missing profile");
    studentProfile = await res.json();

    profileSection.style.display = "none";
    chatSection.style.display = "flex";
    statusMsg.textContent = "";

    displayStudentInfo();
  } catch {
    profileSection.style.display = "flex";
    chatSection.style.display = "none";
    statusMsg.textContent = "Please complete your profile!";
  }
}

profileBtn?.addEventListener("click", async () => {
  const name = document.getElementById("studentName").value.trim();
  const roll = document.getElementById("studentRoll").value.trim();
  const dept = document.getElementById("studentDept").value;
  const cls = document.getElementById("studentClass").value;

  if (!name || !roll || !dept || !cls) return alert("All fields required!");

  const profile = { name, roll, dept, cls };
  await secureFetch(`${API_URL}/api/me`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });

  studentProfile = profile;
  profileSection.style.display = "none";
  chatSection.style.display = "flex";
  displayStudentInfo();
});

// ==================== DISPLAY INFO ====================
function displayStudentInfo() {
  if (!studentProfile) return;

  studentInfoDiv.innerHTML = `
    <strong>${studentProfile.name}</strong> |
    Roll: ${studentProfile.roll} |
    Dept: ${studentProfile.dept} |
    Class: ${studentProfile.cls}
  `;
}

// ==================== CHAT ====================
sendBtn?.addEventListener("click", async () => {
  const message = chatInput.value.trim();
  if (!message) return;

  if (chatLock || await checkChatLock()) {
    return alert("⚠️ Chat is locked due to repeated violations.");
  }

  await addMessage("user", message);
  chatInput.value = "";

  if (!isValidSyllabusQuery(message)) {
    await registerWarning();
    await addMessage("bot", "⚠️ Only syllabus-related questions are allowed.");
    return;
  }

  const response = await askGemini(message);
  await addMessage("bot", response);
});

// Add message to chatbox and server
async function addMessage(sender, text, time = null) {
  time = time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const div = document.createElement("div");
  div.className = `message ${sender === "user" ? "userMsg" : "botMsg"}`;
  div.innerHTML = `<strong>[${sender === "user" ? "You" : "Bot"} - ${time}]</strong>: ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;

  // Only send user messages to server
  if (sender === "user") {
    await secureFetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roll: studentProfile.roll,
        sender: "user",
        message: text,
        useGemini: true
      }),
    });
  }
}

// ==================== CHAT HISTORY ====================
async function loadChatHistoryFromServer() {
  try {
    const res = await secureFetch(`${API_URL}/api/chat/${studentProfile.roll}`);
    if (!res.ok) return;

    const history = await res.json();
    history.reverse().forEach(m => addMessage(m.sender, m.message, m.time));
  } catch (err) {
    console.error("Load chat history failed:", err);
  }
}

// ==================== SYLLABUS CHECK ====================
function isValidSyllabusQuery(text) {
  const allowed = ["course", "syllabus", "unit", "module", "subject"];
  text = text.toLowerCase();
  return allowed.some(k => text.includes(k));
}

// ==================== WARNINGS & LOCK ====================
async function fetchWarningsAndLock() {
  try {
    const res = await secureFetch(`${API_URL}/api/dashboard/status`);
    if (!res.ok) return;

    const data = await res.json();
    warningsCount = data.warnings?.length || 0;
    chatLock = !!data.activeLock;

    displayWarningsCount();
  } catch (err) {
    console.error("Fetch warnings/lock failed:", err);
  }
}

async function registerWarning() {
  try {
    const res = await secureFetch(`${API_URL}/api/warning`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roll: studentProfile.roll, reason: "Syllabus violation" })
    });
    if (!res.ok) return;

    const data = await res.json();
    warningsCount = data.warning ? data.warning.length : warningsCount + 1;
    chatLock = !!data.warning?.locked;

    displayWarningsCount();
  } catch (err) {
    console.error("Register warning failed:", err);
  }
}

function displayWarningsCount() {
  statusMsg.textContent = warningsCount ? `⚠️ Warnings: ${warningsCount}` : "";
}

async function checkChatLock() {
  await fetchWarningsAndLock();
  return chatLock;
}

// ==================== CHATBOT REQUEST ====================
async function askGemini(prompt) {
  try {
    const res = await secureFetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roll: studentProfile.roll, sender: "user", message: prompt, useGemini: true })
    });

    if (!res.ok) {
      const err = await res.json();
      return err.error || "Server error";
    }

    const data = await res.json();
    return data.assistantReply || data.answer || "No response from AI.";
  } catch (err) {
    console.error("Chat error:", err);
    return "Error contacting chatbot server.";
  }
}

// ==================== BACKGROUND SETTINGS ====================
async function applyBackgroundColorFromServer() {
  try {
    const res = await secureFetch(`${API_URL}/api/me`);
    if (!res.ok) return;

    const profile = await res.json();
    const bg = profile.bgColor || "linear-gradient(135deg, #0077ff, #00d4ff)";
    document.body.style.background = bg;
  } catch (err) {
    console.error("Apply background failed:", err);
  }
}

bgColorInput?.addEventListener("change", async (e) => {
  const bg = e.target.value;
  await secureFetch(`${API_URL}/api/bgcolor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roll: studentProfile.roll, bgColor: bg })
  });
  document.body.style.background = bg;
});
