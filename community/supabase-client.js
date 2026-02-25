/* ============================================================
   9BALLSHOP COMMUNITY — Supabase Client & Auth Helpers
   ============================================================ */

// ---- Configuration ----
// Replace these with your actual Supabase project values,
// or inject them at build time / from a config script.
const SUPABASE_URL  = 'https://gsxjuehgweuingstekwa.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzeGp1ZWhnd2V1aW5nc3Rla3dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNjg3ODYsImV4cCI6MjA4NjY0NDc4Nn0.2d8Rs_Z48ieqbWkYpD27U5fXChVXetafdw0WvxV4VE0';

// ---- Initialise client ----
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

// ---- Auth helpers ----

/**
 * Get the current session (null if not logged in).
 */
async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Get the current user's profile from the profiles table.
 */
async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) console.error('getProfile error:', error);
  return data;
}

/**
 * Redirect to /community/login.html if not logged in,
 * or to /community/forum.html if already logged in on auth pages.
 */
async function guardAuth(requireAuth = true) {
  const session = await getSession();

  if (requireAuth && !session) {
    window.location.href = '/community/login.html';
    return null;
  }

  return session;
}

/**
 * If user is already logged in, redirect away from auth pages.
 */
async function redirectIfLoggedIn(destination = '/community/forum.html') {
  const session = await getSession();
  if (session) {
    window.location.href = destination;
  }
}

/**
 * Sign out and redirect to login.
 */
async function signOut() {
  await supabase.auth.signOut();
  window.location.href = '/community/login.html';
}

// ---- Inline SVG helpers for error/success icons ----

const icons = {
  error: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"/></svg>`,
  success: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>`,
  fieldError: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>`,
};

// ---- UI helpers ----

function showAlert(id, type, message) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = `alert alert-${type} visible`;
  el.innerHTML = icons[type === 'error' ? 'error' : 'success'] + `<span>${message}</span>`;
}

function hideAlert(id) {
  const el = document.getElementById(id);
  if (el) el.className = 'alert';
}

function showFieldError(inputEl, errorEl, message) {
  inputEl.classList.add('error');
  errorEl.innerHTML = icons.fieldError + `<span>${message}</span>`;
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
