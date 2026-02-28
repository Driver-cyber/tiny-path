import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ═══════════════════════════════════════
   FIREBASE + CLOUDINARY CONFIG
═══════════════════════════════════════ */

const firebaseConfig = {
  apiKey: "AIzaSyDa0W3Fi_WIqhAcro_sk0bV8W08l8ut6kw",
  authDomain: "tiny-path-b9bb4.firebaseapp.com",
  projectId: "tiny-path-b9bb4",
  storageBucket: "tiny-path-b9bb4.firebasestorage.app",
  messagingSenderId: "28600254620",
  appId: "1:28600254620:web:b1aa7917e4a7735976ed59"
};

const CLOUD_NAME   = "dqqml8dae";
const UPLOAD_PRESET = "tiny-path-unsigned";

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

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
   DOM REFS
═══════════════════════════════════════ */

const postForm        = document.getElementById("postForm");
const textInput       = document.getElementById("textInput");
const imageInput      = document.getElementById("imageInput");
const usernameInput   = document.getElementById("usernameInput");
const charCounter     = document.getElementById("charCounter");
const feed            = document.getElementById("feed");
const modeButtons     = document.querySelectorAll(".mode-btn");
const locationPreview = document.getElementById("locationPreview");

const imageModal      = document.getElementById("imageModal");
const modalImage      = document.getElementById("modalImage");
const closeModal      = document.getElementById("closeModal");

const detailOverlay   = document.getElementById("detailOverlay");
const detailHeader    = document.getElementById("detailHeader");
const detailBack      = document.getElementById("detailBack");
const detailBody      = document.getElementById("detailBody");
const commentList     = document.getElementById("commentList");
const commentInput    = document.getElementById("commentInput");
const commentSubmit   = document.getElementById("commentSubmit");

const settingsBtn     = document.getElementById("settingsBtn");
const settingsModal   = document.getElementById("settingsModal");
const closeSettings   = document.getElementById("closeSettings");

const filterBanner    = document.getElementById("filterBanner");
const filterName      = document.getElementById("filterName");
const clearFilter     = document.getElementById("clearFilter");

/* ═══════════════════════════════════════
   STATE
═══════════════════════════════════════ */

let currentMode         = "text";
let selectedLocation    = null;
let filterUser          = null;
let currentDetailPostId = null;
let unsubscribeComments = null;
let allPosts            = [];

/* ═══════════════════════════════════════
   INIT
═══════════════════════════════════════ */

// Restore saved username
const savedUsername = localStorage.getItem("tinyPathUsername");
if (savedUsername) usernameInput.value = savedUsername;

// Register service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}

// Auto-show install prompt on iOS Safari (once per session)
const isIOS        = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone = navigator.standalone === true;
if (isIOS && !isStandalone && !sessionStorage.getItem("installShown")) {
  sessionStorage.setItem("installShown", "1");
  setTimeout(() => settingsModal.classList.remove("hidden"), 1800);
}

/* ═══════════════════════════════════════
   SECURITY — HTML ESCAPE
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
  if (!navigator.geolocation) {
    alert("Geolocation not supported.");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    async ({ coords: { latitude: lat, longitude: lon } }) => {
      try {
        const res  = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );
        const data = await res.json();
        const city  = data.address.city || data.address.town || data.address.village || "";
        const state = data.address.state || "";
        selectedLocation = `${city}, ${state}`;
        locationPreview.textContent = `📍 ${selectedLocation}`;
        locationPreview.classList.remove("hidden");
      } catch {
        alert("Could not fetch location.");
      }
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
  const username  = usernameInput.value.trim();
  const imageFile = imageInput.files[0];

  if (!text && !imageFile && !selectedLocation) return;
  if (!username) { alert("Please enter your name."); return; }

  localStorage.setItem("tinyPathUsername", username);

  const submitBtn = postForm.querySelector(".post-btn");
  submitBtn.disabled    = true;
  submitBtn.textContent = "Posting…";

  try {
    let imageUrl = null;
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", UPLOAD_PRESET);
      const res  = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      imageUrl = data.secure_url;
    }

    await addDoc(collection(db, "posts"), {
      text,
      username,
      imageUrl,
      location: selectedLocation,
      upvotes:  0,
      downvotes: 0,
      createdAt: serverTimestamp()
    });

    // Reset form
    textInput.value  = "";
    imageInput.value = "";
    selectedLocation = null;
    charCounter.textContent = `0 / ${CHAR_LIMIT}`;
    charCounter.classList.remove("char-near", "char-over");
    locationPreview.classList.add("hidden");
    modeButtons.forEach(b => b.classList.remove("active"));
    document.querySelector('[data-mode="text"]').classList.add("active");
    currentMode = "text";

  } finally {
    submitBtn.disabled    = false;
    submitBtn.textContent = "Post";
  }
});

/* ═══════════════════════════════════════
   TIME HELPERS
═══════════════════════════════════════ */

