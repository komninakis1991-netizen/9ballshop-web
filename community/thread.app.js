/* ──────────────────────────────────────────────
   Thread Detail Page
   ────────────────────────────────────────────── */

// ── State ──
let thread      = null;
let cat         = null;
let currentUser = null;
let userLikes   = new Set();   // post IDs the current user has liked
let realtimeCh  = null;
let quoteText   = '';

const threadId = new URLSearchParams(window.location.search).get('id');
if (!threadId) window.location.href = 'forum.html';

// ── DOM ──
const $       = id => document.getElementById(id);
const navRight      = $('navRight');
const threadTitle   = $('threadTitle');
const threadBadges  = $('threadBadges');
const opAvatar      = $('opAvatar');
const opName        = $('opName');
const metaDate      = $('metaDate');
const metaViews     = $('metaViews');
const metaReplies   = $('metaReplies');
const bcCategory    = $('bcCategory');
const bcThread      = $('bcThread');
const originalPost  = $('originalPost');
const repliesList   = $('repliesList');
const repliesDivider= $('repliesDivider');
const replyCountLabel = $('replyCountLabel');
const replySection  = $('replySection');
const guestPrompt   = $('guestPrompt');
const replyText     = $('replyText');
const postReplyBtn  = $('postReplyBtn');
const replyAlert    = $('replyAlert');
const quotePreview  = $('quotePreview');
const quoteName     = $('quoteName');
const quoteBody     = $('quoteBody');
const quoteRemove   = $('quoteRemove');
const realtimeInd   = $('realtimeIndicator');

// ── Auth ──

async function initAuth() {
  const session = await initNavAuth();
  if (session) {
    currentUser = session.user;
    replySection.style.display = 'block';
    guestPrompt.style.display  = 'none';
  } else {
    replySection.style.display = 'none';
    guestPrompt.style.display  = 'block';
  }
  initHamburger();
}

// ── Load thread ──

async function loadThread() {
  const { data, error } = await supabase
    .from('threads')
    .select('*, profiles(username, avatar_url, playing_level, fargo_rating, post_count, created_at), categories(name, slug, color, icon)')
    .eq('id', threadId)
    .single();

  if (error || !data) { window.location.href = 'forum.html'; return; }

  thread = data;
  cat    = data.categories;
  const author = data.profiles;

  document.title = `${data.title} — 9BallShop Community`;

  // Breadcrumb
  bcCategory.textContent = cat.name;
  bcCategory.href = `category.html?slug=${cat.slug}`;
  bcThread.textContent = truncate(data.title, 40);

  // Title + badges
  let badgesHtml = '';
  if (data.is_pinned) badgesHtml += '<span class="hero-badge badge-pinned">📌 Pinned</span>';
  if (data.is_solved) badgesHtml += '<span class="hero-badge badge-solved">✅ Solved</span>';
  if (data.is_locked) badgesHtml += '<span class="hero-badge badge-locked">🔒 Locked</span>';
  badgesHtml += `<a href="category.html?slug=${cat.slug}" class="hero-badge badge-category" style="--cat-color:${cat.color}">${cat.icon} ${esc(cat.name)}</a>`;
  threadBadges.innerHTML = badgesHtml;

  threadTitle.textContent = data.title;
  threadTitle.classList.remove('skeleton-text');

  // Meta bar
  const initial = (author?.username || '?').charAt(0).toUpperCase();
  opAvatar.textContent = initial;
  opAvatar.style.background = cat.color;
  opAvatar.classList.remove('skeleton-circle');
  opName.textContent = author?.username || 'Unknown';
  opName.classList.remove('skeleton-text-sm');
  metaDate.textContent = formatDate(data.created_at);
  metaViews.textContent = data.view_count;
  metaReplies.textContent = data.reply_count;

  // Original post
  originalPost.innerHTML = renderPost({
    id: '__OP__',
    body: data.body,
    author_id: data.author_id,
    profiles: author,
    created_at: data.created_at,
    likes_count: 0,
    is_solution: false,
  }, true);
  originalPost.classList.remove('skeleton-card');

  // Increment view
  supabase.rpc('increment_view_count', { p_thread_id: threadId });
}

// ── Load replies ──

