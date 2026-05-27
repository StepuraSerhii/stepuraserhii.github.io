/* =====================================================
   Mobile menu — robust handler
   - Closes menu on any nav link tap (including hash + cross-page)
   - Closes menu on outside-click and Escape key
   - Locks body scroll while menu is open (mobile only)
   - Adds .scrolled to .navbar on scroll (already in script.js;
     this is a safe duplicate guard, no-op if already attached)
   ===================================================== */

(function () {
  'use strict';

  function init() {
    var burger   = document.getElementById('burger');
    var navLinks = document.getElementById('navLinks');
    if (!burger || !navLinks) return;

    var navbar = document.querySelector('.navbar');
    var body   = document.body;

    // --- Toggle ---
    function openMenu() {
      navLinks.classList.add('active');
      burger.setAttribute('aria-expanded', 'true');
      body.classList.add('nav-open');
    }

    function closeMenu() {
      navLinks.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
      body.classList.remove('nav-open');
    }

    function toggleMenu(e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      if (navLinks.classList.contains('active')) closeMenu();
      else openMenu();
    }

    // Accessibility attrs
    burger.setAttribute('role', 'button');
    burger.setAttribute('tabindex', '0');
    burger.setAttribute('aria-controls', 'navLinks');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Меню');

    // Replace any existing click handler by cloning the node
    // (prevents double-toggle if script.js already attached one)
    var burgerClone = burger.cloneNode(true);
    burger.parentNode.replaceChild(burgerClone, burger);
    burger = burgerClone;

    burger.addEventListener('click', toggleMenu);
    burger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') toggleMenu(e);
    });

    // --- Close on any nav link click ---
    // Use delegation so it survives re-renders.
    navLinks.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a) return;

      // Close menu regardless of link type (hash / cross-page / external)
      closeMenu();

      // Smooth scroll for in-page hashes (browser default does this too,
      // but if a fixed navbar offset is desired we handle it explicitly).
      var href = a.getAttribute('href') || '';
      if (href.charAt(0) === '#' && href.length > 1) {
        var target = document.getElementById(href.slice(1));
        if (target) {
          e.preventDefault();
          // small delay so the menu collapse animation can start first
          setTimeout(function () {
            var navH = navbar ? navbar.offsetHeight : 0;
            var top  = target.getBoundingClientRect().top + window.pageYOffset - navH - 8;
            window.scrollTo({ top: top, behavior: 'smooth' });
            history.pushState(null, '', href);
          }, 60);
        }
      }
      // For cross-page links (api.html, index.html#form, etc.) we let
      // the browser navigate normally — no preventDefault.
    });

    // --- Close on outside click ---
    document.addEventListener('click', function (e) {
      if (!navLinks.classList.contains('active')) return;
      if (navLinks.contains(e.target)) return;
      if (burger.contains(e.target)) return;
      closeMenu();
    });

    // --- Close on Escape ---
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) closeMenu();
    });

    // --- Close menu if viewport grows past mobile breakpoint ---
    var mq = window.matchMedia('(min-width: 769px)');
    var onMQ = function () { if (mq.matches) closeMenu(); };
    if (mq.addEventListener) mq.addEventListener('change', onMQ);
    else if (mq.addListener) mq.addListener(onMQ);

    // --- Auto-scroll to hash on page load (with navbar offset) ---
    if (window.location.hash && window.location.hash.length > 1) {
      var hashTarget = document.getElementById(window.location.hash.slice(1));
      if (hashTarget) {
        // Delay so layout & fonts settle first
        window.addEventListener('load', function () {
          setTimeout(function () {
            var navH = navbar ? navbar.offsetHeight : 0;
            var top  = hashTarget.getBoundingClientRect().top + window.pageYOffset - navH - 8;
            window.scrollTo({ top: top, behavior: 'smooth' });
          }, 120);
        });
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
