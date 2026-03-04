import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

/* ═══════════════════════════════════════
   SUPABASE + CLOUDINARY CONFIG
═══════════════════════════════════════ */

const SUPABASE_URL  = "https://czaztxqhkqwoviazqaeu.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6YXp0eHFoa3F3b3ZpYXpxYWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NDEyNjgsImV4cCI6MjA4ODIxNzI2OH0.2khRBKli-5q9WIufD9Dte3KYDTDpjcgGZbpU_jGskB0";

const CLOUD_NAME    = "dqqml8dae";
const UPLOAD_PRESET = "tiny-path-unsigned";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

/* ═══════════════════════════════════════
   SVG ICONS
═══════════════════════════════════════ */

const ICON = {
  thumbsUp:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>`,
  thumbsDown: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg>`,
  comment:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  share:      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`
};

/* ═══════════════════════════════════════
   AVATAR COLOR
═══════════════════════════════════════ */

const AVATAR_COLORS = [
  "#c0392b", "#e67e22", "#d4a017", "#27ae60",
  "#16a085", "#2980b9", "#8e44ad", "#b7410e",
  "#1a7a4a", "#1c5f8a", "#6c3483", "#7f8c8d"
];

function avatarColor(username) {
  if (!username) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function avatarHTML(username, size = 40) {
  const letter = (username || "?").charAt(0).toUpperCase();
  const color  = avatarColor(username);
  return `<div class="avatar" style="width:${size}px;height:${size}px;background:${color}">${esc(letter)}</div>`;
}

/* ═══════════════════════════════════════
   SECURITY
═══════════════════════════════════════ */

function esc(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ═══════════════════════════════════════
   DOM REFS — APP
═══════════════════════════════════════ */

const postForm        = document.getElementById("postForm");
const textInput       = document.getElementById("textInput");
const imageInput      = document.getElementById("imageInput");
const charCounter     = document.getElementById("charCounter");
const feed            = document.getElementById("feed");
const modeButtons     = document.querySelectorAll(".mode-btn");
const locationPreview = document.getElementById("locationPreview");
const postingAsRow    = document.getElementById("postingAsRow");

const imageModal  = document.getElementById("imageModal");
const modalImage  = document.getElementById("modalImage");
const closeModal  = document.getElementById("closeModal");

const detailOverlay = document.getElementById("detailOverlay");
const detailBack    = document.getElementById("detailBack");
const detailBody    = document.getElementById("detailBody");
const commentList   = document.getElementById("commentList");
const commentInput  = document.getElementById("commentInput");
const commentSubmit = document.getElementById("commentSubmit");

const settingsBtn   = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const closeSettings = document.getElementById("closeSettings");

const filterBanner = document.getElementById("filterBanner");
const filterName   = document.getElementById("filterName");
const clearFilter  = document.getElementById("clearFilter");

/* ═══════════════════════════════════════
   DOM REFS — AUTH
═══════════════════════════════════════ */

const authOverlay     = document.getElementById("authOverlay");
const authTitle       = document.getElementById("authTitle");
const authEmail       = document.getElementById("authEmail");
const authPassword    = document.getElementById("authPassword");
const authDisplayName = document.getElementById("authDisplayName");
const authDisplayRow  = document.getElementById("authDisplayRow");
const authSubmitBtn   = document.getElementById("authSubmitBtn");
const authToggleBtn   = document.getElementById("authToggleBtn");
const authError       = document.getElementById("authError");
const logoutBtn       = document.getElementById("logoutBtn");
const editDisplayBtn  = document.getElementById("editDisplayBtn");
const displayNameEdit = document.getElementById("displayNameEdit");
const saveDisplayBtn  = document.getElementById("saveDisplayBtn");
const displayNameErr  = document.getElementById("displayNameErr");

/* ═══════════════════════════════════════
   STATE
═══════════════════════════════════════ */

let currentMode         = "text";
let selectedLocation    = null;
let filterUser          = null;
let currentDetailPostId = null;
let unsubscribeComments = null;
let allPosts            = [];
let currentUser         = null;
let feedChannel         = null;

/* ═══════════════════════════════════════
   AUTH HELPERS
═══════════════════════════════════════ */

function getDisplayName() {
  return currentUser?.user_metadata?.username || currentUser?.email || "You";
}

function showApp(user) {
  currentUser = user;
  authOverlay.classList.add("hidden");
  renderPostingAsChip();
}

function showAuth() {
  currentUser = null;
  authOverlay.classList.remove("hidden");
  setAuthMode("login");
}

/* ═══════════════════════════════════════
   AUTH — LOGIN / SIGNUP UI
═══════════════════════════════════════ */

let authMode = "login";

function setAuthMode(mode) {
  authMode = mode;
  authError.textContent = "";
  if (mode === "signup") {
    authTitle.textContent     = "Create account";
    authSubmitBtn.textContent = "Sign up";
    authToggleBtn.textContent = "Already have an account? Log in";
    authDisplayRow.classList.remove("hidden");
  } else {
    authTitle.textContent     = "Welcome back";
    authSubmitBtn.textContent = "Log in";
    authToggleBtn.textContent = "New here? Create an account";
    authDisplayRow.classList.add("hidden");
  }
}

authToggleBtn.addEventListener("click", () => {
  setAuthMode(authMode === "login" ? "signup" : "login");
});

authSubmitBtn.addEventListener("click", async () => {
  const email    = authEmail.value.trim();
  const password = authPassword.value;
  const display  = authDisplayName.value.trim();

  authError.textContent = "";

  if (!email || !password) {
    authError.textContent = "Please enter your email and password.";
    return;
  }
  if (authMode === "signup" && !display) {
    authError.textContent = "Please enter a display name.";
    return;
  }

  authSubmitBtn.disabled    = true;
  authSubmitBtn.textContent = authMode === "login" ? "Logging in…" : "Creating account…";

  try {
    if (authMode === "signup") {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { username: display } }
      });
      if (error) throw error;
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    }
    // onAuthStateChange handles the rest
  } catch (err) {
    authError.textContent     = err.message || "Something went wrong.";
    authSubmitBtn.disabled    = false;
    authSubmitBtn.textContent = authMode === "login" ? "Log in" : "Sign up";
  }
});

[authEmail, authPassword, authDisplayName].forEach(el => {
  el.addEventListener("keydown", e => { if (e.key === "Enter") authSubmitBtn.click(); });
});

/* ═══════════════════════════════════════
   AUTH — SESSION LISTENER
═══════════════════════════════════════ */

supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.user) {
    showApp(session.user);
    loadPosts();
    startRealtimeFeed();
  } else {
    showAuth();
  }
});

/* ═══════════════════════════════════════
   POSTING-AS CHIP (read-only, auth-driven)
═══════════════════════════════════════ */

function renderPostingAsChip() {
  if (!postingAsRow) return;
  const name = getDisplayName();
  postingAsRow.innerHTML = `
    <div class="posting-as-chip">
      <div class="chip-avatar" style="background:${avatarColor(name)}">${esc(name.charAt(0).toUpperCase())}</div>
      <span class="chip-name">${esc(name)}</span>
    </div>
  `;
}

/* ═══════════════════════════════════════
   SETTINGS — DISPLAY NAME + LOGOUT
═══════════════════════════════════════ */

settingsBtn.addEventListener("click", () => {
  document.getElementById("settingsDisplayName").textContent = getDisplayName();
  displayNameEdit.classList.add("hidden");
  saveDisplayBtn.classList.add("hidden");
  editDisplayBtn.classList.remove("hidden");
  if (displayNameErr) displayNameErr.textContent = "";
  settingsModal.classList.remove("hidden");
});

closeSettings.addEventListener("click", () => settingsModal.classList.add("hidden"));
settingsModal.addEventListener("click", e => {
  if (e.target === settingsModal) settingsModal.classList.add("hidden");
});

logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  settingsModal.classList.add("hidden");
});

editDisplayBtn.addEventListener("click", () => {
  displayNameEdit.value = getDisplayName();
  displayNameEdit.classList.remove("hidden");
  saveDisplayBtn.classList.remove("hidden");
  editDisplayBtn.classList.add("hidden");
  if (displayNameErr) displayNameErr.textContent = "";
  displayNameEdit.focus();
});

saveDisplayBtn.addEventListener("click", async () => {
  const val = displayNameEdit.value.trim();
  if (!val) { if (displayNameErr) displayNameErr.textContent = "Name can't be empty."; return; }

  saveDisplayBtn.disabled    = true;
  saveDisplayBtn.textContent = "Saving…";

  const { error } = await supabase.auth.updateUser({ data: { username: val } });

  if (error) {
    if (displayNameErr) displayNameErr.textContent = error.message;
  } else {
    const { data: { user } } = await supabase.auth.getUser();
    currentUser = user;
    renderPostingAsChip();
    document.getElementById("settingsDisplayName").textContent = val;
    displayNameEdit.classList.add("hidden");
    saveDisplayBtn.classList.add("hidden");
    editDisplayBtn.classList.remove("hidden");
    if (displayNameErr) displayNameErr.textContent = "";
  }

  saveDisplayBtn.disabled    = false;
  saveDisplayBtn.textContent = "Save";
});

/* ═══════════════════════════════════════
   PWA / SERVICE WORKER
═══════════════════════════════════════ */

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}

const isIOS        = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone = navigator.standalone === true;
if (isIOS && !isStandalone && !sessionStorage.getItem("installShown")) {
  sessionStorage.setItem("installShown", "1");
  setTimeout(() => settingsModal.classList.remove("hidden"), 1800);
}

/* ═══════════════════════════════════════
   CHARACTER COUNTER
═══════════════════════════════════════ */

const CHAR_LIMIT = 300;

textInput.addEventListener("input", () => {
  const len = textInput.value.length;
  charCounter.textContent = `${len} / ${CHAR_LIMIT}`;
  charCounter.classList.remove("char-near", "char-over");
  if (len >= CHAR_LIMIT - 30) charCounter.classList.add("char-near");
  if (len >= CHAR_LIMIT)      charCounter.classList.add("char-over");
});

/* ═══════════════════════════════════════
   MODE SWITCHING
═══════════════════════════════════════ */

modeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    modeButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentMode = btn.dataset.mode;
    if (currentMode === "photo")    imageInput.click();
    if (currentMode === "location") fetchLocation();
  });
});

/* ═══════════════════════════════════════
   LOCATION
═══════════════════════════════════════ */

async function fetchLocation() {
  if (!navigator.geolocation) { alert("Geolocation not supported."); return; }
  navigator.geolocation.getCurrentPosition(
    async ({ coords: { latitude: lat, longitude: lon } }) => {
      try {
        const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
        const data = await res.json();
        const city  = data.address.city || data.address.town || data.address.village || "";
        const state = data.address.state || "";
        selectedLocation = `${city}, ${state}`;
        locationPreview.textContent = `📍 ${selectedLocation}`;
        locationPreview.classList.remove("hidden");
      } catch { alert("Could not fetch location."); }
    },
    () => alert("Location permission denied.")
  );
}

/* ═══════════════════════════════════════
   POST SUBMIT
═══════════════════════════════════════ */

postForm.addEventListener("submit", async e => {
  e.preventDefault();

  const text      = textInput.value.trim();
  const username  = getDisplayName();
  const imageFile = imageInput.files[0];

  if (!text && !imageFile && !selectedLocation) return;
  if (!currentUser) { alert("Please log in first."); return; }

  const submitBtn = postForm.querySelector(".post-btn");
  submitBtn.disabled    = true;
  submitBtn.textContent = "Posting…";

  try {
    let image_url = null;
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", UPLOAD_PRESET);
      const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
      const data = await res.json();
      image_url = data.secure_url;
    }

    const { error } = await supabase.from("posts").insert({
      text: text || null, username, image_url, location: selectedLocation, upvotes: 0, downvotes: 0
    });
    if (error) throw error;

    textInput.value  = "";
    imageInput.value = "";
    selectedLocation = null;
    charCounter.textContent = `0 / ${CHAR_LIMIT}`;
    charCounter.classList.remove("char-near", "char-over");
    locationPreview.classList.add("hidden");
    modeButtons.forEach(b => b.classList.remove("active"));
    document.querySelector('[data-mode="text"]').classList.add("active");
    currentMode = "text";

  } catch (err) {
    console.error("Post failed:", err);
    alert("Something went wrong. Please try again.");
  } finally {
    submitBtn.disabled    = false;
    submitBtn.textContent = "Post";
  }
});

/* ═══════════════════════════════════════
   TIME HELPERS
═══════════════════════════════════════ */

function toDate(ts) {
  if (!ts) return null;
  return ts instanceof Date ? ts : new Date(ts);
}

function timeAgo(ts) {
  const d = toDate(ts);
  if (!d) return "";
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 60)    return `${s}s ago`;
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function fullTimestamp(ts) {
  const d = toDate(ts);
  if (!d) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

function dayLabel(ts) {
  const d = toDate(ts);
  if (!d) return "Earlier";
  const today   = new Date();
  today.setHours(0, 0, 0, 0);
  const postDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff    = Math.round((today - postDay) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ═══════════════════════════════════════
   RENDER FEED
═══════════════════════════════════════ */

function renderFeed() {
  feed.innerHTML = "";
  const posts = filterUser ? allPosts.filter(p => p.username === filterUser) : allPosts;
  let lastLabel = null;

  posts.forEach(post => {
    const label = dayLabel(post.created_at);
    if (label !== lastLabel) {
      const header = document.createElement("div");
      header.className   = "day-header";
      header.textContent = label;
      feed.appendChild(header);
      lastLabel = label;
    }

    const isImageOnly = !!(post.image_url && !post.text);
    const postEl = document.createElement("div");
    postEl.className  = `post${isImageOnly ? " post--image-only" : ""}`;
    postEl.dataset.id = post.id;

    postEl.innerHTML = `
      <div class="post-header">
        <div class="post-user">
          ${avatarHTML(post.username)}
          <div>
            <div class="username filter-link" data-user="${esc(post.username)}">${esc(post.username)}</div>
            <div class="timestamp">${timeAgo(post.created_at)}</div>
          </div>
        </div>
      </div>
      ${post.location  ? `<div class="location-pill">📍 ${esc(post.location)}</div>` : ""}
      ${post.text      ? `<div class="text post-tap">${esc(post.text)}</div>` : ""}
      ${post.image_url ? `<img src="${esc(post.image_url)}" class="post-image" loading="lazy" />` : ""}
      <div class="post-actions">
        <button class="vote-btn upvote-btn">${ICON.thumbsUp} <span class="vote-count">${post.upvotes || 0}</span></button>
        <button class="vote-btn downvote-btn">${ICON.thumbsDown} <span class="vote-count">${post.downvotes || 0}</span></button>
        <span class="comment-hint post-tap">${ICON.comment} Comments</span>
      </div>
    `;

    if (post.image_url) {
      postEl.querySelector(".post-image").addEventListener("click", e => {
        e.stopPropagation();
        modalImage.src = post.image_url;
        imageModal.classList.remove("hidden");
      });
    }

    postEl.querySelectorAll(".post-tap").forEach(el => {
      el.addEventListener("click", e => { e.stopPropagation(); openDetail(post.id, post); });
    });

    postEl.querySelector(".upvote-btn").addEventListener("click", async e => {
      e.stopPropagation();
      if (navigator.vibrate) navigator.vibrate(12);
      await supabase.from("posts").update({ upvotes: (post.upvotes || 0) + 1 }).eq("id", post.id);
    });
    postEl.querySelector(".downvote-btn").addEventListener("click", async e => {
      e.stopPropagation();
      if (navigator.vibrate) navigator.vibrate(12);
      await supabase.from("posts").update({ downvotes: (post.downvotes || 0) + 1 }).eq("id", post.id);
    });

    postEl.querySelector(".filter-link").addEventListener("click", e => {
      e.stopPropagation();
      setFilter(post.username);
    });

    feed.appendChild(postEl);
  });
}

/* ═══════════════════════════════════════
   USER FILTER
═══════════════════════════════════════ */

function setFilter(user) {
  filterUser = user;
  filterName.textContent = user;
  filterBanner.classList.remove("hidden");
  renderFeed();
}

clearFilter.addEventListener("click", () => {
  filterUser = null;
  filterBanner.classList.add("hidden");
  renderFeed();
});

/* ═══════════════════════════════════════
   REALTIME FEED
═══════════════════════════════════════ */

async function loadPosts() {
  const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
  if (error) { console.error("Failed to load posts:", error); return; }
  allPosts = data || [];
  renderFeed();
}

function startRealtimeFeed() {
  if (feedChannel) return;
  feedChannel = supabase
    .channel("posts-channel")
    .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, () => loadPosts())
    .subscribe();
}

/* ═══════════════════════════════════════
   POST DETAIL VIEW
═══════════════════════════════════════ */

function openDetail(postId, post) {
  currentDetailPostId = postId;
  detailOverlay.style.transform  = "";
  detailOverlay.style.transition = "";

  detailBody.innerHTML = `
    <div class="detail-post">
      <div class="post-header">
        <div class="post-user">
          ${avatarHTML(post.username)}
          <div>
            <div class="username">${esc(post.username)}</div>
            <div class="timestamp">${fullTimestamp(post.created_at)}</div>
          </div>
        </div>
      </div>
      ${post.location  ? `<div class="location-pill">📍 ${esc(post.location)}</div>` : ""}
      ${post.text      ? `<div class="text">${esc(post.text)}</div>` : ""}
      ${post.image_url ? `<img src="${esc(post.image_url)}" class="detail-image" />` : ""}
      <div class="detail-votes">
        <button class="vote-btn detail-upvote">${ICON.thumbsUp} <span>${post.upvotes || 0}</span></button>
        <button class="vote-btn detail-downvote">${ICON.thumbsDown} <span>${post.downvotes || 0}</span></button>
        <button class="vote-btn share-btn">${ICON.share} Share</button>
      </div>
    </div>
  `;

  detailBody.querySelector(".detail-upvote").addEventListener("click", async () => {
    if (navigator.vibrate) navigator.vibrate(12);
    await supabase.from("posts").update({ upvotes: (post.upvotes || 0) + 1 }).eq("id", postId);
  });
  detailBody.querySelector(".detail-downvote").addEventListener("click", async () => {
    if (navigator.vibrate) navigator.vibrate(12);
    await supabase.from("posts").update({ downvotes: (post.downvotes || 0) + 1 }).eq("id", postId);
  });

  const shareBtn = detailBody.querySelector(".share-btn");
  if (navigator.share) {
    shareBtn.addEventListener("click", async () => {
      try { await navigator.share({ title: `${post.username} on Path`, text: post.text || "Check this out on Path", url: window.location.href }); } catch {}
    });
  } else {
    shareBtn.style.display = "none";
  }

  if (post.image_url) {
    detailBody.querySelector(".detail-image").addEventListener("click", () => {
      modalImage.src = post.image_url;
      imageModal.classList.remove("hidden");
    });
  }

  commentList.innerHTML = '<p class="no-comments">Loading…</p>';
  loadComments(postId);

  unsubscribeComments = supabase
    .channel(`comments-${postId}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "comments", filter: `post_id=eq.${postId}` }, () => loadComments(postId))
    .subscribe();

  detailOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