async function loadReplies() {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(username, avatar_url, playing_level, fargo_rating, post_count, created_at)')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });

  if (error) { console.error('Failed to load replies:', error); return; }

  // Load current user's likes
  if (currentUser && data.length > 0) {
    const postIds = data.map(p => p.id);
    const { data: likeRows } = await supabase
      .from('likes')
      .select('post_id')
      .eq('user_id', currentUser.id)
      .in('post_id', postIds);
    userLikes = new Set((likeRows || []).map(l => l.post_id));
  }

  if (data.length > 0) {
    repliesDivider.style.display = 'flex';
    replyCountLabel.textContent = `${data.length} Repl${data.length === 1 ? 'y' : 'ies'}`;
    repliesList.innerHTML = data.map(p => renderPost(p, false)).join('');
  }
}

// ── Render a single post ──

function renderPost(post, isOp) {
  const p       = post.profiles || {};
  const name    = p.username || 'Unknown';
  const initial = name.charAt(0).toUpperCase();
  const color   = cat?.color || '#F5C518';
  const level   = formatLevel(p.playing_level);
  const joined  = p.created_at ? new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
  const fargo   = p.fargo_rating ? `<span class="sidebar-stat">Fargo: <strong>${p.fargo_rating}</strong></span>` : '';
  const liked   = userLikes.has(post.id);

  const solutionBanner = post.is_solution
    ? `<div class="solution-banner"><span>✅</span> Accepted Answer</div>`
    : '';

  const solutionBtn = (!isOp && currentUser && thread && currentUser.id === thread.author_id && !thread.is_solved && !post.is_solution)
    ? `<button class="action-btn action-solution" onclick="markSolution('${post.id}')"><span>✅</span> Mark as Solution</button>`
    : '';

  const likeSection = isOp ? '' : `
    <button class="action-btn action-like ${liked ? 'liked' : ''}" id="like-${post.id}" onclick="toggleLike('${post.id}')">
      <span class="like-icon">${liked ? '👍' : '👍'}</span>
      <span class="like-count" id="lc-${post.id}">${post.likes_count || 0}</span>
    </button>`;

  const replyBtn = (!isOp && currentUser && !thread?.is_locked)
    ? `<button class="action-btn action-reply" onclick="quoteReply('${esc(name)}', \`${escBacktick(truncate(post.body, 200))}\`)">💬 Reply</button>`
    : '';

  return `
    <div class="post-card ${isOp ? 'op-post' : ''} ${post.is_solution ? 'solution-post' : ''}" id="post-${post.id}">
      ${solutionBanner}
      <div class="post-layout">
        <aside class="post-sidebar">
          <div class="sidebar-avatar" style="background:${color}">${initial}</div>
          <strong class="sidebar-name">${esc(name)}</strong>
          <span class="sidebar-level level-${p.playing_level || 'beginner'}">${level}</span>
          ${fargo}
          <span class="sidebar-stat">${p.post_count || 0} posts</span>
          <span class="sidebar-stat sidebar-joined">Joined ${joined}</span>
        </aside>
        <div class="post-content">
          <div class="post-header">
            <span class="post-date">${timeAgo(post.created_at)}</span>
            ${isOp ? '<span class="op-badge">OP</span>' : ''}
          </div>
          <div class="post-body">${renderMarkdown(post.body)}</div>
          <div class="post-actions">
            ${likeSection}
            ${replyBtn}
            ${solutionBtn}
          </div>
        </div>
      </div>
    </div>`;
}

// ── Like toggle ──

async function toggleLike(postId) {
  if (!currentUser) { window.location.href = 'login.html'; return; }

  const btn   = document.getElementById('like-' + postId);
  const countEl = document.getElementById('lc-' + postId);
  if (!btn || !countEl) return;

  const isLiked = userLikes.has(postId);

  if (isLiked) {
    // Unlike — find and delete
    const { data: rows } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', currentUser.id)
      .eq('post_id', postId)
      .limit(1);

    if (rows && rows.length > 0) {
      await supabase.from('likes').delete().eq('id', rows[0].id);
    }
    userLikes.delete(postId);
    btn.classList.remove('liked');
    countEl.textContent = Math.max(0, parseInt(countEl.textContent) - 1);
  } else {
    // Like
    const { error } = await supabase.from('likes').insert({ user_id: currentUser.id, post_id: postId });
    if (error) { console.error('Like error:', error); return; }
    userLikes.add(postId);
    btn.classList.add('liked');
    countEl.textContent = parseInt(countEl.textContent) + 1;
  }
}

// ── Mark as solution ──

