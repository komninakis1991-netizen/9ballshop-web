/* ============================================================
   NOTIFICATIONS COMPONENT — 9BallShop Community
   ============================================================
   Drop-in notification bell with Supabase queries, Realtime
   subscription, mark-as-read, and time-ago formatting.

   Requires:
     - supabase-client.js loaded (provides `supabase`, `getSession`)
     - notifications.css loaded

   HTML (place inside .nav-right):

     <div class="notif-wrap" id="notifWrap">
       <button class="notif-bell" id="notifBell" type="button" aria-label="Notifications">
         🔔
         <span class="notif-badge" id="notifBadge" style="display:none">0</span>
       </button>
       <div class="notif-dropdown" id="notifDropdown"></div>
     </div>
   ============================================================ */

(function () {
  'use strict';

  var MAX_ITEMS = 20;

  // ── DOM refs ──
  var bell, badge, dropdown, wrap;

  // ── State ──
  var isOpen        = false;
  var userId        = null;
  var notifications = [];
  var channel       = null;


  // ── Helpers ────────────────────────────────

  function esc(s) {
    if (!s) return '';
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function timeAgo(dateStr) {
    var now  = Date.now();
    var then = new Date(dateStr).getTime();
    var diff = Math.max(0, now - then);

    var secs = Math.floor(diff / 1000);
    if (secs < 60)   return 'just now';
    var mins = Math.floor(secs / 60);
    if (mins < 60)   return mins + 'm ago';
    var hrs  = Math.floor(mins / 60);
    if (hrs < 24)    return hrs + 'h ago';
    var days = Math.floor(hrs / 24);
    if (days < 7)    return days + 'd ago';
    var weeks = Math.floor(days / 7);
    if (weeks < 5)   return weeks + 'w ago';
    var months = Math.floor(days / 30);
    if (months < 12) return months + 'mo ago';
    return Math.floor(days / 365) + 'y ago';
  }

  function typeIcon(type) {
    switch (type) {
      case 'reply':   return '💬';
      case 'like':    return '👍';
      case 'badge':   return '🏆';
      case 'mention': return '📣';
      default:        return '🔔';
    }
  }


  // ── Badge count ────────────────────────────

  function updateBadge() {
    var count = 0;
    for (var i = 0; i < notifications.length; i++) {
      if (!notifications[i].is_read) count++;
    }

    if (count > 0) {
      badge.textContent = count > 99 ? '99+' : count;
      badge.style.display = '';
    } else {
      badge.style.display = 'none';
    }
  }


  // ── Render dropdown ────────────────────────

  function render() {
    if (notifications.length === 0) {
      dropdown.innerHTML =
        '<div class="notif-header">' +
          '<span class="notif-header-title">Notifications</span>' +
        '</div>' +
        '<div class="notif-empty">' +
          '<div class="notif-empty-icon">🔔</div>' +
          '<div class="notif-empty-text">No notifications yet</div>' +
        '</div>';
      return;
    }

    var hasUnread = false;
    for (var i = 0; i < notifications.length; i++) {
      if (!notifications[i].is_read) { hasUnread = true; break; }
    }

    var html =
      '<div class="notif-header">' +
        '<span class="notif-header-title">Notifications</span>' +
        '<button class="notif-mark-read" id="notifMarkAll" type="button"' +
          (hasUnread ? '' : ' disabled') + '>Mark all read</button>' +
      '</div>' +
      '<div class="notif-list">';

    for (var j = 0; j < notifications.length; j++) {
      var n = notifications[j];
      var cls = 'notif-item' + (n.is_read ? '' : ' unread');
      var link = n.link || '#';

      html +=
        '<a href="' + esc(link) + '" class="' + cls + '" data-id="' + esc(n.id) + '">' +
          '<div class="notif-item-icon ' + esc(n.type) + '">' + typeIcon(n.type) + '</div>' +
          '<div class="notif-item-body">' +
            '<div class="notif-item-msg">' + esc(n.message) + '</div>' +
            '<div class="notif-item-time">' + timeAgo(n.created_at) + '</div>' +
          '</div>' +
          '<div class="notif-dot"></div>' +
        '</a>';
    }

    html += '</div>';

    dropdown.innerHTML = html;

    // Bind mark-all button
    var markBtn = document.getElementById('notifMarkAll');
    if (markBtn) {
      markBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        markAllRead();
      });
    }

    // Bind individual items
    var items = dropdown.querySelectorAll('.notif-item');
    for (var k = 0; k < items.length; k++) {
      items[k].addEventListener('click', function (e) {
        var id = this.getAttribute('data-id');
        markOneRead(id);
        // Let the link navigate naturally
      });
    }
  }


  // ── Fetch notifications ────────────────────

  function fetchNotifications() {
    if (!userId) return;

    supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(MAX_ITEMS)
      .then(function (res) {
        if (res.error) {
          console.error('Notifications fetch error:', res.error);
          return;
        }
        notifications = res.data || [];
        updateBadge();
        if (isOpen) render();
      });
  }


  // ── Mark as read ───────────────────────────

  function markOneRead(notifId) {
    // Optimistic update
    for (var i = 0; i < notifications.length; i++) {
      if (notifications[i].id === notifId) {
        notifications[i].is_read = true;
        break;
      }
    }
    updateBadge();
    if (isOpen) render();

    supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notifId)
      .then(function (res) {
        if (res.error) console.error('Mark read error:', res.error);
      });
  }

  function markAllRead() {
    // Optimistic update
    for (var i = 0; i < notifications.length; i++) {
      notifications[i].is_read = true;
    }
    updateBadge();
    if (isOpen) render();

    supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)
      .then(function (res) {
        if (res.error) console.error('Mark all read error:', res.error);
      });
  }


  // ── Dropdown open/close ────────────────────

  function openDropdown() {
    if (isOpen) return;
    render();
    dropdown.classList.add('open');
    isOpen = true;
  }

  function closeDropdown() {
    if (!isOpen) return;
    dropdown.classList.remove('open');
    isOpen = false;
  }

  function toggleDropdown() {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }


  // ── Realtime subscription ──────────────────

  function subscribeRealtime() {
    if (!userId || channel) return;

    channel = supabase
      .channel('notifications-' + userId)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: 'user_id=eq.' + userId
        },
        function (payload) {
          // Prepend new notification
          notifications.unshift(payload.new);

          // Trim to max
          if (notifications.length > MAX_ITEMS) {
            notifications = notifications.slice(0, MAX_ITEMS);
          }

          updateBadge();
          if (isOpen) render();

          // Ring the bell
          bell.classList.remove('ring');
          void bell.offsetWidth; // force reflow
          bell.classList.add('ring');

          // Pulse the badge
          badge.classList.remove('pulse');
          void badge.offsetWidth;
          badge.classList.add('pulse');
        }
      )
      .subscribe();
  }


  // ── Init ───────────────────────────────────

  function init() {
    bell     = document.getElementById('notifBell');
    badge    = document.getElementById('notifBadge');
    dropdown = document.getElementById('notifDropdown');
    wrap     = document.getElementById('notifWrap');

    if (!bell || !dropdown) return; // No notification bell on this page

    // Guard: supabase client must be loaded
    if (typeof supabase === 'undefined' || typeof getSession !== 'function') {
      console.warn('Notifications: supabase client not loaded');
      if (wrap) wrap.style.display = 'none';
      return;
    }

    // Check if user is logged in
    getSession().then(function (session) {
      if (!session || !session.user) {
        // Not logged in — hide the bell
        if (wrap) wrap.style.display = 'none';
        return;
      }

      userId = session.user.id;

      // Fetch initial notifications
      fetchNotifications();

      // Subscribe to realtime
      subscribeRealtime();

      // Refresh every 60s (catch-up for any missed realtime events)
      setInterval(fetchNotifications, 60000);
    });

    // Bell click
    bell.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleDropdown();
    });

    // Click outside to close
    document.addEventListener('click', function (e) {
      if (wrap && !wrap.contains(e.target)) {
        closeDropdown();
      }
    });

    // Escape to close
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
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
