/* ============================================================
   9BALLSHOP COMMUNITY — Supabase Client & Auth Helpers
   ============================================================ */

// ---- Configuration ----
const SUPABASE_URL  = 'https://gsxjuehgweuingstekwa.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzeGp1ZWhnd2V1aW5nc3Rla3dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNjg3ODYsImV4cCI6MjA4NjY0NDc4Nn0.2d8Rs_Z48ieqbWkYpD27U5fXChVXetafdw0WvxV4VE0';

// ---- Initialise client ----
// CDN declares `var supabase` (the library); reassign it to the client instance.
supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

// ---- Shared utilities ----

function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ---- Auth helpers ----

async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) console.error('getProfile error:', error);
  return data;
}

async function guardAuth(requireAuth = true) {
  const session = await getSession();
  if (requireAuth && !session) {
    window.location.href = '/community/login.html';
    return null;
  }
  return session;
}

async function redirectIfLoggedIn(destination = '/community/forum.html') {
  const session = await getSession();
  if (session) {
    window.location.href = destination;
  }
}

async function signOut() {
  await supabase.auth.signOut();
  window.location.href = '/community/login.html';
}

// ---- Shared navbar auth ----
// Call from any page that has <div id="navRight">

async function initNavAuth() {
  var navRight = document.getElementById('navRight');
  if (!navRight) return null;

  var session = await getSession();

  if (session) {
    var profile = await getProfile(session.user.id);
    var name = profile?.username || session.user.email.split('@')[0];
    var initial = name.charAt(0).toUpperCase();
    navRight.innerHTML =
      '<a href="profile.html?user=' + encodeURIComponent(name) + '" class="nav-profile-link">' +
        '<span class="nav-avatar">' + initial + '</span>' +
        '<span class="nav-username">' + esc(name) + '</span>' +
      '</a>' +
      '<a href="#" class="nav-link nav-logout" onclick="signOut(); return false;">Log Out</a>';
  } else {
    navRight.innerHTML =
      '<a href="login.html" class="nav-link">Log In</a>' +
      '<a href="register.html" class="btn-join">Join Free</a>';
  }

  return session;
}

// ---- Mobile hamburger ----

function initHamburger() {
  var btn = document.getElementById('hamburger');
  var menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', function() {
    var isOpen = menu.classList.toggle('open');
    btn.textContent = isOpen ? '\u2715' : '\u2630';
    btn.setAttribute('aria-expanded', isOpen);
  });

  menu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      menu.classList.remove('open');
      btn.textContent = '\u2630';
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

// ---- Inline SVG helpers for error/success icons ----

var icons = {
  error: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"/></svg>',
  success: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>',
  fieldError: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>'
};

// ---- UI helpers ----

function showAlert(id, type, message) {
  var el = document.getElementById(id);
  if (!el) return;
  el.className = 'alert alert-' + type + ' visible';
  el.innerHTML = icons[type === 'error' ? 'error' : 'success'] + '<span>' + message + '</span>';
}

function hideAlert(id) {
  var el = document.getElementById(id);
  if (el) el.className = 'alert';
}

function showFieldError(inputEl, errorEl, message) {
  inputEl.classList.add('error');
  errorEl.innerHTML = icons.fieldError + '<span>' + message + '</span>';
  errorEl.classList.add('visible');
}

function clearFieldError(inputEl, errorEl) {
  inputEl.classList.remove('error');
  errorEl.classList.remove('visible');
}

function setLoading(btn, loading) {
  btn.disabled = loading;
  btn.classList.toggle('loading', loading);
}
