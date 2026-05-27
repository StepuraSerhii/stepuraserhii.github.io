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

// === 2. МЕНЮ — bulletproof ===============================
document.addEventListener("DOMContentLoaded", function () {
  var burger   = document.getElementById("burger");
  var navLinks = document.getElementById("navLinks");
  var navbar   = document.querySelector(".navbar");
  var body     = document.body;

  // ---- Menu open/close ----
  if (burger && navLinks) {
    function openMenu()  { navLinks.classList.add("active");    burger.setAttribute("aria-expanded","true");  body.classList.add("nav-open"); }
    function closeMenu() { navLinks.classList.remove("active"); burger.setAttribute("aria-expanded","false"); body.classList.remove("nav-open"); }
    function toggleMenu(e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      if (navLinks.classList.contains("active")) closeMenu(); else openMenu();
    }

    burger.setAttribute("role", "button");
    burger.setAttribute("tabindex", "0");
    burger.setAttribute("aria-controls", "navLinks");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Меню");

    burger.addEventListener("click", toggleMenu);
    burger.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") toggleMenu(e);
    });

    // Close menu on any nav link tap + smooth-scroll in-page hashes
    navLinks.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a) return;
      closeMenu();

      var href = a.getAttribute("href") || "";
      if (href.charAt(0) === "#" && href.length > 1) {
        var target = document.getElementById(href.slice(1));
        if (target) {
          e.preventDefault();
          setTimeout(function () {
            var navH = navbar ? navbar.offsetHeight : 0;
            var top  = target.getBoundingClientRect().top + window.pageYOffset - navH - 8;
            window.scrollTo({ top: top, behavior: "smooth" });
            history.pushState(null, "", href);
          }, 60);
        }
      }
    });

    // Close on outside click
    document.addEventListener("click", function (e) {
      if (!navLinks.classList.contains("active")) return;
      if (navLinks.contains(e.target)) return;
      if (burger.contains(e.target)) return;
      closeMenu();
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navLinks.classList.contains("active")) closeMenu();
    });

    // Close when viewport grows past mobile breakpoint
    var mq = window.matchMedia("(min-width: 769px)");
    var onMQ = function () { if (mq.matches) closeMenu(); };
    if (mq.addEventListener) mq.addEventListener("change", onMQ);
    else if (mq.addListener)  mq.addListener(onMQ);
  }

  // ---- Auto-scroll to hash on page load (with navbar offset) ----
  if (window.location.hash && window.location.hash.length > 1) {
    var hashTarget = document.getElementById(window.location.hash.slice(1));
    if (hashTarget) {
      window.addEventListener("load", function () {
        setTimeout(function () {
          var navH = navbar ? navbar.offsetHeight : 0;
          var top  = hashTarget.getBoundingClientRect().top + window.pageYOffset - navH - 8;
          window.scrollTo({ top: top, behavior: "smooth" });
        }, 120);
      });
    }
  }

  // ---- Navbar shadow on scroll ----
  if (navbar) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 20) navbar.classList.add("scrolled");
      else navbar.classList.remove("scrolled");
    });
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