async function loadComments(postId) {
  const { data, error } = await supabase
    .from("comments").select("*").eq("post_id", postId).order("created_at", { ascending: true });
  if (error) { console.error("Failed to load comments:", error); return; }

  commentList.innerHTML = "";
  if (!data || data.length === 0) {
    commentList.innerHTML = '<p class="no-comments">No comments yet — say something!</p>';
    return;
  }
  data.forEach(c => {
    const el = document.createElement("div");
    el.className = "comment";
    el.innerHTML = `
      <div class="comment-avatar" style="background:${avatarColor(c.username)}">${esc((c.username || "?").charAt(0).toUpperCase())}</div>
      <div class="comment-content">
        <span class="comment-user">${esc(c.username)}</span><span class="comment-text">${esc(c.text)}</span>
      </div>
    `;
    commentList.appendChild(el);
  });
  commentList.scrollTop = commentList.scrollHeight;
}

function closeDetail(skipAnimation = false) {
  function finish() {
    detailOverlay.classList.add("hidden");
    detailOverlay.style.transform  = "";
    detailOverlay.style.transition = "";
    document.body.style.overflow   = "";
    if (unsubscribeComments) { supabase.removeChannel(unsubscribeComments); unsubscribeComments = null; }
    currentDetailPostId = null;
    commentInput.value  = "";
  }
  if (skipAnimation) { finish(); return; }
  detailOverlay.style.transition = "transform 0.28s cubic-bezier(0.32, 0.72, 0, 1)";
  detailOverlay.style.transform  = "translateX(100%)";
  setTimeout(finish, 280);
}

