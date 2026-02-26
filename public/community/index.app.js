/* ──────────────────────────────────────────────
   Landing Homepage
   ────────────────────────────────────────────── */

const $ = id => document.getElementById(id);

// ── State ──
let currentLang = 'en';
let statsAnimated = false;


// ═══════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════

async function initAuth() {
  const session = await getSession();
  if (!session) return;

  const profile = await getProfile(session.user.id);
  const name = profile?.username || session.user.email.split('@')[0];
  const initial = name.charAt(0).toUpperCase();

  // Replace "Join Free" with user info
  const navRight = $('navRight');
  const joinBtn = $('navJoinBtn');
  if (joinBtn) joinBtn.remove();

  // Insert user UI before theme toggle
  const userHtml = document.createElement('div');
  userHtml.className = 'nav-user';
  userHtml.innerHTML = `
    <a href="profile.html?u=${encodeURIComponent(name)}" class="nav-avatar">${esc(initial)}</a>
    <a href="profile.html?u=${encodeURIComponent(name)}" class="nav-username">${esc(name)}</a>
    <a href="#" class="nav-link nav-logout" onclick="signOut();return false;">Log Out</a>`;
  navRight.appendChild(userHtml);

  // Update hero CTA
  const heroJoin = document.querySelector('.btn-hero-primary');
  if (heroJoin) {
    heroJoin.href = 'forum.html';
    heroJoin.textContent = 'Go to Forum →';
  }
}


// ═══════════════════════════════════════════════
// COMMUNITY STATS
// ═══════════════════════════════════════════════

async function loadStats() {
  const results = await Promise.allSettled([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('threads').select('id', { count: 'exact', head: true }),
    supabase.from('posts').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('country'),
  ]);

  const members   = results[0].status === 'fulfilled' ? (results[0].value.count || 0) : 0;
  const threads   = results[1].status === 'fulfilled' ? (results[1].value.count || 0) : 0;
  const posts     = results[2].status === 'fulfilled' ? (results[2].value.count || 0) : 0;

  let countries = 0;
  if (results[3].status === 'fulfilled' && results[3].value.data) {
    const unique = new Set(results[3].value.data.map(r => r.country).filter(Boolean));
    countries = unique.size;
  }

  // Store targets for animation on scroll
  window._statTargets = { members, threads, posts, countries };
}

function animateStats() {
  if (statsAnimated) return;
  statsAnimated = true;

  const t = window._statTargets || { members: 0, threads: 0, posts: 0, countries: 0 };
  animateCounter($('statMembers'),   t.members);
  animateCounter($('statThreads'),   t.threads);
  animateCounter($('statPosts'),     t.posts);
  animateCounter($('statCountries'), t.countries);
}

function animateCounter(el, target) {
  if (!el || target === 0) { if (el) el.textContent = '0'; return; }

  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = formatNumber(Math.floor(eased * target));
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function formatNumber(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}


// ═══════════════════════════════════════════════
// LATEST THREADS
// ═══════════════════════════════════════════════

async function loadThreads() {
  const { data, error } = await supabase
    .from('threads')
    .select('id, title, created_at, reply_count, profiles(username, avatar_url), categories(name, color, icon)')
    .order('created_at', { ascending: false })
    .limit(5);

  const grid = $('threadsGrid');

  if (error || !data || data.length === 0) {
    grid.innerHTML = '<div class="events-empty">No threads yet. Be the first to start a discussion!</div>';
    return;
  }

  grid.innerHTML = data.map(t => {
    const cat = t.categories || {};
    const author = t.profiles || {};
    const initial = (author.username || '?').charAt(0).toUpperCase();
    const catBg = cat.color ? hexToRgba(cat.color, 0.1) : 'rgba(255,255,255,0.04)';
    const catFg = cat.color || 'var(--text-dim)';

    return `
      <a href="thread.html?id=${t.id}" class="thread-row">
        <span class="thread-cat-badge" style="background:${catBg};color:${catFg}">
          ${cat.icon || '💬'} ${esc(cat.name || '')}
        </span>
        <div class="thread-info">
          <div class="thread-title-link">${esc(t.title)}</div>
          <div class="thread-meta">
            <span class="thread-author">
              <span class="thread-author-avatar">${esc(initial)}</span>
              ${esc(author.username || 'Unknown')}
            </span>
            <span>·</span>
            <span>${timeAgo(t.created_at)}</span>
          </div>
        </div>
        <span class="thread-replies">
          <svg viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H6l-4 4V5z"/></svg>
          ${t.reply_count || 0}
        </span>
      </a>`;
  }).join('');
}


// ═══════════════════════════════════════════════
// UPCOMING EVENTS
// ═══════════════════════════════════════════════

async function loadEvents() {
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gte('date_start', today)
    .order('date_start', { ascending: true })
    .limit(4);

  const grid = $('eventsGrid');

  if (error || !data || data.length === 0) {
    grid.innerHTML = '<div class="events-empty">No upcoming events. Check back soon!</div>';
    return;
  }

  grid.innerHTML = data.map(ev => {
    const d = new Date(ev.date_start);
    const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = d.getDate();
    const typeCls = 'type-' + (ev.event_type || 'open');
    const typeLabel = (ev.event_type || 'open').replace('_', ' ');

    return `
      <div class="event-card fade-in">
        <div class="event-date-badge">
          <span class="event-month">${month}</span>
          <span class="event-day">${day}</span>
        </div>
        <div class="event-name">${esc(ev.name)}</div>
        <div class="event-location">
          ${ev.country_flag || '📍'} ${esc(ev.location || 'TBA')}
        </div>
        <span class="event-type ${typeCls}">${typeLabel}</span>
      </div>`;
  }).join('');

  // Trigger fade-in for event cards
  requestAnimationFrame(() => {
    grid.querySelectorAll('.fade-in').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 100);
    });
  });
}