function timeAgo(ts) {
  if (!ts) return "";
  const s = Math.floor((Date.now() - ts.toDate()) / 1000);
  if (s < 60)    return `${s}s ago`;
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function fullTimestamp(ts) {
  if (!ts) return "";
  return ts.toDate().toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit"
  });
}

function dayLabel(ts) {
  if (!ts) return "Earlier";
  const d       = ts.toDate();
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

  const posts = filterUser
    ? allPosts.filter(p => p.data.username === filterUser)
    : allPosts;

  let lastLabel = null;

  posts.forEach(({ id, data: post }) => {

    // Day header
    const label = dayLabel(post.createdAt);
    if (label !== lastLabel) {
      const header = document.createElement("div");
      header.className   = "day-header";
      header.textContent = label;
      feed.appendChild(header);
      lastLabel = label;
    }

    // Detect image-only posts (photo + no text)
    const isImageOnly = !!(post.imageUrl && !post.text);
    const firstLetter = (post.username || "?").charAt(0).toUpperCase();

    const postEl = document.createElement("div");
    postEl.className  = `post${isImageOnly ? " post--image-only" : ""}`;
    postEl.dataset.id = id;

    postEl.innerHTML = `
      <div class="post-header">
        <div class="post-user">
          <div class="avatar">${esc(firstLetter)}</div>
          <div>
            <div class="username filter-link" data-user="${esc(post.username)}">${esc(post.username)}</div>
            <div class="timestamp">${timeAgo(post.createdAt)}</div>
          </div>
        </div>
      </div>
      ${post.location ? `<div class="location-pill">📍 ${esc(post.location)}</div>` : ""}
      ${post.text    ? `<div class="text post-tap">${esc(post.text)}</div>` : ""}
      ${post.imageUrl ? `<img src="${esc(post.imageUrl)}" class="post-image" loading="lazy" />` : ""}
      <div class="post-actions">
        <button class="vote-btn upvote-btn">${ICON.thumbsUp} <span class="vote-count">${post.upvotes || 0}</span></button>
        <button class="vote-btn downvote-btn">${ICON.thumbsDown} <span class="vote-count">${post.downvotes || 0}</span></button>
        <span class="comment-hint post-tap">${ICON.comment} Comments</span>
      </div>
    `;

    // Image → fullscreen modal
    if (post.imageUrl) {
      postEl.querySelector(".post-image").addEventListener("click", e => {
        e.stopPropagation();
        modalImage.src = post.imageUrl;
        imageModal.classList.remove("hidden");
      });
    }

    // Tap text or comments → detail view
    postEl.querySelectorAll(".post-tap").forEach(el => {
      el.addEventListener("click", e => {
        e.stopPropagation();
        openDetail(id, post);
      });
    });

    // Vote buttons (with haptic feedback)
    postEl.querySelector(".upvote-btn").addEventListener("click", e => {
      e.stopPropagation();
      if (navigator.vibrate) navigator.vibrate(12);
      updateDoc(doc(db, "posts", id), { upvotes: increment(1) });
    });
    postEl.querySelector(".downvote-btn").addEventListener("click", e => {
      e.stopPropagation();
      if (navigator.vibrate) navigator.vibrate(12);
      updateDoc(doc(db, "posts", id), { downvotes: increment(1) });
    });

    // Username → filter feed
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
   REALTIME FEED LISTENER
═══════════════════════════════════════ */

const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));

onSnapshot(postsQuery, snapshot => {
  allPosts = snapshot.docs.map(d => ({ id: d.id, data: d.data() }));
  renderFeed();
});

/* ═══════════════════════════════════════
   POST DETAIL VIEW
═══════════════════════════════════════ */

function openDetail(postId, post) {
  currentDetailPostId = postId;
  // Reset any lingering swipe transform
  detailOverlay.style.transform  = "";
  detailOverlay.style.transition = "";

  const firstLetter = (post.username || "?").charAt(0).toUpperCase();

  detailBody.innerHTML = `
    <div class="detail-post">
      <div class="post-header">
        <div class="post-user">
          <div class="avatar">${esc(firstLetter)}</div>
          <div>
            <div class="username">${esc(post.username)}</div>
            <div class="timestamp">${fullTimestamp(post.createdAt)}</div>
          </div>
        </div>
      </div>
      ${post.location ? `<div class="location-pill">📍 ${esc(post.location)}</div>` : ""}
      ${post.text     ? `<div class="text">${esc(post.text)}</div>` : ""}
      ${post.imageUrl ? `<img src="${esc(post.imageUrl)}" class="detail-image" />` : ""}
      <div class="detail-votes">
        <button class="vote-btn detail-upvote">${ICON.thumbsUp} <span>${post.upvotes || 0}</span></button>
        <button class="vote-btn detail-downvote">${ICON.thumbsDown} <span>${post.downvotes || 0}</span></button>
        <button class="vote-btn share-btn">${ICON.share} Share</button>
      </div>
    </div>
  `;

  // Votes (with haptic)
  detailBody.querySelector(".detail-upvote").addEventListener("click", () => {
    if (navigator.vibrate) navigator.vibrate(12);
    updateDoc(doc(db, "posts", postId), { upvotes: increment(1) });
  });
  detailBody.querySelector(".detail-downvote").addEventListener("click", () => {
    if (navigator.vibrate) navigator.vibrate(12);
    updateDoc(doc(db, "posts", postId), { downvotes: increment(1) });
  });

  // Share (Web Share API — iOS/Android native sheet)
  const shareBtn = detailBody.querySelector(".share-btn");
  if (navigator.share) {
    shareBtn.addEventListener("click", async () => {
      try {
        await navigator.share({
          title: `${post.username} on Path`,
          text:  post.text || "Check this out on Path",
          url:   window.location.href
        });
      } catch {}
    });
  } else {
    shareBtn.style.display = "none";
  }

  // Image → fullscreen modal
  if (post.imageUrl) {
    detailBody.querySelector(".detail-image").addEventListener("click", () => {
      modalImage.src = post.imageUrl;
      imageModal.classList.remove("hidden");
    });
  }

  // Subscribe to comments realtime
  commentList.innerHTML = '<p class="no-comments">Loading…</p>';
  const commentsQ = query(
    collection(db, "posts", postId, "comments"),
    orderBy("createdAt", "asc")
  );
  unsubscribeComments = onSnapshot(commentsQ, snap => {
    commentList.innerHTML = "";
    if (snap.empty) {
      commentList.innerHTML = '<p class="no-comments">No comments yet — say something!</p>';
      return;
    }
    snap.forEach(d => {
      const c  = d.data();
      const el = document.createElement("div");
      el.className = "comment";
      el.innerHTML = `<span class="comment-user">${esc(c.username)}</span><span class="comment-text">${esc(c.text)}</span>`;
      commentList.appendChild(el);
    });
    commentList.scrollTop = commentList.scrollHeight;
  });

  detailOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeDetail(skipAnimation = false) {
  function finish() {
    detailOverlay.classList.add("hidden");
    detailOverlay.style.transform  = "";
    detailOverlay.style.transition = "";
    document.body.style.overflow   = "";
    if (unsubscribeComments) {
      unsubscribeComments();
      unsubscribeComments = null;
    }
    currentDetailPostId = null;
    commentInput.value  = "";
  }

  if (skipAnimation) {
    finish();
    return;
  }

  // Slide back out to the right
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

// Non-passive so we can call preventDefault() to stop iOS from stealing
// the horizontal gesture as a scroll event on the inner scrollable divs.
detailOverlay.addEventListener("touchmove", e => {
  const dx = e.touches[0].clientX - swipeStartX;
  const dy = e.touches[0].clientY - swipeStartY;

  if (!swipeDecided && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
    swipeDecided = true;
    isSwiping    = dx > 0 && Math.abs(dx) > Math.abs(dy);
  }

  if (!isSwiping) return;
  e.preventDefault(); // Stop iOS scroll from interfering with horizontal swipe
  detailOverlay.style.transform = `translateX(${Math.max(0, dx)}px)`;
}, { passive: false });

detailOverlay.addEventListener("touchend", e => {
  if (!swipeDecided) return;

  const dx       = e.changedTouches[0].clientX - swipeStartX;
  const wasSwipe = isSwiping;

  swipeDecided = false;
  isSwiping    = false;

  if (!wasSwipe) {
    detailOverlay.style.transition = "";
    return;
  }

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
  const username = localStorage.getItem("tinyPathUsername") || usernameInput.value.trim();
  if (!text)     return;
  if (!username) { alert("Please set your name first."); return; }
  if (!currentDetailPostId) return;

  commentInput.value = "";
  await addDoc(collection(db, "posts", currentDetailPostId, "comments"), {
    text,
    username,
    createdAt: serverTimestamp()
  });
}

commentSubmit.addEventListener("click", submitComment);
commentInput.addEventListener("keydown", e => {
  if (e.key === "Enter") submitComment();
});

// Prevent iOS Safari viewport zoom on input focus
const viewportMeta = document.querySelector("meta[name=viewport]");
const baseViewport = viewportMeta.content;
commentInput.addEventListener("focus", () => {
  viewportMeta.content = baseViewport + ", maximum-scale=1";
});
commentInput.addEventListener("blur", () => {
  viewportMeta.content = baseViewport;
});

/* ═══════════════════════════════════════
   IMAGE MODAL
═══════════════════════════════════════ */

closeModal.addEventListener("click", () => imageModal.classList.add("hidden"));
imageModal.addEventListener("click", e => {
  if (e.target === imageModal) imageModal.classList.add("hidden");
});

/* ═══════════════════════════════════════
   SETTINGS / INSTALL MODAL
═══════════════════════════════════════ */

settingsBtn.addEventListener("click",   () => settingsModal.classList.remove("hidden"));
closeSettings.addEventListener("click", () => settingsModal.classList.add("hidden"));
settingsModal.addEventListener("click", e => {
  if (e.target === settingsModal) settingsModal.classList.add("hidden");
});
