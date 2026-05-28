/* =====================================================
   script.js — Ringostat + API + bulletproof menu
   Single source of truth. No external menu file needed.
   ===================================================== */

// === 1. Ringostat (без змін) ============================
(function () {
  var pathname = window.location.pathname;

  window.ringostatSettings = {
    noGa: true,
    observeDOM: false,
    browserGeolocation: false,
    callbackSettings: {
      delay: false,
      CallbackOff: false,
      autoFormOff: false,
      hideCallbackButton: false
    },
    customFormDataTracking: {
      isActive: false,
      startCallbackOnSubmitForm: false,
      callbackDuringBusinessHours: true,
      phoneInputName: ["phone", "tel", "telephone"],
      pagesWhiteList: [],
      pagesBlackList: [],
      fieldsBlackList: []
    },
    callback: function (data) {},
    messengers: {
      chat: {
        bot_name: "Tiny",
        bot_id: "",
        enabled: pathname === "/api" ? 0 : 1
      },
      telegram: {
        bot_name: "RingostatTiny_bot",
        bot_id: "",
        enabled: 1
      }
    }
  };

  (function (d, s, u, e, p) {
    p = d.getElementsByTagName(s)[0];
    e = d.createElement(s);
    e.async = 1;
    e.src = u;
    p.parentNode.insertBefore(e, p);
  })(document, 'script', 'https://script.ringostat.com/v4/1b/1b754cb63e621f14d71ac9233d0ba04a7fd8a22a.js');

  var pw = function () {
    if (typeof (ringostatAnalytics) === "undefined") {
      setTimeout(pw, 100);
    } else {
      ringostatAnalytics.sendHit('pageview');
    }
  };
  pw();
})();

