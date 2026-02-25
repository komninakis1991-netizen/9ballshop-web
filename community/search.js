/* ============================================================
   SEARCH COMPONENT — 9BallShop Community
   ============================================================
   Drop-in search with Supabase queries, keyboard navigation,
   recent searches in localStorage, and debounced input.

   Requires:
     - supabase-client.js loaded (provides `supabase` global)
     - search.css loaded

   HTML (place inside .nav-inner, between .nav-links and .nav-right):

     <div class="search-wrap" id="searchWrap">
       <div class="search-bar">
         <span class="search-icon">🔍</span>
         <input id="searchInput" type="text" class="search-input"
                placeholder="Search threads, players, clubs..."
                autocomplete="off" spellcheck="false">
         <kbd class="search-kbd" id="searchKbd">⌘K</kbd>
       </div>
       <div class="search-dropdown" id="searchDropdown"></div>
     </div>
   ============================================================ */

(function () {
  'use strict';

  var DEBOUNCE_MS   = 300;
  var STORAGE_KEY   = '9ball-recent-searches';
  var MAX_RECENT    = 5;
  var MIN_QUERY_LEN = 2;

  // ── DOM refs (deferred until ready) ──
  var input, dropdown, wrap;

  // ── State ──
  var debounceTimer  = null;
  var activeIndex    = -1;
  var currentResults = [];
  var isOpen         = false;


  // ── Helpers ──────────────────────────────────

  function esc(s) {
    if (!s) return '';
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function highlight(text, query) {
    if (!query || !text) return esc(text);
    var safe = esc(text);
    var re = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return safe.replace(re, '<span class="search-hl">$1</span>');
  }


  // ── Dropdown control ─────────────────────────

  function openDropdown() {
    if (isOpen) return;
    dropdown.classList.add('open');
    isOpen = true;
  }

  function closeDropdown() {
    if (!isOpen) return;
    dropdown.classList.remove('open');
    isOpen = false;
    activeIndex = -1;
    clearActive();
  }

  function clearActive() {
    var items = dropdown.querySelectorAll('.search-item, .search-recent-item');
    for (var i = 0; i < items.length; i++) {
      items[i].classList.remove('active');
    }
  }

  function setActive(idx) {
    clearActive();
    var items = dropdown.querySelectorAll('.search-item, .search-recent-item');
    if (idx >= 0 && idx < items.length) {
      items[idx].classList.add('active');
      items[idx].scrollIntoView({ block: 'nearest' });
    }
  }


  // ── Recent searches ──────────────────────────

  function getRecent() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) { return []; }
  }

  function saveRecent(query) {
    var q = query.trim();
    if (!q || q.length < MIN_QUERY_LEN) return;
    var list = getRecent().filter(function (s) { return s !== q; });
    list.unshift(q);
    if (list.length > MAX_RECENT) list = list.slice(0, MAX_RECENT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function clearRecent() {
    localStorage.removeItem(STORAGE_KEY);
    showRecent();
  }

  function showRecent() {
    var list = getRecent();
    if (list.length === 0) {
      dropdown.innerHTML = '';
      closeDropdown();
      return;
    }

    var html = '<div class="search-recent-header">' +
      '<span class="search-recent-label">Recent Searches</span>' +
      '<button class="search-recent-clear" type="button">Clear</button>' +
      '</div>';

    for (var i = 0; i < list.length; i++) {
      html += '<div class="search-recent-item" data-query="' + esc(list[i]) + '">' +
        '<span class="search-recent-item-icon">🕐</span>' +
        '<span>' + esc(list[i]) + '</span></div>';
    }

    dropdown.innerHTML = html;
    activeIndex = -1;
    openDropdown();

    // Bind clear button
    var clearBtn = dropdown.querySelector('.search-recent-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        clearRecent();
      });
    }

    // Bind recent items
    var items = dropdown.querySelectorAll('.search-recent-item');
    for (var j = 0; j < items.length; j++) {
      items[j].addEventListener('click', function () {
        var q = this.getAttribute('data-query');
        input.value = q;
        doSearch(q);
      });
    }
  }


  // ── Search queries ───────────────────────────

  function doSearch(query) {
    var q = query.trim();
    if (q.length < MIN_QUERY_LEN) {
      showRecent();
      return;
    }

    // Guard: supabase client must be loaded
    if (typeof supabase === 'undefined') {
      console.warn('Search: supabase client not loaded');
      return;
    }

    // Show loading
    dropdown.innerHTML = '<div class="search-loading"><div class="search-spinner"></div></div>';
    openDropdown();

    var pattern = '%' + q + '%';

    // Run all 3 queries in parallel
    Promise.all([
      supabase
        .from('threads')
        .select('id, title, categories(name, color)')
        .ilike('title', pattern)
        .order('last_activity_at', { ascending: false })
        .limit(5),
      supabase
        .from('profiles')
        .select('username, avatar_url, country_flag')
        .ilike('username', pattern)
        .limit(3),
      supabase
        .from('clubs')
        .select('id, name, city, country_flag')
        .ilike('name', pattern)
        .eq('approved', true)
        .limit(3),
    ]).then(function (results) {
      var threads  = (results[0].data || []);
      var profiles = (results[1].data || []);
      var clubs    = (results[2].data || []);

      // Check if input changed while waiting
      if (input.value.trim() !== q) return;

      currentResults = [];
      var html = '';

      // ── Threads ──
      if (threads.length > 0) {
        html += '<div class="search-group"><span class="search-group-icon">📋</span> Threads</div>';
        for (var i = 0; i < threads.length; i++) {
          var t = threads[i];
          var cat = t.categories || {};
          var catColor = cat.color || '#64748B';
          var catBg = catColor + '20';

          currentResults.push({ type: 'thread', url: 'thread.html?id=' + t.id });

          html += '<a href="thread.html?id=' + t.id + '" class="search-item">' +
            '<div class="search-item-icon thread">📋</div>' +
            '<div class="search-item-body">' +
            '<div class="search-item-title">' + highlight(t.title, q) + '</div>' +
            '</div>';

          if (cat.name) {
            html += '<span class="search-cat-badge" style="background:' + esc(catBg) + ';color:' + esc(catColor) + '">' + esc(cat.name) + '</span>';
          }
          html += '</a>';
        }
      }

      // ── Members ──
      if (profiles.length > 0) {
        html += '<div class="search-group"><span class="search-group-icon">👤</span> Members</div>';
        for (var j = 0; j < profiles.length; j++) {
          var p = profiles[j];
          var initial = (p.username || '?').charAt(0).toUpperCase();
          var flag = p.country_flag || '';

          currentResults.push({ type: 'profile', url: 'profile.html?u=' + encodeURIComponent(p.username) });

          html += '<a href="profile.html?u=' + encodeURIComponent(p.username) + '" class="search-item">';

          if (p.avatar_url) {
            html += '<img class="search-item-avatar" src="' + esc(p.avatar_url) + '" alt="" style="object-fit:cover">';
          } else {
            html += '<div class="search-item-avatar">' + esc(initial) + '</div>';
          }

          html += '<div class="search-item-body">' +
            '<div class="search-item-title">' + highlight(p.username, q) + '</div>' +
            '</div>';

          if (flag) {
            html += '<span style="font-size:1.1rem">' + esc(flag) + '</span>';
          }
          html += '</a>';
        }
      }

      // ── Clubs ──
      if (clubs.length > 0) {
        html += '<div class="search-group"><span class="search-group-icon">🏢</span> Clubs</div>';
        for (var k = 0; k < clubs.length; k++) {
          var c = clubs[k];

          currentResults.push({ type: 'club', url: 'clubs.html#' + c.id });

          html += '<a href="clubs.html#' + c.id + '" class="search-item">' +
            '<div class="search-item-icon">🏢</div>' +
            '<div class="search-item-body">' +
            '<div class="search-item-title">' + highlight(c.name, q) + '</div>' +
            '<div class="search-item-meta">' + esc(c.city || '') +
            (c.country_flag ? ' ' + esc(c.country_flag) : '') + '</div>' +
            '</div></a>';
        }
      }

      // ── No results ──
      if (threads.length === 0 && profiles.length === 0 && clubs.length === 0) {
        html = '<div class="search-empty">' +
          '<div class="search-empty-icon">🔍</div>' +
          '<div class="search-empty-text">No results for "' + esc(q) + '"</div>' +
          '<a href="forum.html" class="search-empty-link">Start a new thread →</a>' +
          '</div>';
      }

      dropdown.innerHTML = html;
      activeIndex = -1;
      openDropdown();

      // Save to recent
      if (threads.length > 0 || profiles.length > 0 || clubs.length > 0) {
        saveRecent(q);
      }

    }).catch(function (err) {
      console.error('Search error:', err);
      dropdown.innerHTML = '<div class="search-empty">' +
        '<div class="search-empty-text">Search failed. Try again.</div></div>';
      openDropdown();
    });
  }


  // ── Keyboard navigation ──────────────────────

  function handleKeydown(e) {
    if (!isOpen) return;

    var items = dropdown.querySelectorAll('.search-item, .search-recent-item');
    var count = items.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % count;
      setActive(activeIndex);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + count) % count;
      setActive(activeIndex);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < count) {
        var item = items[activeIndex];
        // Recent item — fill input and search
        var recentQuery = item.getAttribute('data-query');
        if (recentQuery) {
          input.value = recentQuery;
          doSearch(recentQuery);
        } else {
          // Result item — navigate
          var href = item.getAttribute('href');
          if (href) window.location.href = href;
        }
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeDropdown();
      input.blur();
    }
  }


  // ── Init ─────────────────────────────────────

  function init() {
    input    = document.getElementById('searchInput');
    dropdown = document.getElementById('searchDropdown');
    wrap     = document.getElementById('searchWrap');

    if (!input || !dropdown) return; // No search bar on this page

    // Update kbd hint based on platform
    var kbdEl = document.getElementById('searchKbd');
    if (kbdEl) {
      var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
      kbdEl.textContent = isMac ? '⌘K' : 'Ctrl+K';
    }

    // ── Input events ──
    input.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      var q = input.value.trim();
      if (q.length < MIN_QUERY_LEN) {
        if (q.length === 0) showRecent();
        else closeDropdown();
        return;
      }
      debounceTimer = setTimeout(function () { doSearch(q); }, DEBOUNCE_MS);
    });

    input.addEventListener('focus', function () {
      if (input.value.trim().length >= MIN_QUERY_LEN) {
        if (dropdown.innerHTML) openDropdown();
      } else {
        showRecent();
      }
    });

    input.addEventListener('keydown', handleKeydown);

    // ── Ctrl+K / Cmd+K shortcut ──
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        input.focus();
        input.select();
      }
    });

    // ── Click outside to close ──
    document.addEventListener('click', function (e) {
      if (wrap && !wrap.contains(e.target)) {
        closeDropdown();
      }
    });
  }

  // ── Boot ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
