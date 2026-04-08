const API = "http://localhost:8081/api";
const auth = { userId: localStorage.getItem('userId'), role: localStorage.getItem('role') };
const currentPage = window.location.pathname.split("/").pop() || "index.html";

// Helpers
const $ = id => document.getElementById(id);
const checkAuth = () => { if (!auth.userId) window.location.href = "index.html"; };
const nextPageForRole = () => "dashboard.html";
const goToNextPage = role => { window.location.href = nextPageForRole(role); };

// API Calls
const call = async (url, opts = {}) => {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opts });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
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
  if ($("user-role")) $("user-role").textContent = auth.role;

  if ($("logout-btn")) {
    $("logout-btn").onclick = () => {
      localStorage.clear();
      window.location.href = "index.html";
    };
  }

  const loadCourses = async () => {
    try {
      const courses = await call(`${API}/skills/all`);
      if ($("courses-list")) {
        $("courses-list").innerHTML = courses.map(c => `
          <div class="card">
            <h3>${c.skill}</h3>
            <p>Tutor: ${c.tutorName} | ⭐ ${Number(c.tutorRating).toFixed(1)}</p>
            <div class="row">
              ${auth.role === "STUDENT" && Number(c.tutorId) > 0 ? `<button onclick="window.location.href='booking.html?tutorId=${c.tutorId}&skill=${encodeURIComponent(c.skill)}'">Book</button>` : ""}
              ${auth.role === "TUTOR" && Number(c.tutorId) === Number(auth.userId) ? `<button onclick="deleteCourse(${c.id})">Delete</button>` : ""}
            </div>
          </div>
        `).join("");
      }
    } catch (err) {
      if ($("courses-list")) $("courses-list").innerHTML = "<p>Failed to load courses</p>";
    }
  };

  const loadMyCourses = async () => {
    if (auth.role !== "TUTOR" || !$("my-courses")) return;
    const mine = await call(`${API}/skills/tutor/${auth.userId}`);
    $("my-courses").innerHTML = mine.length ? mine.map(c => `
      <div class="row">
        <span>${c.skillName}</span>
        <button onclick="deleteCourse(${c.id})">Delete</button>
      </div>
    `).join("") : "<p>No courses yet</p>";
  };

  window.deleteCourse = async id => {
    await call(`${API}/skills/${id}?tutorId=${auth.userId}`, { method: "DELETE" });
    await loadCourses();
    await loadMyCourses();
  };

  if (auth.role === "TUTOR" && $("tutor-tools")) {
    $("tutor-tools").classList.remove("hidden");
    if ($("create-course-btn")) {
      $("create-course-btn").onclick = async () => {
        const skillName = $("course-name").value.trim();
        if (!skillName) return alert("Enter course name");
        await call(`${API}/skills/create`, { method: "POST", body: JSON.stringify({ skillName, tutorId: String(auth.userId) }) });
        $("course-name").value = "";
        await loadCourses();
        await loadMyCourses();
      };
    }
  }

  if ($("start-meet-btn")) {
    $("start-meet-btn").onclick = () => {
      const room = `kolher-${auth.role.toLowerCase()}-${auth.userId}-${Date.now()}`;
      const link = `https://meet.jit.si/${room}`;
      $("meet-link").href = link;
      $("meet-link").textContent = link;
      $("meet-link-wrap").classList.remove("hidden");
      window.open(link, "_blank");
    };
  }

  const loadMessages = async () => {
    if (!$("msg-list")) return;
    const msgs = await call(`${API}/messages`);
    $("msg-list").innerHTML = msgs.map(m => `
      <div class="msg-item">
        <div><strong>${m.senderRole}</strong> #${m.senderId}</div>
        <div>${m.content}</div>
        <div class="muted">${(m.createdAt || "").replace('T', ' ')}</div>
      </div>
    `).join("");
    $("msg-list").scrollTop = $("msg-list").scrollHeight;
  };

  if ($("send-msg-btn")) {
    $("send-msg-btn").onclick = async () => {
      const content = $("msg-input").value.trim();
      if (!content) return;
      await call(`${API}/messages`, {
        method: "POST",
        body: JSON.stringify({ senderId: String(auth.userId), senderRole: auth.role, content })
      });
      $("msg-input").value = "";
      await loadMessages();
    };
  }

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
  loadCourses();
  loadMyCourses();
  loadMessages();
  setInterval(loadCourses, 4000);
  setInterval(loadMessages, 4000);
  loadSessions();
}