async function markSolution(postId) {
  if (!currentUser || currentUser.id !== thread.author_id) return;

  const { error: postErr } = await supabase
    .from('posts')
    .update({ is_solution: true })
    .eq('id', postId);

  const { error: threadErr } = await supabase
    .from('threads')
    .update({ is_solved: true, solved_post_id: postId })
    .eq('id', threadId);

  if (postErr || threadErr) {
    console.error('Mark solution error:', postErr || threadErr);
    return;
  }

  // Refresh the page to show changes
  location.reload();
}

// ── Quote / Reply ──

function quoteReply(author, text) {
  quoteName.textContent = author;
  quoteBody.textContent = text;
  quotePreview.style.display = 'block';
  quoteText = `> **${author}** wrote:\n> ${text.split('\n').join('\n> ')}\n\n`;
  replyText.focus();
  replyText.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

quoteRemove.addEventListener('click', () => {
  quotePreview.style.display = 'none';
  quoteText = '';
});

// ── Post reply ──

postReplyBtn.addEventListener('click', async () => {
  if (!currentUser) { window.location.href = 'login.html'; return; }

  const body = (quoteText + replyText.value).trim();
  if (!body || body.length < 2) {
    replyAlert.className = 'reply-alert alert-error visible';
    replyAlert.textContent = 'Please write something before posting.';
    return;
  }

  replyAlert.className = 'reply-alert';
  setLoading(postReplyBtn, true);

  const { data, error } = await supabase
    .from('posts')
    .insert({
      body: body,
      author_id: currentUser.id,
      thread_id: threadId,
    })
    .select('*, profiles(username, avatar_url, playing_level, fargo_rating, post_count, created_at)')
    .single();

  setLoading(postReplyBtn, false);

  if (error) {
    replyAlert.className = 'reply-alert alert-error visible';
    replyAlert.textContent = error.message || 'Failed to post reply.';
    return;
  }

  // Clear form
  replyText.value = '';
  quoteText = '';
  quotePreview.style.display = 'none';

  // Append new reply
  appendReply(data);

  // Update reply count in header
  const current = parseInt(metaReplies.textContent) || 0;
  metaReplies.textContent = current + 1;
  repliesDivider.style.display = 'flex';
  replyCountLabel.textContent = `${current + 1} Repl${current + 1 === 1 ? 'y' : 'ies'}`;
});

function appendReply(post) {
  const html = renderPost(post, false);
  repliesList.insertAdjacentHTML('beforeend', html);
  // Scroll to new post
  const newEl = document.getElementById('post-' + post.id);
  if (newEl) newEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ── Realtime subscription ──

function subscribeRealtime() {
  realtimeCh = supabase
    .channel('thread-' + threadId)
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'posts', filter: `thread_id=eq.${threadId}` },
      async (payload) => {
        const newPost = payload.new;
        // Don't duplicate if it's our own post (already appended)
        if (currentUser && newPost.author_id === currentUser.id) return;
        if (document.getElementById('post-' + newPost.id)) return;

        // Fetch with profile
        const { data } = await supabase
          .from('posts')
          .select('*, profiles(username, avatar_url, playing_level, fargo_rating, post_count, created_at)')
          .eq('id', newPost.id)
          .single();

        if (data) {
          appendReply(data);
          const current = parseInt(metaReplies.textContent) || 0;
          metaReplies.textContent = current + 1;
          replyCountLabel.textContent = `${current + 1} Repl${current + 1 === 1 ? 'y' : 'ies'}`;
        }
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        realtimeInd.style.display = 'flex';
      }
    });
}

// ── Minimal Markdown renderer ──

function renderMarkdown(text) {
  if (!text) return '';
  let html = esc(text);
  // Block quotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  // Line breaks
  html = html.replace(/\n/g, '<br>');
  // Merge consecutive blockquotes
  html = html.replace(/<\/blockquote><br><blockquote>/g, '<br>');
  return html;
}

// ── Utilities ──

function timeAgo(d) {
  if (!d) return '';
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s/60) + 'm ago';
  if (s < 86400) return Math.floor(s/3600) + 'h ago';
  if (s < 604800) return Math.floor(s/86400) + 'd ago';
  return new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric' });
}

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });
}

function formatLevel(l) {
  const map = { beginner:'Beginner', intermediate:'Intermediate', advanced:'Advanced', semi_pro:'Semi-Pro', professional:'Professional' };
  return map[l] || 'Beginner';
}

function truncate(s, n) { return s && s.length > n ? s.slice(0,n) + '…' : (s || ''); }

function esc(s) {
  if (!s) return '';
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function escBacktick(s) {
  return (s || '').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

// ── Init ──

(async () => {
  await initAuth();
  await loadThread();
  await loadReplies();
  subscribeRealtime();
})();