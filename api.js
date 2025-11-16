/* =====================================================
   API MODULE – centralizes all backend requests
===================================================== */

const API_BASE = "/api"; // adjust if your backend is on another domain

/* ==================== AUTH ==================== */
export async function login(email, password) {
    const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    return res.json();
}

export async function register(user) {
    const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    });
    return res.json();
}

export async function getProfile(token) {
    const res = await fetch(`${API_BASE}/me`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
}

/* ==================== COURSE PLANS ==================== */
export async function uploadCoursePlan(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/course-plans`, {
        method: "POST",
        body: formData
    });
    return res.json();
}

export async function fetchCoursePlans() {
    const res = await fetch(`${API_BASE}/course-plans`);
    return res.json();
}

export async function deleteCoursePlan(id) {
    const res = await fetch(`${API_BASE}/course-plans/${id}`, { method: "DELETE" });
    return res.json();
}

/* ==================== CHAT LOCK ==================== */
export async function setGlobalLock(state) {
    await fetch(`${API_BASE}/chat/lock/global`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state })
    });
}

export async function setSpecificLock(lockData) {
    await fetch(`${API_BASE}/chat/lock/specific`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lockData)
    });
}

export async function setAutoLock(threshold) {
    await fetch(`${API_BASE}/chat/auto-lock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threshold })
    });
}

/* ==================== WARNINGS ==================== */
export async function addWarning(student, message) {
    await fetch(`${API_BASE}/warnings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student, message })
    });
}

export async function fetchWarnings() {
    const res = await fetch(`${API_BASE}/warnings`);
    return res.json();
}

/* ==================== CHATBOT ==================== */
export async function askChatbot(prompt) {
    const res = await fetch(`${API_BASE}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    return data.answer || "No response from chatbot";
}

/* ==================== NOTICES ==================== */
export async function fetchNotices() {
    const res = await fetch(`${API_BASE}/notices`);
    return res.json();
}

export async function createNotice(payload) {
    const res = await fetch(`${API_BASE}/notices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return res.json();
}

export async function updateNotice(id, payload) {
    const res = await fetch(`${API_BASE}/notices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return res.json();
}

export async function deleteNotice(id) {
    const res = await fetch(`${API_BASE}/notices/${id}`, { method: "DELETE" });
    return res.json();
}

/* ==================== USERS ==================== */
export async function fetchUsers() {
    const res = await fetch(`${API_BASE}/users`);
    return res.json();
}

export async function searchUsers(query) {
    const users = await fetchUsers();
    return users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()));
}

/* ==================== BADGES ==================== */
export async function fetchBadges() {
    const res = await fetch(`${API_BASE}/badges`);
    return res.json();
}

export async function createBadge(payload) {
    const res = await fetch(`${API_BASE}/badges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return res.json();
}

export async function assignBadge(email, badgeId) {
    const res = await fetch(`${API_BASE}/badges/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, badgeId })
    });
    return res.json();
                            }
