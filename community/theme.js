/* ============================================================
   THEME SYSTEM — 9BallShop Community
   ============================================================
   Manages dark/light theme switching with localStorage persistence.

   Usage:
     <link rel="stylesheet" href="theme.css">
     <script src="theme.js"></script>

     <!-- Toggle button (place in navbar): -->
     <button class="theme-toggle" id="themeToggle" type="button" aria-label="Toggle theme"></button>

   API:
     getTheme()        → 'dark' | 'light'
     setTheme(theme)   → applies theme, saves to localStorage
     toggleTheme()     → switches between dark ↔ light
   ============================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = '9ball-theme';
  var TRANSITION_CLASS = 'theme-transition';
  var TRANSITION_MS = 300;

  // ── Read saved preference or OS preference ──
  function getPreferred() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  // ── Apply theme to document ──
  function applyTheme(theme, animate) {
    var root = document.documentElement;

    if (animate) {
      root.classList.add(TRANSITION_CLASS);
      setTimeout(function () {
        root.classList.remove(TRANSITION_CLASS);
      }, TRANSITION_MS);
    }

    root.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggles(theme);
  }

  // ── Update all toggle button icons on the page ──
  function updateToggles(theme) {
    var icon = theme === 'dark' ? '\u{1F319}' : '\u{2600}\uFE0F';
    var label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    var toggles = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < toggles.length; i++) {
      toggles[i].textContent = icon;
      toggles[i].setAttribute('aria-label', label);
      toggles[i].setAttribute('title', label);
    }
  }

  // ── Public API ──

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  }

  function setTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') return;
    applyTheme(theme, true);
  }

  function toggleTheme() {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  }

  // ── Initialize immediately (before DOM ready) ──
  // Prevents flash of wrong theme.
  applyTheme(getPreferred(), false);

  // ── Bind toggle buttons once DOM is ready ──
  function bindToggles() {
    document.addEventListener('click', function (e) {
      if (e.target.closest('.theme-toggle')) {
        e.preventDefault();
        toggleTheme();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindToggles);
  } else {
    bindToggles();
  }

  // ── Listen for OS-level preference changes ──
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
      // Only auto-switch if user hasn't explicitly chosen
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? 'light' : 'dark', true);
      }
    });
  }

  // ── Expose globally ──
  window.getTheme = getTheme;
  window.setTheme = setTheme;
  window.toggleTheme = toggleTheme;

})();