// ═══════════════════════════════════════════════
// NEWSLETTER
// ═══════════════════════════════════════════════

$('newsletterForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const emailInput = $('newsletterEmail');
  const btn = $('btnSubscribe');
  const msg = $('newsletterMsg');
  const email = emailInput.value.trim();

  if (!email) return;

  btn.disabled = true;
  btn.textContent = '…';

  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email });

  btn.disabled = false;
  btn.textContent = currentLang === 'el' ? 'Εγγραφή' : 'Subscribe';

  if (error) {
    if (error.code === '23505') {
      msg.textContent = currentLang === 'el' ? 'Αυτό το email είναι ήδη εγγεγραμμένο!' : 'You\'re already subscribed!';
      msg.className = 'newsletter-msg visible success';
    } else {
      msg.textContent = error.message || 'Something went wrong.';
      msg.className = 'newsletter-msg visible error';
    }
    return;
  }

  emailInput.value = '';
  msg.textContent = currentLang === 'el' ? 'Εγγραφήκατε! 🎱' : 'You\'re in! Welcome to the community 🎱';
  msg.className = 'newsletter-msg visible success';
});


// ═══════════════════════════════════════════════
// NAVBAR — Scroll, Hamburger
// ═══════════════════════════════════════════════

// Sticky scroll shadow
window.addEventListener('scroll', () => {
  $('navbar').classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// Hamburger
$('hamburger').addEventListener('click', () => {
  $('mobileMenu').classList.toggle('open');
});

function closeMobile() {
  $('mobileMenu').classList.remove('open');
}


// ═══════════════════════════════════════════════
// LANGUAGE TOGGLE
// ═══════════════════════════════════════════════

function setLang(lang) {
  currentLang = lang;
  const flag = lang === 'el' ? '🇬🇷' : '🇬🇧';
  $('langToggle').textContent = flag;
  const mob = $('langToggleMobile');
  if (mob) mob.textContent = flag;

  document.querySelectorAll('[data-' + lang + ']').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (val) el.innerHTML = val;
  });
}

$('langToggle').addEventListener('click', () => {
  setLang(currentLang === 'en' ? 'el' : 'en');
});

const mobLang = $('langToggleMobile');
if (mobLang) mobLang.addEventListener('click', () => {
  setLang(currentLang === 'en' ? 'el' : 'en');
});


// ═══════════════════════════════════════════════
// THEME TOGGLE (placeholder — page is dark-first)
// ═══════════════════════════════════════════════

let darkMode = true;

function toggleTheme() {
  darkMode = !darkMode;
  const icon = darkMode ? '🌙' : '☀️';
  $('themeToggle').textContent = icon;
  const mob = $('themeToggleMobile');
  if (mob) mob.textContent = icon;
  // Full light-theme implementation can be added via CSS variables swap
}

$('themeToggle').addEventListener('click', toggleTheme);
const mobTheme = $('themeToggleMobile');
if (mobTheme) mobTheme.addEventListener('click', toggleTheme);


// ═══════════════════════════════════════════════
// INTERSECTION OBSERVER — fade-in & stats animate
// ═══════════════════════════════════════════════

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Trigger stat counter animation when stats come into view
      if (entry.target.id === 'statsGrid') {
        animateStats();
      }

      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));


// ═══════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════

function esc(s) {
  if (!s) return '';
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function timeAgo(d) {
  if (!d) return '';
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  if (s < 604800) return Math.floor(s / 86400) + 'd ago';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function hexToRgba(hex, alpha) {
  if (!hex || hex.charAt(0) !== '#') return `rgba(100,100,100,${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}


// ═══════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════

(async () => {
  initAuth();
  loadStats();
  loadThreads();
  loadEvents();
})();
