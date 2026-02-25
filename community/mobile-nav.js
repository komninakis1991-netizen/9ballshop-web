/* ============================================================
   MOBILE NAVIGATION SYSTEM — 9BallShop Community
   ============================================================
   Drop-in: bottom tab bar, slide-out drawer, FAB,
   pull-to-refresh, and responsive helpers.

   Requires:
     - theme.js loaded (provides toggleTheme, getTheme)
     - mobile-nav.css loaded

   Usage:
     <link rel="stylesheet" href="mobile-nav.css">
     <script src="mobile-nav.js" defer></script>

   The script auto-injects the bottom tab bar, drawer,
   FAB, and pull-to-refresh elements into the DOM.
   It reads the current page URL to set active states.
   ============================================================ */

(function () {
  'use strict';

  // ── Configuration ──────────────────────────

  var TABS = [
    { icon: '🏠', label: 'Home',    href: '/'                          },
    { icon: '💬', label: 'Forum',   href: '/community/forum.html'      },
    { icon: '📚', label: 'Learn',   href: '/community/learn.html'      },
    { icon: '🔔', label: 'Alerts',  href: '#notifications', id: 'tabAlerts', action: 'notifications' },
    { icon: '👤', label: 'Profile', href: '/community/profile.html', action: 'profile' }
  ];

  var DRAWER_LINKS = [
    { icon: '🏠', label: 'Home',        href: '/'                                },
    { icon: '💬', label: 'Forum',       href: '/community/forum.html'            },
    { icon: '📚', label: 'Learn',       href: '/community/learn.html'            },
    { icon: '🏆', label: 'Events',      href: '/community/events.html'           },
    { icon: '🏢', label: 'Clubs',       href: '/community/clubs.html'            },
    { icon: '📊', label: 'Leaderboard', href: '/community/leaderboard.html'      },
    { icon: '🎱', label: 'Shot of the Week', href: '/community/shot-of-the-week.html' },
    '__divider__',
    { icon: '📜', label: 'Guidelines',  href: '/community/guidelines.html'       },
    { icon: 'ℹ️',  label: 'About',       href: '/community/about.html'            }
  ];

  var SOCIAL_LINKS = [
    { icon: '𝕏',  href: '#', title: 'Twitter / X'  },
    { icon: '📷', href: '#', title: 'Instagram'     },
    { icon: '📺', href: '#', title: 'YouTube'       }
  ];

  var PTR_THRESHOLD = 80;   // px to pull before refresh triggers
  var PTR_RESISTANCE = 2.5; // pull resistance factor

  // ── State ──
  var drawerOpen = false;
  var scrollTop  = 0;
  var ptrStartY  = 0;
  var ptrPulling = false;
  var ptrTriggered = false;

  // ── DOM refs (set during init) ──
  var drawer, drawerBackdrop, ptrHint;


  // ── Helpers ────────────────────────────────

  function esc(s) {
    if (!s) return '';
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function isActivePath(href) {
    var path = window.location.pathname;
    if (href === '/') return path === '/' || path === '/index.html';
    // Match exact or partial (e.g. /community/forum.html matches forum)
    return path === href || path.endsWith(href);
  }

  function isMobile() {
    return window.innerWidth < 768;
  }

  function isForumPage() {
    var path = window.location.pathname;
    return path.indexOf('forum') !== -1 || path.indexOf('category') !== -1;
  }


  // ── 1. BOTTOM TAB BAR ─────────────────────

  function createTabBar() {
    var nav = document.createElement('nav');
    nav.className = 'mobile-tabs';
    nav.setAttribute('aria-label', 'Main navigation');

    for (var i = 0; i < TABS.length; i++) {
      var tab = TABS[i];
      var a = document.createElement('a');
      a.href = tab.href;
      a.className = 'tab-item' + (isActivePath(tab.href) ? ' active' : '');
      if (tab.id) a.id = tab.id;

      a.innerHTML =
        '<span class="tab-icon">' + tab.icon + '</span>' +
        '<span class="tab-label">' + esc(tab.label) + '</span>';

      // Special tab actions
      if (tab.action === 'notifications') {
        a.addEventListener('click', function (e) {
          e.preventDefault();
          // Toggle the navbar notification bell if it exists
          var bellBtn = document.getElementById('notifBell');
          if (bellBtn) {
            bellBtn.click();
          }
        });
      } else if (tab.action === 'profile') {
        a.addEventListener('click', function (e) {
          e.preventDefault();
          // Navigate to current user's profile
          if (typeof getSession === 'function') {
            getSession().then(function (session) {
              if (session && session.user) {
                // Get username from profile
                if (typeof getProfile === 'function') {
                  getProfile(session.user.id).then(function (profile) {
                    if (profile && profile.username) {
                      window.location.href = '/community/profile.html?u=' + encodeURIComponent(profile.username);
                    } else {
                      window.location.href = '/community/profile.html?u=' + session.user.id;
                    }
                  });
                } else {
                  window.location.href = '/community/profile.html?u=' + session.user.id;
                }
              } else {
                window.location.href = '/community/login.html';
              }
            });
          } else {
            window.location.href = '/community/login.html';
          }
        });
      }

      nav.appendChild(a);
    }

    document.body.appendChild(nav);
  }


  // ── 2. SLIDE-OUT DRAWER ────────────────────

  function createDrawer() {
    // Backdrop
    drawerBackdrop = document.createElement('div');
    drawerBackdrop.className = 'drawer-backdrop';
    drawerBackdrop.addEventListener('click', closeDrawer);

    // Drawer panel
    drawer = document.createElement('aside');
    drawer.className = 'drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-label', 'Navigation menu');

    // Header
    var header =
      '<div class="drawer-header">' +
        '<span class="drawer-title">🎱 9BALL</span>' +
        '<button class="drawer-close" id="drawerClose" type="button" aria-label="Close menu">✕</button>' +
      '</div>';

    // Nav links
    var links = '<nav class="drawer-nav">';
    for (var i = 0; i < DRAWER_LINKS.length; i++) {
      var item = DRAWER_LINKS[i];
      if (item === '__divider__') {
        links += '<div class="drawer-divider"></div>';
        continue;
      }
      var active = isActivePath(item.href) ? ' active' : '';
      links +=
        '<a href="' + esc(item.href) + '" class="drawer-link' + active + '">' +
          '<span class="drawer-link-icon">' + item.icon + '</span>' +
          '<span>' + esc(item.label) + '</span>' +
        '</a>';
    }
    links += '</nav>';

    // Social
    var social = '<div class="drawer-social">';
    for (var j = 0; j < SOCIAL_LINKS.length; j++) {
      var s = SOCIAL_LINKS[j];
      social +=
        '<a href="' + esc(s.href) + '" class="drawer-social-link" title="' + esc(s.title) + '">' +
          s.icon +
        '</a>';
    }
    social += '</div>';

    // Footer toggles
    var footer =
      '<div class="drawer-footer">' +
        '<div class="drawer-toggle-group">' +
          '<button class="drawer-toggle-btn drawer-theme-toggle" type="button" aria-label="Toggle theme">' +
            '🌙 Theme' +
          '</button>' +
          '<button class="drawer-toggle-btn" id="drawerLangToggle" type="button">' +
            '🌐 EN' +
          '</button>' +
        '</div>' +
      '</div>';

    drawer.innerHTML = header + links + social + footer;

    document.body.appendChild(drawerBackdrop);
    document.body.appendChild(drawer);

    // Bind close button
    document.getElementById('drawerClose').addEventListener('click', closeDrawer);

    // Bind drawer theme toggle (separate from .theme-toggle to avoid theme.js overwriting label)
    var drawerThemeBtn = drawer.querySelector('.drawer-theme-toggle');
    if (drawerThemeBtn) {
      drawerThemeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (typeof toggleTheme === 'function') {
          toggleTheme();
        }
        // updateDrawerThemeBtn is called by the MutationObserver
      });
    }

    // Update theme toggle label
    updateDrawerThemeBtn();
  }

  function openDrawer() {
    if (drawerOpen) return;
    drawerOpen = true;

    // Save scroll position and lock body
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    document.body.classList.add('drawer-open');
    document.body.style.top = -scrollTop + 'px';

    drawerBackdrop.classList.add('open');
    // Force reflow before adding open class for animation
    void drawer.offsetWidth;
    drawer.classList.add('open');

    // Trap focus inside drawer
    drawer.focus();
  }

  function closeDrawer() {
    if (!drawerOpen) return;
    drawerOpen = false;

    drawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');

    // Unlock body
    document.body.classList.remove('drawer-open');
    document.body.style.top = '';
    window.scrollTo(0, scrollTop);
  }

  function updateDrawerThemeBtn() {
    var btn = drawer ? drawer.querySelector('.drawer-theme-toggle') : null;
    if (!btn) return;
    var theme = typeof getTheme === 'function' ? getTheme() : 'dark';
    btn.innerHTML = (theme === 'dark' ? '🌙' : '☀️') + ' Theme';
  }


  // ── 3. HAMBURGER BUTTON ────────────────────

  function createHamburger() {
    // Check if .nav-right or .nav-inner exists
    var navInner = document.querySelector('.nav-inner');
    if (!navInner) return;

    // Don't create if already exists
    if (navInner.querySelector('.nav-hamburger')) return;

    var btn = document.createElement('button');
    btn.className = 'nav-hamburger';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Open menu');
    btn.textContent = '☰';

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      openDrawer();
    });

    navInner.appendChild(btn);
  }


  // ── 4. FLOATING ACTION BUTTON ──────────────

  function createFAB() {
    // Only show on forum-related pages
    if (!isForumPage()) return;

    var fab = document.createElement('a');
    fab.className = 'fab';
    fab.href = '/community/new-thread.html';
    fab.setAttribute('aria-label', 'New thread');
    fab.textContent = '+';

    document.body.appendChild(fab);
  }


  // ── 5. PULL-TO-REFRESH ─────────────────────

  function createPTR() {
    // Only on forum pages, only mobile
    if (!isForumPage()) return;

    ptrHint = document.createElement('div');
    ptrHint.className = 'ptr-hint';
    ptrHint.id = 'ptrHint';
    ptrHint.innerHTML =
      '<div class="ptr-hint-inner">' +
        '<span class="ptr-arrow" id="ptrArrow">↓</span>' +
        '<span id="ptrText">Pull to refresh</span>' +
      '</div>';

    document.body.appendChild(ptrHint);

    // Touch events
    document.addEventListener('touchstart', ptrTouchStart, { passive: true });
    document.addEventListener('touchmove', ptrTouchMove, { passive: false });
    document.addEventListener('touchend', ptrTouchEnd, { passive: true });
  }

  function ptrTouchStart(e) {
    if (!isMobile()) return;
    // Only trigger at the very top of the page
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollY > 5) return;

    ptrStartY = e.touches[0].clientY;
    ptrPulling = true;
    ptrTriggered = false;
  }

  function ptrTouchMove(e) {
    if (!ptrPulling || !ptrHint) return;

    var currentY = e.touches[0].clientY;
    var pullDistance = (currentY - ptrStartY) / PTR_RESISTANCE;

    if (pullDistance < 0) {
      ptrPulling = false;
      return;
    }

    if (pullDistance > 10) {
      ptrHint.style.display = 'block';
      ptrHint.classList.add('visible');

      var textEl = document.getElementById('ptrText');
      if (pullDistance >= PTR_THRESHOLD) {
        ptrHint.classList.add('releasing');
        if (textEl) textEl.textContent = 'Release to refresh';
        ptrTriggered = true;
      } else {
        ptrHint.classList.remove('releasing');
        if (textEl) textEl.textContent = 'Pull to refresh';
        ptrTriggered = false;
      }

      // Slight resistance feel — don't scroll
      if (pullDistance > 15) {
        e.preventDefault();
      }
    }
  }

  function ptrTouchEnd() {
    if (!ptrPulling || !ptrHint) return;
    ptrPulling = false;

    if (ptrTriggered) {
      // Show spinner
      var textEl = document.getElementById('ptrText');
      var arrowEl = document.getElementById('ptrArrow');
      if (textEl) textEl.textContent = 'Refreshing...';
      if (arrowEl) arrowEl.innerHTML = '<span class="ptr-spinner"></span>';

      // Reload after brief delay for UX
      setTimeout(function () {
        window.location.reload();
      }, 400);
    } else {
      // Dismiss
      ptrHint.classList.remove('visible', 'releasing');
      setTimeout(function () {
        ptrHint.style.display = 'none';
      }, 200);
    }
  }


  // ── 6. NOTIFICATION COUNT SYNC ─────────────

  function syncNotifBadge() {
    // If notifications.js has set the badge count, mirror it to the tab
    var tabAlerts = document.getElementById('tabAlerts');
    if (!tabAlerts) return;

    var notifBadge = document.getElementById('notifBadge');
    if (notifBadge && notifBadge.style.display !== 'none') {
      var count = notifBadge.textContent;
      // Check if alert badge already exists
      var existing = tabAlerts.querySelector('.tab-alert-badge');
      if (existing) {
        existing.textContent = count;
      } else {
        var badge = document.createElement('span');
        badge.className = 'tab-alert-badge';
        badge.textContent = count;
        tabAlerts.appendChild(badge);
      }
    } else {
      // Remove badge if no unread
      var existing2 = tabAlerts ? tabAlerts.querySelector('.tab-alert-badge') : null;
      if (existing2) existing2.remove();
    }
  }


  // ── 7. KEYBOARD: Escape closes drawer ──────

  function handleKeydown(e) {
    if (e.key === 'Escape' && drawerOpen) {
      closeDrawer();
    }
  }


  // ── 8. THEME CHANGE OBSERVER ───────────────

  function observeThemeChange() {
    // Watch data-theme attribute changes on <html>
    var observer = new MutationObserver(function () {
      updateDrawerThemeBtn();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }


  // ── INIT ───────────────────────────────────

  function init() {
    createTabBar();
    createDrawer();
    createHamburger();
    createFAB();
    createPTR();

    document.addEventListener('keydown', handleKeydown);

    // Sync notification badges periodically
    setInterval(syncNotifBadge, 2000);
    syncNotifBadge();

    // Watch theme changes for drawer button
    observeThemeChange();

    // Disable old hamburger/mobile-menu if present
    var oldHamburger = document.getElementById('hamburger');
    if (oldHamburger) {
      oldHamburger.style.display = 'none';
    }
    var oldMobileMenu = document.getElementById('mobileMenu');
    if (oldMobileMenu) {
      oldMobileMenu.style.display = 'none';
    }
  }


  // ── Boot ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