// === 2. МЕНЮ PRO — overlay + capsule + scroll-aware =====
document.addEventListener("DOMContentLoaded", function () {
  var burger   = document.getElementById("burger");
  var navLinks = document.getElementById("navLinks");
  var navbar   = document.querySelector(".navbar");
  var navbarContainer = document.querySelector(".navbar-container");
  var phoneIcon = document.getElementById("phoneIcon");
  var body     = document.body;

  if (!burger || !navLinks || !navbar) return;

  // ---- Inject inner <span class="b-mid"> for animated burger ----
  if (!burger.querySelector(".b-mid")) {
    burger.innerHTML = '<span class="b-mid" aria-hidden="true"></span>';
  }

  // ---- ARIA setup on burger ----
  burger.setAttribute("role", "button");
  burger.setAttribute("tabindex", "0");
  burger.setAttribute("aria-expanded", "false");
  burger.setAttribute("aria-label", "Меню");

  // ---- Inject LIVE status pill on desktop (#5) ----
  if (phoneIcon && !document.querySelector(".nav-status")) {
    var pill = document.createElement("span");
    pill.className = "nav-status";
    pill.setAttribute("aria-hidden", "true");
    pill.innerHTML = 'LIVE · <b>847</b> CALLS';
    phoneIcon.parentNode.insertBefore(pill, phoneIcon);
  }

  // ---- Build fullscreen mobile overlay (#3) ----
  // Mirror the existing navLinks <a> tags into a richer overlay structure.
  // Adds num + description + arrow per item.
  var descriptions = {
    "api.html":        "REST endpoints · auth-keys · webhooks",
    "substitution.html": "Динамічна підміна номерів",
    "index.html":      "Головна · телефонія",
    "#form":           "Заповніть форму звернення",
    "#contact":        "Зв'язок з командою",
    "index.html#form": "Заповніть форму звернення",
    "index.html#contact": "Зв'язок з командою",
    "#API":            "REST endpoints · auth-keys"
  };
  var path = location.pathname.split("/").pop() || "index.html";

  var overlay = document.createElement("div");
  overlay.className = "nav-overlay";
  overlay.setAttribute("aria-hidden", "true");
  // Hide immediately to prevent any flash of in-flow content
  overlay.style.cssText = "position:fixed;opacity:0;visibility:hidden;pointer-events:none;top:-9999px;";

  var statusHTML = '<span class="nav-overlay__status">LIVE · <b>847</b> CALLS TODAY · +18.4% ↗</span>';
  var listHTML = '<ul class="nav-overlay__list">';
  var anchors = navLinks.querySelectorAll("a");
  anchors.forEach(function (a, i) {
    var href = a.getAttribute("href") || "";
    var label = a.textContent.trim();
    var num = String(i + 1).padStart(2, "0");
    var sub = descriptions[href] || "";
    var isActive = a.classList.contains("active") ? " active-page" : "";
    listHTML += '<li><a class="ovr-link' + isActive + '" href="' + href + '">' +
                  '<span class="idx">' + num + '</span>' +
                  '<span class="label">' + label +
                    (sub ? '<span class="sub">' + sub + '</span>' : '') +
                  '</span>' +
                  '<span class="arrow" aria-hidden="true">→</span>' +
                '</a></li>';
  });
  listHTML += "</ul>";

  var footHTML =
    '<div class="nav-overlay__foot">' +
      '<small>Подзвонити</small>' +
      '<a class="nav-overlay__phone" href="tel:+380970000000">+380 97 000 00 00</a>' +
    '</div>';

  overlay.innerHTML = statusHTML + listHTML + footHTML;
  document.body.appendChild(overlay);

  // ---- Bulletproof base styles via JS (works even if navbar-pro.css
  //      fails to load or is cached). CSS file adds the pretty parts. ----
  var mqMobileMenu = window.matchMedia("(max-width: 768px)");

  function applyOverlayBaseStyle() {
    var s = overlay.style;
    if (mqMobileMenu.matches) {
      // Mobile: fixed full-screen, hidden until .open
      s.position = "fixed";
      s.left = "0";
      s.right = "0";
      s.bottom = "0";
      s.top = (navbar.offsetHeight || 64) + "px";
      s.zIndex = "998";
      var isOpen = overlay.classList.contains("open");
      s.opacity = isOpen ? "1" : "0";
      s.visibility = isOpen ? "visible" : "hidden";
      s.pointerEvents = isOpen ? "auto" : "none";
    } else {
      // Desktop: overlay must never show — fully neutralised
      s.position = "fixed";
      s.opacity = "0";
      s.visibility = "hidden";
      s.pointerEvents = "none";
      s.top = "-9999px";
    }
  }
  applyOverlayBaseStyle();

  // ---- Open / close logic ----
  function openMenu() {
    navLinks.classList.add("active");
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    burger.setAttribute("aria-expanded", "true");
    body.classList.add("nav-open");
    body.style.overflow = "hidden";          // hard scroll-lock
    applyOverlayBaseStyle();
  }
  function closeMenu() {
    navLinks.classList.remove("active");
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false");
    body.classList.remove("nav-open");
    body.style.overflow = "";                // release scroll-lock
    applyOverlayBaseStyle();
  }
  function toggleMenu(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (overlay.classList.contains("open")) closeMenu(); else openMenu();
  }

  // Re-evaluate overlay styling on resize / breakpoint change
  window.addEventListener("resize", applyOverlayBaseStyle);
  if (mqMobileMenu.addEventListener) mqMobileMenu.addEventListener("change", function () {
    if (!mqMobileMenu.matches) closeMenu();  // entering desktop closes it
    applyOverlayBaseStyle();
  });

  burger.addEventListener("click", toggleMenu);
  burger.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") toggleMenu(e);
  });

  // ---- Overlay link handling (mobile) ----
  overlay.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a) return;
    closeMenu();
    var href = a.getAttribute("href") || "";
    if (href.charAt(0) === "#" && href.length > 1) {
      var target = document.getElementById(href.slice(1));
      if (target) {
        e.preventDefault();
        setTimeout(function () {
          var navH = navbar.offsetHeight;
          var top  = target.getBoundingClientRect().top + window.pageYOffset - navH - 8;
          window.scrollTo({ top: top, behavior: "smooth" });
          history.pushState(null, "", href);
        }, 80);
      }
    }
  });

  // ---- Desktop hash-link handling (existing behaviour) ----
  navLinks.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (href.charAt(0) === "#" && href.length > 1) {
      var target = document.getElementById(href.slice(1));
      if (target) {
        e.preventDefault();
        var navH = navbar.offsetHeight;
        var top  = target.getBoundingClientRect().top + window.pageYOffset - navH - 8;
        window.scrollTo({ top: top, behavior: "smooth" });
        history.pushState(null, "", href);
      }
    }
  });

  // ---- Close overlay on outside click / Escape ----
  document.addEventListener("click", function (e) {
    if (!overlay.classList.contains("open")) return;
    if (overlay.contains(e.target)) return;
    if (burger.contains(e.target)) return;
    closeMenu();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeMenu();
  });

  // ---- mqMobile used by capsule logic below ----
  var mqMobile = window.matchMedia("(min-width: 769px)");

  // ----------------------------------------------------
  // #1 MAGNETIC CAPSULE (desktop only)
  // ----------------------------------------------------
  var capsule = null;
  function setupCapsule() {
    if (!mqMobile.matches) return;        // desktop only
    if (capsule) return;
    capsule = document.createElement("span");
    capsule.className = "nav-capsule";
    capsule.setAttribute("aria-hidden", "true");
    navLinks.appendChild(capsule);

    var items = navLinks.querySelectorAll("li > a");
    var activeItem = navLinks.querySelector("a.active") || null;

    function moveTo(el) {
      if (!el) {
        navLinks.classList.remove("has-capsule");
        return;
      }
      var navRect = navLinks.getBoundingClientRect();
      var elRect  = el.getBoundingClientRect();
      var x = elRect.left - navRect.left;
      capsule.style.width = elRect.width + "px";
      capsule.style.transform = "translateX(" + x + "px)";
      navLinks.classList.add("has-capsule");
    }

    items.forEach(function (el) {
      el.addEventListener("mouseenter", function () { moveTo(el); });
      el.addEventListener("focus",      function () { moveTo(el); });
    });
    navLinks.addEventListener("mouseleave", function () { moveTo(activeItem); });

    // Initial position — on the active page link if any, else hidden
    requestAnimationFrame(function () { moveTo(activeItem); });

    window.addEventListener("resize", function () {
      var hovered = navLinks.querySelector("li > a:hover");
      moveTo(hovered || activeItem);
    });
  }
  setupCapsule();
  if (mqMobile.addEventListener) {
    mqMobile.addEventListener("change", function () {
      if (mqMobile.matches) setupCapsule();
    });
  }

  // ----------------------------------------------------
  // #6 SCROLL-AWARE NAVBAR — shrink + hide on down / show on up
  // ----------------------------------------------------
  var lastY = window.pageYOffset;
  var ticking = false;
  function onScroll() {
    var y = window.pageYOffset;

    // shadow on scroll (was there before)
    if (y > 20) navbar.classList.add("scrolled");
    else        navbar.classList.remove("scrolled");

    // shrink after 120px
    if (y > 120) navbar.classList.add("shrunk");
    else         navbar.classList.remove("shrunk");

    // hide on scroll down, show on scroll up — only after passing navbar height
    if (!overlay.classList.contains("open")) {
      if (y > 180 && y > lastY + 4) {
        navbar.classList.add("hidden");
      } else if (y < lastY - 4) {
        navbar.classList.remove("hidden");
      }
    }

    lastY = y;
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  // ----------------------------------------------------
  // Auto-scroll to hash on page load (with navbar offset)
  // ----------------------------------------------------
  if (window.location.hash && window.location.hash.length > 1) {
    var hashTarget = document.getElementById(window.location.hash.slice(1));
    if (hashTarget) {
      window.addEventListener("load", function () {
        setTimeout(function () {
          var navH = navbar.offsetHeight;
          var top  = hashTarget.getBoundingClientRect().top + window.pageYOffset - navH - 8;
          window.scrollTo({ top: top, behavior: "smooth" });
        }, 140);
      });
    }
  }
});

