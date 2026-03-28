import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

/* ═══════════════════════════════════════
   CONFIG
═══════════════════════════════════════ */

const SUPABASE_URL      = 'https://czaztxqhkqwoviazqaeu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6YXp0eHFoa3F3b3ZpYXpxYWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NDEyNjgsImV4cCI6MjA4ODIxNzI2OH0.2khRBKli-5q9WIufD9Dte3KYDTDpjcgGZbpU_jGskB0';
const MODERATOR_EMAIL   = 'cstewch@gmail.com';
const CLOUD_NAME        = 'dqqml8dae';
const UPLOAD_PRESET     = 'tiny-path-unsigned';
const CHAR_LIMIT        = 300;

const EMOJIS = ['❤️','🔥','😂','😮','😢','😡','🎉','👀','😍','🙌','💯','🫶','✨','💀','🤣','😭'];

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ═══════════════════════════════════════
   SVG ICONS
═══════════════════════════════════════ */

const ICON = {
  thumbsUp:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>`,
  thumbsDown: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg>`,
  comment:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  share:      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  pencil:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
  trash:      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`
};

/* ═══════════════════════════════════════
   STATE
═══════════════════════════════════════ */

let currentUser         = null;
let currentProfile      = null;
let allPosts            = [];
let allVotes            = [];
let allReactions        = [];
let filterUserId        = null;
let filterDisplayName   = null;
let currentDetailPostId = null;
let currentDetailPost   = null;
let postsChannel        = null;
let commentsChannel     = null;
let votesChannel        = null;
let reactionsChannel    = null;
let allComments         = [];
let appInitialized      = false;
let inPasswordRecovery  = false;

// FAB / sheet state
let fabOpen             = false;
let sheetMode           = null;   // 'text' | 'photo' | 'location'
let sheetImageFile      = null;
let sheetLocation       = null;

// Emoji picker state
let emojiPickerPostId   = null;
let emojiPickerEl       = null;

/* ═══════════════════════════════════════
   DOM REFS — AUTH
═══════════════════════════════════════ */

const authScreen           = document.getElementById('authScreen');
const checkEmailScreen     = document.getElementById('checkEmailScreen');
const displayNameScreen    = document.getElementById('displayNameScreen');
const forgotPasswordScreen = document.getElementById('forgotPasswordScreen');
const setPasswordScreen    = document.getElementById('setPasswordScreen');
const appShell             = document.getElementById('appShell');
const authForm          = document.getElementById('authForm');
const authEmail         = document.getElementById('authEmail');
const authPassword      = document.getElementById('authPassword');
const authError         = document.getElementById('authError');
const authSubmit        = document.getElementById('authSubmit');
const sentEmailDisplay  = document.getElementById('sentEmailDisplay');
const backToSignIn         = document.getElementById('backToSignIn');
const displayNameForm      = document.getElementById('displayNameForm');
const displayNameInput     = document.getElementById('displayNameInput');
const forgotPasswordBtn    = document.getElementById('forgotPasswordBtn');
const forgotPasswordForm   = document.getElementById('forgotPasswordForm');
const forgotEmail          = document.getElementById('forgotEmail');
const forgotError          = document.getElementById('forgotError');
const forgotSubmit         = document.getElementById('forgotSubmit');
const forgotFormBody       = document.getElementById('forgotFormBody');
const forgotSuccess        = document.getElementById('forgotSuccess');
const forgotEmailDisplay   = document.getElementById('forgotEmailDisplay');
const backFromForgot       = document.getElementById('backFromForgot');
const backFromForgotSuccess = document.getElementById('backFromForgotSuccess');
const setPasswordForm      = document.getElementById('setPasswordForm');
const newPasswordInput     = document.getElementById('newPasswordInput');
const setPasswordError     = document.getElementById('setPasswordError');
const setPasswordSubmit    = document.getElementById('setPasswordSubmit');

/* ═══════════════════════════════════════
   DOM REFS — APP
═══════════════════════════════════════ */

const feed              = document.getElementById('feed');
const filterBanner      = document.getElementById('filterBanner');
const filterName        = document.getElementById('filterName');
const clearFilter       = document.getElementById('clearFilter');
const imageModal        = document.getElementById('imageModal');
const modalImage        = document.getElementById('modalImage');
const closeModal        = document.getElementById('closeModal');
const detailOverlay     = document.getElementById('detailOverlay');
const detailBack        = document.getElementById('detailBack');
const detailBody        = document.getElementById('detailBody');
const commentList       = document.getElementById('commentList');
const commentInput      = document.getElementById('commentInput');
const commentSubmit     = document.getElementById('commentSubmit');
const settingsBtn       = document.getElementById('settingsBtn');
const settingsModal     = document.getElementById('settingsModal');
const closeSettings     = document.getElementById('closeSettings');
const settingsEmail     = document.getElementById('settingsEmail');
const settingsDisplayName = document.getElementById('settingsDisplayName');
const saveDisplayName   = document.getElementById('saveDisplayName');
const logoutBtn         = document.getElementById('logoutBtn');

/* ═══════════════════════════════════════
   DOM REFS — FAB + SHEET
═══════════════════════════════════════ */

const fabContainer      = document.getElementById('fabContainer');
const fab               = document.getElementById('fab');
const fabBackdrop       = document.getElementById('fabBackdrop');
const radialLocation    = document.getElementById('radialLocation');
const radialPhoto       = document.getElementById('radialPhoto');
const radialText        = document.getElementById('radialText');
const postSheet         = document.getElementById('postSheet');
const sheetClose        = document.getElementById('sheetClose');
const sheetSubmit       = document.getElementById('sheetSubmit');
const sheetTextInput    = document.getElementById('sheetTextInput');
const sheetCharCounter  = document.getElementById('sheetCharCounter');
const sheetImageInput   = document.getElementById('sheetImageInput');
const sheetPhotoArea    = document.getElementById('sheetPhotoArea');
const sheetPhotoPreview = document.getElementById('sheetPhotoPreview');
const sheetChangePhoto  = document.getElementById('sheetChangePhoto');
const sheetLocationPill = document.getElementById('sheetLocationPill');
const sheetLocationText = document.getElementById('sheetLocationText');

/* ═══════════════════════════════════════
   SECURITY — HTML ESCAPE
═══════════════════════════════════════ */

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ═══════════════════════════════════════
   SCREEN MANAGEMENT
═══════════════════════════════════════ */

function showScreen(name) {
  authScreen.classList.toggle('hidden',            name !== 'auth');
  checkEmailScreen.classList.toggle('hidden',      name !== 'checkemail');
  displayNameScreen.classList.toggle('hidden',     name !== 'displayname');
  forgotPasswordScreen.classList.toggle('hidden',  name !== 'forgotpassword');
  setPasswordScreen.classList.toggle('hidden',     name !== 'setpassword');
  appShell.classList.toggle('hidden',              name !== 'app');
}

/* ═══════════════════════════════════════
   AUTH — SIGN IN / SIGN UP
═══════════════════════════════════════ */

let authMode = 'signin';

document.querySelectorAll('.auth-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    authMode = tab.dataset.tab;
    authSubmit.textContent = authMode === 'signin' ? 'Sign in' : 'Sign up';
    authError.classList.add('hidden');
    authPassword.autocomplete = authMode === 'signin' ? 'current-password' : 'new-password';
  });
});

authForm.addEventListener('submit', async e => {
  e.preventDefault();
  const email    = authEmail.value.trim();
  const password = authPassword.value;
  if (!email || !password) return;

  authSubmit.disabled    = true;
  authSubmit.textContent = authMode === 'signin' ? 'Signing in…' : 'Creating account…';
  authError.classList.add('hidden');

  try {
    if (authMode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: 'https://tiny-path.pages.dev' }
      });
      if (error) throw error;
      sentEmailDisplay.textContent = email;
      showScreen('checkemail');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    }
  } catch (err) {
    authError.textContent = err.message;
    authError.classList.remove('hidden');
  } finally {
    authSubmit.disabled    = false;
    authSubmit.textContent = authMode === 'signin' ? 'Sign in' : 'Sign up';
  }
});

backToSignIn.addEventListener('click', () => {
  authPassword.value = '';
  showScreen('auth');
});

/* ═══════════════════════════════════════
   AUTH — FORGOT PASSWORD
═══════════════════════════════════════ */

forgotPasswordBtn.addEventListener('click', () => {
  forgotEmail.value = authEmail.value.trim();
  forgotError.classList.add('hidden');
  forgotFormBody.classList.remove('hidden');
  forgotSuccess.classList.add('hidden');
  showScreen('forgotpassword');
});

backFromForgot.addEventListener('click', () => showScreen('auth'));
backFromForgotSuccess.addEventListener('click', () => showScreen('auth'));

forgotPasswordForm.addEventListener('submit', async e => {
  e.preventDefault();
  const email = forgotEmail.value.trim();
  if (!email) return;

  forgotSubmit.disabled    = true;
  forgotSubmit.textContent = 'Sending…';
  forgotError.classList.add('hidden');

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://tiny-path.pages.dev'
  });

  forgotSubmit.disabled    = false;
  forgotSubmit.textContent = 'Send reset link';

  if (error) {
    forgotError.textContent = error.message.includes('rate')
      ? 'Too many emails sent recently. Please wait a few minutes and try again.'
      : error.message;
    forgotError.classList.remove('hidden');
    return;
  }

  forgotEmailDisplay.textContent = email;
  forgotFormBody.classList.add('hidden');
  forgotSuccess.classList.remove('hidden');
});

/* ═══════════════════════════════════════
   AUTH — SET NEW PASSWORD
═══════════════════════════════════════ */

setPasswordForm.addEventListener('submit', async e => {
  e.preventDefault();
  const password = newPasswordInput.value;
  if (!password) return;

  setPasswordSubmit.disabled    = true;
  setPasswordSubmit.textContent = 'Saving…';
  setPasswordError.classList.add('hidden');

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    setPasswordError.textContent = error.message;
    setPasswordError.classList.remove('hidden');
    setPasswordSubmit.disabled    = false;
    setPasswordSubmit.textContent = 'Set password';
    return;
  }

  // Password updated — clear recovery mode, load profile and proceed
  inPasswordRecovery = false;
  const { data: profile } = await supabase
    .from('profiles').select('display_name').eq('id', currentUser.id).maybeSingle();

  if (!profile) {
    showScreen('displayname');
  } else {
    currentProfile = profile;
    if (!appInitialized) initApp();
  }
});

/* ═══════════════════════════════════════
   AUTH — DISPLAY NAME SETUP
═══════════════════════════════════════ */

displayNameForm.addEventListener('submit', async e => {
  e.preventDefault();
  const name = displayNameInput.value.trim();
  if (!name) return;

  const submitBtn = displayNameForm.querySelector('.auth-btn');
  submitBtn.disabled    = true;
  submitBtn.textContent = 'Saving…';

  const { error } = await supabase.from('profiles').insert({
    id:           currentUser.id,
    display_name: name
  });

  if (error) {
    alert('Could not save your name. Please try again.');
    submitBtn.disabled    = false;
    submitBtn.textContent = "Let's go →";
    return;
  }

  currentProfile = { display_name: name };
  initApp();
});

/* ═══════════════════════════════════════
   AUTH STATE LISTENER
═══════════════════════════════════════ */

supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'PASSWORD_RECOVERY') {
    inPasswordRecovery = true;
    currentUser = session.user;
    showScreen('setpassword');
    return;
  }

  if (!session) {
    currentUser        = null;
    currentProfile     = null;
    inPasswordRecovery = false;
    teardownApp();
    showScreen('auth');
    return;
  }

  if (event !== 'INITIAL_SESSION' && event !== 'SIGNED_IN') return;

  // Don't proceed to app while the user is mid-password-reset
  if (inPasswordRecovery) return;

  currentUser = session.user;

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', currentUser.id)
    .maybeSingle();

  if (!profile) {
    showScreen('displayname');
  } else {
    currentProfile = profile;
    if (!appInitialized) initApp();
  }
});

/* ═══════════════════════════════════════
   APP INIT / TEARDOWN
═══════════════════════════════════════ */

function initApp() {
  appInitialized = true;
  showScreen('app');

  settingsEmail.textContent = currentUser.email;
  settingsDisplayName.value = currentProfile.display_name;

  subscribeRealtime();
  loadPosts();

  const isIOS        = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = navigator.standalone === true;
  if (isIOS && !isStandalone && !sessionStorage.getItem('installShown')) {
    sessionStorage.setItem('installShown', '1');
    setTimeout(() => openSettingsModal(), 1800);
  }
}

function teardownApp() {
  appInitialized = false;
  if (postsChannel)     { supabase.removeChannel(postsChannel);     postsChannel     = null; }
  if (commentsChannel)  { supabase.removeChannel(commentsChannel);  commentsChannel  = null; }
  if (votesChannel)     { supabase.removeChannel(votesChannel);     votesChannel     = null; }
  if (reactionsChannel) { supabase.removeChannel(reactionsChannel); reactionsChannel = null; }
  allPosts     = [];
  allComments  = [];
  allVotes     = [];
  allReactions = [];
  feed.innerHTML = '';
  closeDetail(true);
  closeFab();
  closeSheet();
  closeEmojiPicker();
}

/* ═══════════════════════════════════════
   POSTS — LOAD + REALTIME
═══════════════════════════════════════ */

async function loadPosts() {
  const [postsRes, votesRes, reactionsRes] = await Promise.all([
    supabase.from('posts').select('*').order('created_at', { ascending: false }),
    supabase.from('votes').select('*'),
    supabase.from('reactions').select('*')
  ]);

  allPosts     = postsRes.data     || [];
  allVotes     = votesRes.data     || [];
  allReactions = reactionsRes.data || [];
  renderFeed();
}

function subscribeRealtime() {
  postsChannel = supabase
    .channel('public:posts')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' },
      ({ new: post }) => {
        allPosts.unshift(post);
        renderFeed();
      })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'posts' },
      ({ new: post }) => {
        const idx = allPosts.findIndex(p => p.id === post.id);
        if (idx !== -1) allPosts[idx] = post;
        renderFeed();
        if (currentDetailPostId === post.id) {
          currentDetailPost = post;
          renderDetailBody(post);
        }
      })
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'posts' },
      ({ old: post }) => {
        allPosts = allPosts.filter(p => p.id !== post.id);
        renderFeed();
        if (currentDetailPostId === post.id) closeDetail(true);
      })
    .subscribe();

  votesChannel = supabase
    .channel('public:votes')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' },
      ({ new: vote }) => {
        if (!allVotes.find(v => v.id === vote.id)) allVotes.push(vote);
        refreshVoteReactionUI(vote.post_id);
      })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'votes' },
      ({ new: vote }) => {
        const idx = allVotes.findIndex(v => v.id === vote.id);
        if (idx !== -1) allVotes[idx] = vote; else allVotes.push(vote);
        refreshVoteReactionUI(vote.post_id);
      })
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'votes' },
      ({ old: vote }) => {
        const existing = allVotes.find(v => v.id === vote.id);
        const postId = existing?.post_id || vote.post_id;
        allVotes = allVotes.filter(v => v.id !== vote.id);
        if (postId) refreshVoteReactionUI(postId);
      })
    .subscribe();

  reactionsChannel = supabase
    .channel('public:reactions')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reactions' },
      ({ new: reaction }) => {
        if (!allReactions.find(r => r.id === reaction.id)) allReactions.push(reaction);
        refreshVoteReactionUI(reaction.post_id);
      })
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'reactions' },
      ({ old: reaction }) => {
        const existing = allReactions.find(r => r.id === reaction.id);
        const postId = existing?.post_id || reaction.post_id;
        allReactions = allReactions.filter(r => r.id !== reaction.id);
        if (postId) refreshVoteReactionUI(postId);
      })
    .subscribe();
}

function refreshVoteReactionUI(postId) {
  // Update the actions row on the feed card without rebuilding the whole feed
  const postEl = feed.querySelector(`[data-id="${postId}"]`);
  if (postEl) {
    const post = allPosts.find(p => p.id === postId);
    if (post) updatePostActionsEl(postEl, post);
  }
  // Refresh detail view if open on this post
  if (currentDetailPostId === postId) {
    const post = allPosts.find(p => p.id === postId);
    if (post) renderDetailBody(post);
  }
}

/* ═══════════════════════════════════════
   VOTES + REACTIONS — HELPERS
═══════════════════════════════════════ */

function getVoteCount(postId, type) {
  return allVotes.filter(v => v.post_id === postId && v.vote_type === type).length;
}

function getUserVote(postId) {
  if (!currentUser) return null;
  return allVotes.find(v => v.post_id === postId && v.user_id === currentUser.id) || null;
}

function getPostReactions(postId) {
  return allReactions.filter(r => r.post_id === postId);
}

function hasUserReacted(postId, emoji) {
  if (!currentUser) return false;
  return allReactions.some(r => r.post_id === postId && r.user_id === currentUser.id && r.emoji === emoji);
}

function reactionBadgesHtml(postId, userReacted = false) {
  const map = {};
  getPostReactions(postId).forEach(r => { map[r.emoji] = (map[r.emoji] || 0) + 1; });
  return Object.entries(map)
    .map(([emoji, count]) => {
      const mine = userReacted && hasUserReacted(postId, emoji);
      return `<span class="reaction-badge${mine ? ' user-reacted' : ''}">${emoji}<span class="reaction-badge-count">${count}</span></span>`;
    })
    .join('');
}

async function castVote(postId, type) {
  if (navigator.vibrate) navigator.vibrate(12);
  const existing = getUserVote(postId);

  if (existing) {
    if (existing.vote_type === type) {
      // Toggle off — delete
      const { error } = await supabase.from('votes').delete().eq('id', existing.id);
      if (!error) allVotes = allVotes.filter(v => v.id !== existing.id);
    } else {
      // Switch up ↔ down
      const { data, error } = await supabase
        .from('votes').update({ vote_type: type }).eq('id', existing.id).select().single();
      if (!error && data) {
        const idx = allVotes.findIndex(v => v.id === existing.id);
        if (idx !== -1) allVotes[idx] = data;
      }
    }
  } else {
    const { data, error } = await supabase.from('votes').insert({
      post_id: postId, user_id: currentUser.id,
      display_name: currentProfile.display_name, vote_type: type
    }).select().single();
    if (!error && data) allVotes.push(data);
  }

  refreshVoteReactionUI(postId);
}

async function toggleReaction(postId, emoji) {
  if (navigator.vibrate) navigator.vibrate(8);
  const existing = allReactions.find(
    r => r.post_id === postId && r.user_id === currentUser.id && r.emoji === emoji
  );

  if (existing) {
    const { error } = await supabase.from('reactions').delete().eq('id', existing.id);
    if (!error) allReactions = allReactions.filter(r => r.id !== existing.id);
  } else {
    const { data, error } = await supabase.from('reactions').insert({
      post_id: postId, user_id: currentUser.id,
      display_name: currentProfile.display_name, emoji
    }).select().single();
    if (!error && data) allReactions.push(data);
  }

  refreshVoteReactionUI(postId);
}

/* ═══════════════════════════════════════
   EMOJI PICKER
═══════════════════════════════════════ */

function openEmojiPicker(postId, anchorEl) {
  closeEmojiPicker();
  emojiPickerPostId = postId;

  const picker = document.createElement('div');
  picker.className = 'emoji-picker';
  picker.innerHTML = EMOJIS.map(e =>
    `<button class="emoji-option${hasUserReacted(postId, e) ? ' emoji-selected' : ''}" data-emoji="${e}">${e}</button>`
  ).join('');

  picker.querySelectorAll('.emoji-option').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      toggleReaction(postId, btn.dataset.emoji);
      closeEmojiPicker();
    });
  });

  document.body.appendChild(picker);
  emojiPickerEl = picker;

  requestAnimationFrame(() => {
    const rect = anchorEl.getBoundingClientRect();
    const pw   = picker.offsetWidth;
    const ph   = picker.offsetHeight;
    let left   = rect.left + rect.width / 2 - pw / 2;
    let top    = rect.top - ph - 8;
    left = Math.max(8, Math.min(window.innerWidth - pw - 8, left));
    top  = Math.max(8, top);
    picker.style.left = left + 'px';
    picker.style.top  = top  + 'px';
    picker.classList.add('positioned');
  });

  setTimeout(() => {
    document.addEventListener('click', handlePickerOutsideClick, { capture: true });
  }, 0);
}

function handlePickerOutsideClick(e) {
  if (emojiPickerEl && !emojiPickerEl.contains(e.target)) {
    closeEmojiPicker();
  }
}

function closeEmojiPicker() {
  if (emojiPickerEl) { emojiPickerEl.remove(); emojiPickerEl = null; }
  emojiPickerPostId = null;
  document.removeEventListener('click', handlePickerOutsideClick, { capture: true });
}

/* ═══════════════════════════════════════
   TIME HELPERS
═══════════════════════════════════════ */

function timeAgo(tsStr) {
  if (!tsStr) return '';
  const s = Math.floor((Date.now() - new Date(tsStr)) / 1000);
  if (s < 60)    return `${s}s ago`;
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function fullTimestamp(tsStr) {
  if (!tsStr) return '';
  return new Date(tsStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit'
  });
}

function dayLabel(tsStr) {
  if (!tsStr) return 'Earlier';
  const d       = new Date(tsStr);
  const today   = new Date();
  today.setHours(0, 0, 0, 0);
  const postDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff    = Math.round((today - postDay) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/* ═══════════════════════════════════════
   BUILD POST ACTIONS HTML
═══════════════════════════════════════ */

function buildPostActionsHtml(post) {
  const upCount   = getVoteCount(post.id, 'up');
  const downCount = getVoteCount(post.id, 'down');
  const userVote  = getUserVote(post.id);
  const badges    = reactionBadgesHtml(post.id, true);

  return `
    <div class="post-actions">
      <button class="vote-btn upvote-btn${userVote?.vote_type === 'up' ? ' vote-active vote-up' : ''}">${ICON.thumbsUp} <span class="vote-count">${upCount}</span></button>
      <button class="vote-btn downvote-btn${userVote?.vote_type === 'down' ? ' vote-active vote-down' : ''}">${ICON.thumbsDown} <span class="vote-count">${downCount}</span></button>
      <button class="emoji-trigger-btn" aria-label="Add reaction">😊</button>
      ${badges ? `<div class="reaction-badges">${badges}</div>` : ''}
      <span class="comment-hint post-tap">${ICON.comment} Comments</span>
    </div>
  `;
}

function bindPostActionsListeners(container, post) {
  container.querySelector('.upvote-btn').addEventListener('click', e => {
    e.stopPropagation(); castVote(post.id, 'up');
  });
  container.querySelector('.downvote-btn').addEventListener('click', e => {
    e.stopPropagation(); castVote(post.id, 'down');
  });
  container.querySelector('.emoji-trigger-btn').addEventListener('click', e => {
    e.stopPropagation(); openEmojiPicker(post.id, e.currentTarget);
  });
  container.querySelectorAll('.post-tap').forEach(el => {
    el.addEventListener('click', e => { e.stopPropagation(); openDetail(post.id); });
  });
}

function updatePostActionsEl(postEl, post) {
  const existing = postEl.querySelector('.post-actions');
  if (!existing) return;
  const tmp = document.createElement('div');
  tmp.innerHTML = buildPostActionsHtml(post);
  const newActions = tmp.querySelector('.post-actions');
  existing.replaceWith(newActions);
  bindPostActionsListeners(postEl, post);
}

/* ═══════════════════════════════════════
   RENDER FEED
═══════════════════════════════════════ */

function renderFeed() {
  feed.innerHTML = '';

  const posts = filterUserId
    ? allPosts.filter(p => p.user_id === filterUserId)
    : allPosts;

  let lastLabel = null;

  posts.forEach(post => {
    const label = dayLabel(post.created_at);
    if (label !== lastLabel) {
      const header = document.createElement('div');
      header.className   = 'day-header';
      header.textContent = label;
      feed.appendChild(header);
      lastLabel = label;
    }

    const isImageOnly = !!(post.image_url && !post.text);
    const firstLetter = (post.display_name || '?').charAt(0).toUpperCase();

    const postEl = document.createElement('div');
    postEl.className  = `post${isImageOnly ? ' post--image-only' : ''}`;
    postEl.dataset.id = post.id;

    postEl.innerHTML = `
      <div class="post-header">
        <div class="post-user">
          <div class="avatar">${esc(firstLetter)}</div>
          <div>
            <div class="username filter-link" data-userid="${esc(post.user_id)}" data-name="${esc(post.display_name)}">${esc(post.display_name)}</div>
            <div class="timestamp">${timeAgo(post.created_at)}</div>
          </div>
        </div>
      </div>
      ${post.location  ? `<div class="location-pill">📍 ${esc(post.location)}</div>` : ''}
      ${post.text      ? `<div class="text post-tap">${esc(post.text)}</div>` : ''}
      ${post.image_url ? `<img src="${esc(post.image_url)}" class="post-image" loading="lazy" />` : ''}
      ${buildPostActionsHtml(post)}
    `;

    if (post.image_url) {
      postEl.querySelector('.post-image').addEventListener('click', e => {
        e.stopPropagation();
        openImageModal(post.image_url);
      });
    }

    postEl.querySelector('.filter-link').addEventListener('click', e => {
      e.stopPropagation();
      setFilter(post.user_id, post.display_name);
    });

    bindPostActionsListeners(postEl, post);

    feed.appendChild(postEl);
  });
}

/* ═══════════════════════════════════════
   USER FILTER
═══════════════════════════════════════ */

function setFilter(userId, displayName) {
  filterUserId      = userId;
  filterDisplayName = displayName;
  filterName.textContent = displayName;
  filterBanner.classList.remove('hidden');
  renderFeed();
}

clearFilter.addEventListener('click', () => {
  filterUserId = null;
  filterBanner.classList.add('hidden');
  renderFeed();
});

/* ═══════════════════════════════════════
   FAB — OPEN / CLOSE
═══════════════════════════════════════ */

fab.addEventListener('click', () => {
  if (fabOpen) closeFab();
  else openFab();
});

fabBackdrop.addEventListener('click', closeFab);

function openFab() {
  fabOpen = true;
  fabContainer.classList.add('open');
  fabBackdrop.classList.remove('hidden');
  if (navigator.vibrate) navigator.vibrate(8);
}

function closeFab() {
  fabOpen = false;
  fabContainer.classList.remove('open');
  fabBackdrop.classList.add('hidden');
}

/* ═══════════════════════════════════════
   FAB — RADIAL BUTTONS
═══════════════════════════════════════ */

radialText.addEventListener('click', () => { closeFab(); openSheet('text'); });
radialPhoto.addEventListener('click', () => { closeFab(); openSheet('photo'); });
radialLocation.addEventListener('click', () => { closeFab(); openSheet('location'); });

/* ═══════════════════════════════════════
   POST SHEET — OPEN / CLOSE
═══════════════════════════════════════ */

function openSheet(mode) {
  sheetMode      = mode;
  sheetImageFile = null;
  sheetLocation  = null;

  sheetTextInput.value         = '';
  sheetCharCounter.textContent = `0 / ${CHAR_LIMIT}`;
  sheetCharCounter.classList.remove('char-near', 'char-over');
  sheetPhotoArea.classList.add('hidden');
  sheetLocationPill.classList.add('hidden');
  sheetSubmit.disabled = true;

  if (mode === 'text') {
    sheetTextInput.placeholder = "What's happening?";
    postSheet.classList.remove('hidden');
    setTimeout(() => sheetTextInput.focus(), 50);

  } else if (mode === 'photo') {
    sheetTextInput.placeholder = 'Add a caption… (optional)';
    postSheet.classList.remove('hidden');
    sheetImageInput.value = '';
    sheetImageInput.click();

  } else if (mode === 'location') {
    sheetTextInput.placeholder = 'Add a note… (optional)';
    sheetLocationPill.classList.remove('hidden');
    sheetLocationText.textContent = 'Fetching location…';
    postSheet.classList.remove('hidden');
    fetchLocation();
  }
}

function closeSheet() {
  postSheet.classList.add('hidden');
  sheetMode      = null;
  sheetImageFile = null;
  sheetLocation  = null;
  sheetTextInput.value = '';
  sheetPhotoArea.classList.add('hidden');
  sheetLocationPill.classList.add('hidden');
  sheetSubmit.disabled = true;
}

sheetClose.addEventListener('click', closeSheet);

/* ═══════════════════════════════════════
   POST SHEET — CHAR COUNTER
═══════════════════════════════════════ */

sheetTextInput.addEventListener('input', () => {
  const len = sheetTextInput.value.length;
  sheetCharCounter.textContent = `${len} / ${CHAR_LIMIT}`;
  sheetCharCounter.classList.remove('char-near', 'char-over');
  if (len >= CHAR_LIMIT - 30) sheetCharCounter.classList.add('char-near');
  if (len >= CHAR_LIMIT)      sheetCharCounter.classList.add('char-over');
  updateSheetSubmitState();
});

function updateSheetSubmitState() {
  const hasText     = sheetTextInput.value.trim().length > 0;
  const hasPhoto    = !!sheetImageFile;
  const hasLocation = !!sheetLocation;

  if (sheetMode === 'text')     sheetSubmit.disabled = !hasText;
  if (sheetMode === 'photo')    sheetSubmit.disabled = !hasPhoto;
  if (sheetMode === 'location') sheetSubmit.disabled = !hasLocation;
}

/* ═══════════════════════════════════════
   POST SHEET — PHOTO HANDLING
═══════════════════════════════════════ */

sheetImageInput.addEventListener('change', () => {
  const file = sheetImageInput.files[0];
  if (!file) return;
  sheetImageFile = file;
  sheetPhotoPreview.src = URL.createObjectURL(file);
  sheetPhotoArea.classList.remove('hidden');
  updateSheetSubmitState();
});

sheetChangePhoto.addEventListener('click', () => {
  sheetImageInput.value = '';
  sheetImageInput.click();
});

/* ═══════════════════════════════════════
   LOCATION
═══════════════════════════════════════ */

async function fetchLocation() {
  if (!navigator.geolocation) {
    sheetLocationText.textContent = 'Geolocation not supported';
    return;
  }
  navigator.geolocation.getCurrentPosition(
    async ({ coords: { latitude: lat, longitude: lon } }) => {
      try {
        const res  = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );
        const data = await res.json();
        const city  = data.address.city || data.address.town || data.address.village || '';
        const state = data.address.state || '';
        sheetLocation = `${city}, ${state}`;
        sheetLocationText.textContent = sheetLocation;
        updateSheetSubmitState();
      } catch {
        sheetLocationText.textContent = 'Could not fetch location';
      }
    },
    () => { sheetLocationText.textContent = 'Location permission denied'; }
  );
}

/* ═══════════════════════════════════════
   POST SHEET — SUBMIT
═══════════════════════════════════════ */

sheetSubmit.addEventListener('click', async () => {
  const text = sheetTextInput.value.trim();

  sheetSubmit.disabled    = true;
  sheetSubmit.textContent = 'Posting…';

  try {
    let image_url = null;

    if (sheetImageFile) {
      const formData = new FormData();
      formData.append('file', sheetImageFile);
      formData.append('upload_preset', UPLOAD_PRESET);
      const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST', body: formData
      });
      const data = await res.json();
      image_url  = data.secure_url;
    }

    await supabase.from('posts').insert({
      user_id:      currentUser.id,
      display_name: currentProfile.display_name,
      text:         text || null,
      image_url,
      location:     sheetLocation || null
    });

    if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
    closeSheet();
  } catch {
    sheetSubmit.disabled    = false;
    sheetSubmit.textContent = 'Post';
    alert('Could not post. Please try again.');
  }
});

/* ═══════════════════════════════════════
   POST DETAIL — OPEN / CLOSE
═══════════════════════════════════════ */

function openDetail(postId) {
  const post = allPosts.find(p => p.id === postId);
  if (!post) return;

  currentDetailPostId = postId;
  currentDetailPost   = post;

  detailOverlay.style.transform  = '';
  detailOverlay.style.transition = '';

  renderDetailBody(post);
  loadComments(postId);
  subscribeCommentsRealtime(postId);

  detailOverlay.classList.remove('hidden');
  fabContainer.classList.add('hidden');
  document.body.style.overflow = 'hidden';
}

function closeDetail(skipAnimation = false) {
  function finish() {
    detailOverlay.classList.add('hidden');
    detailOverlay.style.transform  = '';
    detailOverlay.style.transition = '';
    document.body.style.overflow   = '';
    fabContainer.classList.remove('hidden');
    unsubscribeComments();
    currentDetailPostId = null;
    currentDetailPost   = null;
    commentInput.value  = '';
  }

  if (skipAnimation) { finish(); return; }

  detailOverlay.style.transition = 'transform 0.28s cubic-bezier(0.32, 0.72, 0, 1)';
  detailOverlay.style.transform  = 'translateX(100%)';
  setTimeout(finish, 280);
}

detailBack.addEventListener('click', () => closeDetail());

/* ═══════════════════════════════════════
   POST DETAIL — RENDER BODY
═══════════════════════════════════════ */

function renderDetailBody(post) {
  const isOwner  = currentUser && post.user_id === currentUser.id;
  const isMod    = currentUser && currentUser.email === MODERATOR_EMAIL;
  const canEdit   = isOwner;
  const canDelete = isOwner || isMod;

  const firstLetter = (post.display_name || '?').charAt(0).toUpperCase();
  const editedLabel = post.edited_at ? '<span class="edited-label">· edited</span>' : '';

  const upCount   = getVoteCount(post.id, 'up');
  const downCount = getVoteCount(post.id, 'down');
  const userVote  = getUserVote(post.id);
  const badges    = reactionBadgesHtml(post.id, true);

  // Build reaction breakdown
  const upVoters   = allVotes.filter(v => v.post_id === post.id && v.vote_type === 'up').map(v => v.display_name || 'Someone');
  const downVoters = allVotes.filter(v => v.post_id === post.id && v.vote_type === 'down').map(v => v.display_name || 'Someone');
  const emojiMap   = {};
  getPostReactions(post.id).forEach(r => {
    if (!emojiMap[r.emoji]) emojiMap[r.emoji] = [];
    emojiMap[r.emoji].push(r.display_name || 'Someone');
  });

  const hasActivity = upVoters.length > 0 || downVoters.length > 0 || Object.keys(emojiMap).length > 0;
  const breakdownHtml = hasActivity ? `
    <div class="reactions-breakdown">
      <button class="reactions-toggle">
        <span class="reactions-toggle-summary">${[
          upVoters.length   > 0 ? `👍 ${upVoters.length}`   : '',
          downVoters.length > 0 ? `👎 ${downVoters.length}` : '',
          ...Object.entries(emojiMap).map(([e, n]) => `${e} ${n.length}`)
        ].filter(Boolean).join('  ')}</span>
        <span class="reactions-toggle-label">See who reacted ▾</span>
      </button>
      <div class="reactions-detail hidden">
        ${upVoters.length > 0 ? `<div class="reaction-row"><span class="reaction-row-emoji">👍</span><span class="reaction-row-names">${esc(upVoters.join(', '))}</span></div>` : ''}
        ${downVoters.length > 0 ? `<div class="reaction-row"><span class="reaction-row-emoji">👎</span><span class="reaction-row-names">${esc(downVoters.join(', '))}</span></div>` : ''}
        ${Object.entries(emojiMap).map(([e, names]) => `<div class="reaction-row"><span class="reaction-row-emoji">${e}</span><span class="reaction-row-names">${esc(names.join(', '))}</span></div>`).join('')}
      </div>
    </div>
  ` : '';

  detailBody.innerHTML = `
    <div class="detail-post">
      <div class="post-header">
        <div class="post-user">
          <div class="avatar">${esc(firstLetter)}</div>
          <div>
            <div class="username">${esc(post.display_name)}</div>
            <div class="timestamp">${fullTimestamp(post.created_at)} ${editedLabel}</div>
          </div>
        </div>
        <div class="post-owner-actions">
          ${canEdit   ? `<button class="owner-btn edit-btn"   aria-label="Edit">${ICON.pencil}</button>`  : ''}
          ${canDelete ? `<button class="owner-btn delete-btn" aria-label="Delete">${ICON.trash}</button>` : ''}
        </div>
      </div>
      ${post.location  ? `<div class="location-pill">📍 ${esc(post.location)}</div>` : ''}
      ${post.text      ? `<div class="text">${esc(post.text)}</div>` : ''}
      ${post.image_url ? `<img src="${esc(post.image_url)}" class="detail-image" />` : ''}
      <div class="detail-votes">
        <button class="vote-btn detail-upvote${userVote?.vote_type === 'up'   ? ' vote-active vote-up'   : ''}">${ICON.thumbsUp}   <span>${upCount}</span></button>
        <button class="vote-btn detail-downvote${userVote?.vote_type === 'down' ? ' vote-active vote-down' : ''}">${ICON.thumbsDown} <span>${downCount}</span></button>
        <button class="emoji-trigger-btn" aria-label="Add reaction">😊</button>
        ${badges ? `<div class="reaction-badges">${badges}</div>` : ''}
        <button class="vote-btn share-btn">${ICON.share} Share</button>
      </div>
      ${breakdownHtml}
    </div>
  `;

  if (canEdit)   detailBody.querySelector('.edit-btn').addEventListener('click', () => renderDetailBodyEdit(post));
  if (canDelete) detailBody.querySelector('.delete-btn').addEventListener('click', () => deletePost(post.id));

  detailBody.querySelector('.detail-upvote').addEventListener('click', () => castVote(post.id, 'up'));
  detailBody.querySelector('.detail-downvote').addEventListener('click', () => castVote(post.id, 'down'));
  detailBody.querySelector('.emoji-trigger-btn').addEventListener('click', e => openEmojiPicker(post.id, e.currentTarget));

  if (hasActivity) {
    const toggle = detailBody.querySelector('.reactions-toggle');
    const detail = detailBody.querySelector('.reactions-detail');
    const label  = toggle.querySelector('.reactions-toggle-label');
    toggle.addEventListener('click', () => {
      const open = detail.classList.toggle('hidden');
      label.textContent = open ? 'See who reacted ▾' : 'Hide ▴';
    });
  }

  const shareBtn = detailBody.querySelector('.share-btn');
  if (navigator.share) {
    shareBtn.addEventListener('click', async () => {
      try {
        await navigator.share({ title: `${post.display_name} on Tiny Path`, text: post.text || '', url: window.location.href });
      } catch {}
    });
  } else {
    shareBtn.style.display = 'none';
  }

  if (post.image_url) {
    detailBody.querySelector('.detail-image').addEventListener('click', () => openImageModal(post.image_url));
  }
}

/* ═══════════════════════════════════════
   POST DETAIL — EDIT
═══════════════════════════════════════ */

function renderDetailBodyEdit(post) {
  const firstLetter = (post.display_name || '?').charAt(0).toUpperCase();

  detailBody.innerHTML = `
    <div class="detail-post">
      <div class="post-header">
        <div class="post-user">
          <div class="avatar">${esc(firstLetter)}</div>
          <div>
            <div class="username">${esc(post.display_name)}</div>
            <div class="timestamp">${fullTimestamp(post.created_at)}</div>
          </div>
        </div>
      </div>
      ${post.location ? `<div class="location-pill">📍 ${esc(post.location)}</div>` : ''}
      <textarea id="editTextarea" class="edit-textarea">${esc(post.text || '')}</textarea>
      <div class="edit-actions">
        <button id="cancelEdit" class="cancel-edit-btn">Cancel</button>
        <button id="saveEdit"   class="save-edit-btn">Save</button>
      </div>
      ${post.image_url ? `<img src="${esc(post.image_url)}" class="detail-image" />` : ''}
    </div>
  `;

  const textarea  = document.getElementById('editTextarea');
  const saveBtn   = document.getElementById('saveEdit');
  const cancelBtn = document.getElementById('cancelEdit');

  textarea.focus();
  textarea.setSelectionRange(textarea.value.length, textarea.value.length);

  cancelBtn.addEventListener('click', () => renderDetailBody(post));

  saveBtn.addEventListener('click', async () => {
    const newText = textarea.value.trim();
    if (!newText) return;
    saveBtn.disabled    = true;
    saveBtn.textContent = 'Saving…';
    const { error } = await supabase
      .from('posts')
      .update({ text: newText, edited_at: new Date().toISOString() })
      .eq('id', post.id);
    if (error) {
      saveBtn.disabled    = false;
      saveBtn.textContent = 'Save';
      alert('Could not save. Try again.');
    }
  });

  if (post.image_url) {
    detailBody.querySelector('.detail-image').addEventListener('click', () => openImageModal(post.image_url));
  }
}

/* ═══════════════════════════════════════
   POST DELETE
═══════════════════════════════════════ */

async function deletePost(postId) {
  if (!confirm('Delete this post? This cannot be undone.')) return;
  await supabase.from('posts').delete().eq('id', postId);
}

/* ═══════════════════════════════════════
   COMMENTS — LOAD + REALTIME
═══════════════════════════════════════ */

async function loadComments(postId) {
  commentList.innerHTML = '<p class="no-comments">Loading…</p>';
  const { data } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  allComments = data || [];
  renderComments();
}

function subscribeCommentsRealtime(postId) {
  commentsChannel = supabase
    .channel(`comments:${postId}`)
    .on('postgres_changes', {
      event: 'INSERT', schema: 'public', table: 'comments',
      filter: `post_id=eq.${postId}`
    }, ({ new: comment }) => {
      if (!allComments.find(c => c.id === comment.id)) {
        allComments.push(comment);
        renderComments();
      }
    })
    .subscribe();
}

function unsubscribeComments() {
  if (commentsChannel) { supabase.removeChannel(commentsChannel); commentsChannel = null; }
  allComments = [];
}

function renderComments() {
  commentList.innerHTML = '';
  if (allComments.length === 0) {
    commentList.innerHTML = '<p class="no-comments">No comments yet — say something!</p>';
    return;
  }
  allComments.forEach(c => {
    const el = document.createElement('div');
    el.className = 'comment';
    el.innerHTML = `<span class="comment-user">${esc(c.display_name)}</span><span class="comment-text">${esc(c.text)}</span>`;
    commentList.appendChild(el);
  });
  commentList.scrollTop = commentList.scrollHeight;
}

async function submitComment() {
  const text = commentInput.value.trim();
  if (!text || !currentDetailPostId) return;
  commentInput.value = '';
  await supabase.from('comments').insert({
    post_id:      currentDetailPostId,
    user_id:      currentUser.id,
    display_name: currentProfile.display_name,
    text
  });
}

commentSubmit.addEventListener('click', submitComment);
commentInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') submitComment();
});

/* ═══════════════════════════════════════
   SWIPE RIGHT TO CLOSE DETAIL
═══════════════════════════════════════ */

let swipeStartX  = 0;
let swipeStartY  = 0;
let isSwiping    = false;
let swipeDecided = false;

detailOverlay.addEventListener('touchstart', e => {
  swipeStartX  = e.touches[0].clientX;
  swipeStartY  = e.touches[0].clientY;
  isSwiping    = false;
  swipeDecided = false;
  detailOverlay.style.transition = 'none';
}, { passive: true });

detailOverlay.addEventListener('touchmove', e => {
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

detailOverlay.addEventListener('touchend', e => {
  if (!swipeDecided) return;
  const dx       = e.changedTouches[0].clientX - swipeStartX;
  const wasSwipe = isSwiping;
  swipeDecided   = false;
  isSwiping      = false;
  if (!wasSwipe) { detailOverlay.style.transition = ''; return; }
  detailOverlay.style.transition = 'transform 0.28s cubic-bezier(0.32, 0.72, 0, 1)';
  if (dx > 80) {
    detailOverlay.style.transform = 'translateX(110%)';
    setTimeout(() => closeDetail(true), 260);
  } else {
    detailOverlay.style.transform = '';
    setTimeout(() => { detailOverlay.style.transition = ''; }, 300);
  }
}, { passive: true });

/* ═══════════════════════════════════════
   SETTINGS
═══════════════════════════════════════ */

function openSettingsModal() {
  settingsDisplayName.value = currentProfile?.display_name || '';
  settingsModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeSettingsModal() {
  settingsModal.classList.add('hidden');
  if (!currentDetailPostId) document.body.style.overflow = '';
}

settingsBtn.addEventListener('click', openSettingsModal);
closeSettings.addEventListener('click', closeSettingsModal);
settingsModal.addEventListener('click', e => {
  if (e.target === settingsModal) closeSettingsModal();
});

saveDisplayName.addEventListener('click', async () => {
  const newName = settingsDisplayName.value.trim();
  if (!newName || newName === currentProfile.display_name) return;
  saveDisplayName.disabled    = true;
  saveDisplayName.textContent = 'Saving…';
  const { error } = await supabase
    .from('profiles').update({ display_name: newName }).eq('id', currentUser.id);
  saveDisplayName.disabled    = false;
  saveDisplayName.textContent = error ? 'Save' : 'Saved ✓';
  if (!error) {
    currentProfile.display_name = newName;
    setTimeout(() => { saveDisplayName.textContent = 'Save'; }, 2000);
  }
});

logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();
});

/* ═══════════════════════════════════════
   IMAGE MODAL
═══════════════════════════════════════ */

function openImageModal(src) {
  modalImage.src = src;
  imageModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeImageModal() {
  imageModal.classList.add('hidden');
  modalImage.src = '';
  if (!currentDetailPostId) document.body.style.overflow = '';
}

closeModal.addEventListener('click', closeImageModal);
imageModal.addEventListener('click', e => {
  if (e.target === imageModal) closeImageModal();
});

/* ═══════════════════════════════════════
   iOS SAFARI — PREVENT INPUT ZOOM
═══════════════════════════════════════ */

const viewportMeta = document.querySelector('meta[name=viewport]');
const baseViewport = viewportMeta.content;

[commentInput, settingsDisplayName, sheetTextInput].forEach(input => {
  input.addEventListener('focus', () => {
    viewportMeta.content = baseViewport + ', maximum-scale=1';
  });
  input.addEventListener('blur', () => {
    viewportMeta.content = baseViewport;
  });
});

/* ═══════════════════════════════════════
   SERVICE WORKER
═══════════════════════════════════════ */

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}
