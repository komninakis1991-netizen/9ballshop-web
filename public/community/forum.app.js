<script>
/* ──────────────────────────────────────────────
   Forum Homepage
   ────────────────────────────────────────────── */

const categoriesList = document.getElementById('categoriesList');
const skeletonList   = document.getElementById('skeletonList');
const errorState     = document.getElementById('errorState');
const newThreadBtn   = document.getElementById('newThreadBtn');
const guestBanner    = document.getElementById('guestBanner');
const navRight       = document.getElementById('navRight');

// ── Auth state ──

async function initAuth() {
  const session = await getSession();

  if (session) {
    const profile = await getProfile(session.user.id);
    const name = profile?.username || session.user.email.split('@')[0];
    navRight.innerHTML = `
      <div class="nav-user">
        <div class="nav-avatar">${name.charAt(0).toUpperCase()}</div>
        <span class="nav-username">${escapeHtml(name)}</span>
        <a href="#" class="nav-link nav-logout" onclick="signOut(); return false;">Log Out</a>
      </div>`;
    newThreadBtn.style.display = 'inline-flex';
    guestBanner.style.display = 'none';
  } else {
    navRight.innerHTML = `
      <a href="login.html" class="nav-link">Log In</a>
      <a href="register.html" class="btn-join">Join Free</a>`;
    guestBanner.style.display = 'block';
  }
}

// ── Load stats ──

async function loadStats() {
  const { data, error } = await supabase.rpc('get_community_stats');
  if (error || !data || data.length === 0) return;

  const s = data[0];
  animateStat('statMembers',   s.total_members);
  animateStat('statThreads',   s.total_threads);
  animateStat('statPosts',     s.total_posts);
  animateStat('statCountries', s.total_countries);

  document.querySelectorAll('.skeleton-stat').forEach(el => el.classList.remove('skeleton-stat'));
}

function animateStat(id, target) {
  const el = document.getElementById(id);
  if (target === 0) { el.textContent = '0'; return; }

  let current = 0;
  const step = Math.max(1, Math.floor(target / 30));
  const interval = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(interval); }
    el.textContent = formatNumber(current);
  }, 25);
}

// ── Load categories ──

async function loadCategories() {
  const { data, error } = await supabase.rpc('get_categories_with_stats');

  if (error) {
    console.error('Failed to load categories:', error);
    skeletonList.style.display = 'none';
    errorState.style.display   = 'block';
    return;
  }

  let html = '';
  for (const cat of data) {
    html += renderCategory(cat);
  }

  categoriesList.innerHTML     = html;
  skeletonList.style.display   = 'none';
  categoriesList.style.display = 'block';
}

function renderCategory(cat) {
  const latestHtml = cat.latest_thread_title
    ? `<a href="thread.html?id=${cat.latest_thread_id}" class="latest-link" title="${escapeAttr(cat.latest_thread_title)}">
         ${escapeHtml(truncate(cat.latest_thread_title, 38))}
       </a>
       <span class="latest-meta">
         by <strong>${escapeHtml(cat.latest_thread_author)}</strong> · ${timeAgo(cat.latest_thread_created_at)}
       </span>`
    : `<span class="latest-empty">No threads yet</span>`;

  return `
    <a href="category.html?slug=${cat.slug}" class="category-card" style="--accent: ${cat.color}">
      <div class="cat-icon" style="background: ${cat.color}20; color: ${cat.color}">
        <span>${cat.icon}</span>
      </div>
      <div class="cat-info">
        <h3 class="cat-name">${escapeHtml(cat.name)}</h3>
        <p class="cat-desc">${escapeHtml(cat.description)}</p>
      </div>
      <div class="cat-stats">
        <div class="cat-stat">
          <span class="cat-stat-value">${formatNumber(cat.thread_count)}</span>
          <span class="cat-stat-label">Threads</span>
        </div>
        <div class="cat-stat">
          <span class="cat-stat-value">${formatNumber(cat.post_count)}</span>
          <span class="cat-stat-label">Posts</span>
        </div>
      </div>
      <div class="cat-latest">
        ${latestHtml}
      </div>
    </a>`;
}

// ── Utility functions ──

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60)    return 'just now';
  if (seconds < 3600)  return Math.floor(seconds / 60) + 'm ago';
  if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
  if (seconds < 604800) return Math.floor(seconds / 86400) + 'd ago';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

function truncate(str, max) {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, '&quot;');
}

// ── Init ──
initAuth();
loadStats();
loadCategories();