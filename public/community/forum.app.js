/* ──────────────────────────────────────────────
   Forum Homepage
   ────────────────────────────────────────────── */

var categoriesList = document.getElementById('categoriesList');
var skeletonList   = document.getElementById('skeletonList');
var errorState     = document.getElementById('errorState');
var guestBanner    = document.getElementById('guestBanner');

// ── Auth state ──

async function initAuth() {
  var session = await initNavAuth();
  if (session) {
    guestBanner.style.display = 'none';
  } else {
    guestBanner.style.display = 'block';
  }
}

// ── Load stats ──

async function loadStats() {
  try {
    var result = await supabase.rpc('get_community_stats');
    if (result.error || !result.data || result.data.length === 0) return;

    var s = result.data[0];
    animateStat('statMembers',   s.total_members);
    animateStat('statThreads',   s.total_threads);
    animateStat('statPosts',     s.total_posts);
    animateStat('statCountries', s.total_countries);

    document.querySelectorAll('.skeleton-stat').forEach(function(el) {
      el.classList.remove('skeleton-stat');
    });
  } catch (e) {
    console.error('loadStats:', e);
  }
}

function animateStat(id, target) {
  var el = document.getElementById(id);
  if (!target || target === 0) { el.textContent = '0'; return; }

  var current = 0;
  var step = Math.max(1, Math.floor(target / 30));
  var interval = setInterval(function() {
    current += step;
    if (current >= target) { current = target; clearInterval(interval); }
    el.textContent = formatNumber(current);
  }, 25);
}

// ── Load categories ──

async function loadCategories() {
  try {
    var result = await supabase.rpc('get_categories_with_stats');

    if (result.error) {
      console.error('Failed to load categories:', result.error);
      skeletonList.style.display = 'none';
      errorState.style.display   = 'block';
      return;
    }

    var html = '';
    for (var i = 0; i < result.data.length; i++) {
      html += renderCategory(result.data[i]);
    }

    categoriesList.innerHTML     = html;
    skeletonList.style.display   = 'none';
    categoriesList.style.display = 'block';
  } catch (e) {
    console.error('loadCategories:', e);
    skeletonList.style.display = 'none';
    errorState.style.display   = 'block';
  }
}

function renderCategory(cat) {
  var latestHtml = cat.latest_thread_title
    ? '<a href="thread.html?id=' + cat.latest_thread_id + '" class="latest-link" title="' + esc(cat.latest_thread_title) + '">' +
         esc(truncate(cat.latest_thread_title, 38)) +
      '</a>' +
      '<span class="latest-meta">' +
        'by <strong>' + esc(cat.latest_thread_author) + '</strong> &middot; ' + timeAgo(cat.latest_thread_created_at) +
      '</span>'
    : '<span class="latest-empty">No threads yet</span>';

  return '' +
    '<a href="category.html?slug=' + cat.slug + '" class="category-card" style="--accent: ' + cat.color + '">' +
      '<div class="cat-icon" style="background: ' + cat.color + '20; color: ' + cat.color + '">' +
        '<span>' + cat.icon + '</span>' +
      '</div>' +
      '<div class="cat-info">' +
        '<h3 class="cat-name">' + esc(cat.name) + '</h3>' +
        '<p class="cat-desc">' + esc(cat.description) + '</p>' +
      '</div>' +
      '<div class="cat-stats">' +
        '<div class="cat-stat">' +
          '<span class="cat-stat-value">' + formatNumber(cat.thread_count) + '</span>' +
          '<span class="cat-stat-label">Threads</span>' +
        '</div>' +
        '<div class="cat-stat">' +
          '<span class="cat-stat-value">' + formatNumber(cat.post_count) + '</span>' +
          '<span class="cat-stat-label">Posts</span>' +
        '</div>' +
      '</div>' +
      '<div class="cat-latest">' + latestHtml + '</div>' +
    '</a>';
}

// ── Utility functions ──

function timeAgo(dateStr) {
  if (!dateStr) return '';
  var seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
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
  return str.length > max ? str.slice(0, max) + '\u2026' : str;
}

// ── Init ──
initAuth();
loadStats();
loadCategories();
initHamburger();