// === 3. API — call & connect (без змін) =================
async function sendCall(authKey, phoneNumber) {
  try {
    const response = await fetch('https://stepuraserhii-github-io.onrender.com/api/call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authKey, phoneNumber })
    });
    const result = await response.json();
    console.log('✅ Результат виклику:', result);
    alert('✅ Дзвінок успішно надіслано!');
  } catch (error) {
    console.error('❌ Помилка виклику:', error);
    alert('❌ Помилка при надсиланні дзвінка!');
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var btn3 = document.getElementById('connectButton3');
  if (btn3) btn3.addEventListener('click', function () {
    const authKey = document.getElementById('authKey3').value;
    const phoneNumber = document.getElementById('phone3').value;
    const projectId = document.getElementById('projectId3').value;
    const schemeId = document.getElementById('schemeId3').value;
    let manager_dst = document.getElementById('direction3').value;
    const direction = document.getElementById('callType3').value;
    manager_dst = manager_dst === "0" ? 0 : 1;
    connectNumber({ authKey, phoneNumber, projectId, schemeId, direction, manager_dst });
  });

  var btn4 = document.getElementById('connectButton4');
  if (btn4) btn4.addEventListener('click', function () {
    const authKey = document.getElementById('authKey4').value;
    const phoneNumber = document.getElementById('phone4').value;
    const projectId = document.getElementById('projectId4').value;
    const sipLogin = document.getElementById('sipLogin4').value;
    let manager_dst = document.getElementById('direction4').value;
    const direction = document.getElementById('callType4').value;
    manager_dst = manager_dst === "0" ? 0 : 1;
    connectNumber({ authKey, phoneNumber, projectId, sipLogin, direction, manager_dst });
  });
});

async function connectNumber(data) {
  try {
    const response = await fetch('https://stepuraserhii-github-io.onrender.com/api/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    console.log('✅ Відповідь сервера:', result);
    alert('✅ Запит на з\'єднання успішно відправлено!');
  } catch (error) {
    console.error('❌ Помилка надсилання запиту:', error);
    alert('❌ Помилка при надсиланні запиту!');
  }
}
