const API = "http://localhost:8081/api";
const auth = { userId: localStorage.getItem('userId'), role: localStorage.getItem('role') };
const currentPage = window.location.pathname.split("/").pop() || "index.html";

// Helpers
const $ = id => document.getElementById(id);
const checkAuth = () => { if (!auth.userId) window.location.href = "index.html"; };
const nextPageForRole = role => role === "TUTOR" ? "dashboard.html" : "catalog.html";
const goToNextPage = role => { window.location.href = nextPageForRole(role); };

// API Calls
const call = async (url, opts = {}) => {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opts });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

// Auth Page Logic
if (currentPage === "index.html" || currentPage === "") {
  // If already authenticated, skip auth page.
  if (auth.userId && auth.role) goToNextPage(auth.role);

  const loginForm = $("login-form");
  const registerForm = $("register-form");
  const toggleAuthBtn = $("toggle-auth");

  if (loginForm) loginForm.onsubmit = async e => {
    e.preventDefault();
    try {
      const data = await call(`${API}/users/login`, { method: "POST", body: JSON.stringify({ username: $("l-user").value, password: $("l-pass").value }) });
      localStorage.setItem("userId", data.userId); localStorage.setItem("role", data.role);
      goToNextPage(data.role);
    } catch(err) { alert("Login failed"); }
  };

  if (registerForm) registerForm.onsubmit = async e => {
    e.preventDefault();
    try {
      const role = $("r-role").value;
      const body = { username: $("r-user").value, password: $("r-pass").value, role, skillsOffered: role === "TUTOR" ? $("r-skills").value : "" };
      await call(`${API}/users/register`, { method: "POST", body: JSON.stringify(body) });
      // Auto-login after registration
      const data = await call(`${API}/users/login`, { method: "POST", body: JSON.stringify({ username: $("r-user").value, password: $("r-pass").value }) });
      localStorage.setItem("userId", data.userId); localStorage.setItem("role", data.role);
      goToNextPage(data.role);
    } catch(err) { alert("Registration failed: " + err.message); }
  };

  if (toggleAuthBtn) toggleAuthBtn.onclick = () => {
    loginForm.classList.toggle("hidden");
    registerForm.classList.toggle("hidden");
    toggleAuthBtn.textContent = loginForm.classList.contains("hidden") ? "Already have an account? Login" : "Don't have an account? Register";
  };
}

// Catalog Page
if (currentPage === "catalog.html") {
  $("search-btn").onclick = async () => {
    const q = $("search-input").value;
    const results = await call(`${API}/skills/search?q=${encodeURIComponent(q)}`);
    $("catalog-list").innerHTML = results.map(r => `
      <div class="card">
        <h3>${r.skill}</h3><p>Tutor: ${r.tutorName} | ⭐ ${r.tutorRating}</p>
        <button onclick="window.location.href='booking.html?tutorId=${r.tutorId}&skill=${encodeURIComponent(r.skill)}'">Book Session</button>
      </div>`).join("");
  };
}

// Booking Page
if (currentPage === "booking.html") {
  checkAuth();
  const params = new URLSearchParams(window.location.search);
  const tutorId = params.get("tutorId");
  $("book-btn").onclick = async () => {
    const body = { studentId: auth.userId, tutorId, dateTime: $("session-date").value, status: "PENDING" };
    const sess = await call(`${API}/sessions/book`, { method: "POST", body: JSON.stringify(body) });
    alert(`Session booked! Meeting Link: ${sess.meetingLink}`);
    window.location.href = "dashboard.html";
  };
}

// Dashboard
if (currentPage === "dashboard.html") {
  checkAuth();
  const loadSessions = async () => {
    const sessions = await call(`${API}/sessions/user/${auth.userId}`);
    $("sessions-list").innerHTML = sessions.map(s => `
      <div class="card">
        <h4>${s.status} Session</h4>
        <p>Date: ${s.dateTime.replace('T', ' ')}</p>
        <p>Meeting: <a href="${s.meetingLink}" target="_blank">${s.meetingLink}</a></p>
        ${s.status === "PENDING" && auth.role === "TUTOR" ? `<button onclick="updateStatus(${s.id}, 'ACCEPTED')">Accept</button><button onclick="updateStatus(${s.id}, 'REJECTED')">Reject</button>` : ""}
        ${s.status === "COMPLETED" ? `<input placeholder="Rating (1-5)" id="fb-${s.id}"><button onclick="submitFeedback(${s.id})">Leave Feedback</button>` : ""}
      </div>`).join("");
  };
  window.updateStatus = async (id, status) => await call(`${API}/sessions/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }).then(loadSessions);
  window.submitFeedback = async (id) => {
    const rating = parseInt($(`fb-${id}`).value);
    if(rating < 1 || rating > 5) return alert("Rating must be 1-5");
    await call(`${API}/feedback/submit`, { method: "POST", body: JSON.stringify({ sessionId: id, studentId: auth.userId, rating, comments: "Great session!" }) });
    alert("Feedback submitted!"); loadSessions();
  };
  loadSessions();
}