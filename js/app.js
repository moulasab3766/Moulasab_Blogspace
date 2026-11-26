(() => {
  "use strict";

  const API_BASE = "http://localhost:5000/api";
  const SESSION_KEY = "blogspace_session_v2";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const getSession = () => {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); }
    catch { return null; }
  };
  const saveSession = data => sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  const clearSession = () => sessionStorage.removeItem(SESSION_KEY);
  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  async function api(path, options = {}) {
    const session = getSession();
    const headers = { ...(options.headers || {}) };
    if (options.body) headers["Content-Type"] = "application/json";
    if (session?.token) headers.Authorization = `Bearer ${session.token}`;

    let response;
    try {
      response = await fetch(`${API_BASE}${path}`, { ...options, headers });
    } catch {
      throw new Error("Cannot reach the BlogSpace API. Start the backend and check port 5000.");
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401) clearSession();
      const error = new Error(data.message || "Something went wrong. Please try again.");
      error.status = response.status;
      throw error;
    }
    return data;
  }

  function showMessage(form, message) {
    const target = $(".form-message", form);
    if (target) target.textContent = message;
  }

  function logout() {
    clearSession();
    location.replace("index.html");
  }

  function updateNavigation() {
    const loggedIn = !!getSession()?.token;
    $$("[data-logout]").forEach(link => {
      link.hidden = !loggedIn;
      link.onclick = event => { event.preventDefault(); logout(); };
    });
    $$("[data-guest-link]").forEach(link => link.hidden = loggedIn);
    $$("[data-auth-link]").forEach(link => link.hidden = !loggedIn);
    $$("[data-year]").forEach(item => item.textContent = new Date().getFullYear());
    $$(".menu-toggle").forEach(button => {
      button.onclick = () => $(".nav-links")?.classList.toggle("nav-open");
    });
  }

  function requireLogin() {
    if (!getSession()?.token) {
      location.replace("login.html");
      return false;
    }
    return true;
  }

  async function verifySession() {
    if (!requireLogin()) return null;
    try {
      const result = await api("/auth/me");
      const current = getSession();
      if (!current?.token) return null;
      saveSession({ token: current.token, user: result.user });
      return result.user;
    } catch {
      clearSession();
      location.replace("login.html");
      return null;
    }
  }

  function authorName(blog) {
    return typeof blog.author === "object" ? blog.author?.name || "BlogSpace writer" : "BlogSpace writer";
  }

  async function setupHome() {
    const grid = $("#post-grid");
    if (!grid) return;
    let allBlogs = [];
    let activeCategory = "All";
    const render = () => {
      const search = ($("#search-input")?.value || "").trim().toLowerCase();
      const visible = allBlogs.filter(blog =>
        (activeCategory === "All" || blog.category === activeCategory) &&
        [blog.title, blog.excerpt, authorName(blog), blog.category].join(" ").toLowerCase().includes(search)
      );
      grid.innerHTML = visible.map(blog => `
        <article class="post-card">
          <div class="post-visual">${escapeHTML(blog.category)}</div>
          <div class="post-content">
            <div class="post-meta">${escapeHTML(blog.readTime || "5 min read")} · ${new Date(blog.createdAt).toLocaleDateString()}</div>
            <h3>${escapeHTML(blog.title)}</h3><p>${escapeHTML(blog.excerpt)}</p>
            <small>BY ${escapeHTML(authorName(blog))}</small>
          </div>
        </article>`).join("");
      const empty = $("#empty-state");
      if (empty) empty.hidden = visible.length > 0;
    };
    $("#search-input")?.addEventListener("input", render);
    $$("[data-category]").forEach(button => button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      $$("[data-category]").forEach(item => item.classList.toggle("selected", item === button));
      render();
    }));
    try {
      const result = await api("/blogs");
      allBlogs = result.blogs || [];
      render();
    } catch (error) {
      grid.innerHTML = "";
      const empty = $("#empty-state");
      if (empty) { empty.hidden = false; empty.textContent = error.message; }
    }
  }

  function setupRegister() {
    const form = $("#register-form");
    if (!form) return;
    form.addEventListener("submit", async event => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim().toLowerCase();
      const password = String(data.get("password") || "");
      const confirmPassword = String(data.get("confirmPassword") || "");
      if (name.length < 2) return showMessage(form, "Your name must contain at least 2 characters.");
      if (password.length < 8) return showMessage(form, "Use a password with at least 8 characters.");
      if (password !== confirmPassword) return showMessage(form, "Your passwords do not match.");
      const button = $('button[type="submit"]', form);
      button.disabled = true;
      try {
        const result = await api("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) });
        saveSession({ token: result.token, user: result.user });
        location.href = "dashboard.html";
      } catch (error) { showMessage(form, error.message); }
      finally { button.disabled = false; }
    });
  }

  function setupLogin() {
    const form = $("#login-form");
    if (!form) return;
    form.addEventListener("submit", async event => {
      event.preventDefault();
      const data = new FormData(form);
      const email = String(data.get("email") || "").trim().toLowerCase();
      const password = String(data.get("password") || "");
      const button = $('button[type="submit"]', form);
      button.disabled = true;
      try {
        const result = await api("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
        saveSession({ token: result.token, user: result.user });
        location.href = "dashboard.html";
      } catch (error) { showMessage(form, error.message); }
      finally { button.disabled = false; }
    });
  }

  async function setupDashboard() {
    const list = $("#my-posts");
    if (!list || !requireLogin()) return;

    // Verify the JWT with the API before showing private dashboard data.
    const me = await verifySession();
    if (!me) return;
    const name = $("#dashboard-name");
    if (name) name.textContent = me.name;
    const email = $("#profile-email");
    if (email) email.textContent = me.email;
    const profileName = $("#profile-name");
    if (profileName) profileName.textContent = me.name;
    const logoutButton = $("[data-logout-button]");
    if (logoutButton) logoutButton.addEventListener("click", logout);

    try {
      // The server filters by the authenticated user ID; no client-side filtering of all users' blogs.
      const result = await api("/blogs/mine");
      const mine = result.blogs || [];
      $("#stat-total").textContent = mine.length;
      $("#stat-published").textContent = mine.length;
      $("#stat-categories").textContent = new Set(mine.map(blog => blog.category)).size;
      $("#dashboard-empty").hidden = mine.length > 0;
      list.innerHTML = mine.map(blog => `
        <article class="manage-card">
          <div><small>${escapeHTML(blog.category)}</small><h3>${escapeHTML(blog.title)}</h3>
          <small>${new Date(blog.createdAt).toLocaleDateString()}</small></div>
          <div class="manage-actions">
            <a href="create-blog.html?edit=${encodeURIComponent(blog._id)}">Edit</a>
            <button class="danger" data-delete="${escapeHTML(blog._id)}">Delete</button>
          </div>
        </article>`).join("");
      $$("[data-delete]", list).forEach(button => button.addEventListener("click", async () => {
        if (!confirm("Delete this story permanently?")) return;
        button.disabled = true;
        try {
          await api(`/blogs/${encodeURIComponent(button.dataset.delete)}`, { method: "DELETE" });
          location.reload();
        } catch (error) { alert(error.message); button.disabled = false; }
      }));
    } catch (error) {
      list.textContent = error.message;
      $("#dashboard-empty").hidden = true;
    }
  }

  async function setupPostEditor() {
    const form = $("#post-form");
    if (!form || !requireLogin()) return;
    const me = await verifySession();
    if (!me) return;
    const editId = new URLSearchParams(location.search).get("edit");
    let existingBlog = null;
    if (editId) {
      try {
        const result = await api(`/blogs/${encodeURIComponent(editId)}`);
        existingBlog = result.blog;
        const authorId = typeof existingBlog.author === "object" ? existingBlog.author?._id : existingBlog.author;
        if (authorId !== me.id) { location.replace("dashboard.html"); return; }
        $("#editor-heading").textContent = "Edit your story.";
        for (const field of ["title", "category", "readTime", "excerpt", "content"]) {
          if (form.elements[field]) form.elements[field].value = existingBlog[field] || "";
        }
        form.querySelector('button[type="submit"]').textContent = "Save changes";
      } catch (error) { showMessage(form, error.message); return; }
    }
    form.addEventListener("submit", async event => {
      event.preventDefault();
      const data = new FormData(form);
      const blog = {
        title: String(data.get("title") || "").trim(),
        category: String(data.get("category") || ""),
        readTime: String(data.get("readTime") || "5 min read"),
        excerpt: String(data.get("excerpt") || "").trim(),
        content: String(data.get("content") || "").trim()
      };
      if (blog.title.length < 3 || blog.excerpt.length < 15 || blog.content.length < 20 || !blog.category) {
        return showMessage(form, "Add a title, category, summary (15+ characters) and story (20+ characters).");
      }
      const button = $('button[type="submit"]', form);
      button.disabled = true;
      try {
        const path = existingBlog ? `/blogs/${encodeURIComponent(existingBlog._id)}` : "/blogs";
        await api(path, { method: existingBlog ? "PUT" : "POST", body: JSON.stringify(blog) });
        location.href = "dashboard.html";
      } catch (error) { showMessage(form, error.message); }
      finally { button.disabled = false; }
    });
  }

  updateNavigation();
  setupHome();
  setupRegister();
  setupLogin();
  setupDashboard();
  setupPostEditor();
})();