detailBack.addEventListener("click", () => closeDetail());

/* ═══════════════════════════════════════
   SWIPE RIGHT TO CLOSE DETAIL
═══════════════════════════════════════ */

let swipeStartX  = 0;
let swipeStartY  = 0;
let isSwiping    = false;
let swipeDecided = false;

detailOverlay.addEventListener("touchstart", e => {
  swipeStartX  = e.touches[0].clientX;
  swipeStartY  = e.touches[0].clientY;
  isSwiping    = false;
  swipeDecided = false;
  detailOverlay.style.transition = "none";
}, { passive: true });

detailOverlay.addEventListener("touchmove", e => {
  const dx = e.touches[0].clientX - swipeStartX;
  const dy = e.touches[0].clientY - swipeStartY;
  if (!swipeDecided && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
    swipeDecided = true;
    isSwiping    = dx > 0 && Math.abs(dx) > Math.abs(dy);
  }
  if (!isSwiping) return;
  e.preventDefault();
  detailOverlay.style.transform = `translateX(${Math.max(0, dx)}px)`;
}, { passive: false });

detailOverlay.addEventListener("touchend", e => {
  if (!swipeDecided) return;
  const dx = e.changedTouches[0].clientX - swipeStartX;
  const wasSwipe = isSwiping;
  swipeDecided = false;
  isSwiping    = false;
  if (!wasSwipe) { detailOverlay.style.transition = ""; return; }
  detailOverlay.style.transition = "transform 0.28s cubic-bezier(0.32, 0.72, 0, 1)";
  if (dx > 80) {
    detailOverlay.style.transform = "translateX(110%)";
    setTimeout(() => closeDetail(true), 260);
  } else {
    detailOverlay.style.transform = "";
    setTimeout(() => { detailOverlay.style.transition = ""; }, 300);
  }
}, { passive: true });

/* ═══════════════════════════════════════
   COMMENT SUBMIT
═══════════════════════════════════════ */

async function submitComment() {
  const text     = commentInput.value.trim();
  const username = getDisplayName();
  if (!text || !currentUser || !currentDetailPostId) return;
  commentInput.value = "";
  const { error } = await supabase.from("comments").insert({ post_id: currentDetailPostId, text, username });
  if (error) console.error("Comment failed:", error);
}

commentSubmit.addEventListener("click", submitComment);
commentInput.addEventListener("keydown", e => { if (e.key === "Enter") submitComment(); });

const viewportMeta = document.querySelector("meta[name=viewport]");
const baseViewport = viewportMeta.content;
commentInput.addEventListener("focus", () => { viewportMeta.content = baseViewport + ", maximum-scale=1"; });
commentInput.addEventListener("blur",  () => { viewportMeta.content = baseViewport; });

/* ═══════════════════════════════════════
   IMAGE MODAL
═══════════════════════════════════════ */

closeModal.addEventListener("click", () => imageModal.classList.add("hidden"));
imageModal.addEventListener("click", e => { if (e.target === imageModal) imageModal.classList.add("hidden"); });
