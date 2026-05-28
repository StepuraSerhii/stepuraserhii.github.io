/* =====================================================
   crocodile.js — Зелений крокодильчик 🐊
   Через 5 секунд виповзає знизу, махає лапкою і ховається.
   Самодостатній: підключаєш <script src="crocodile.js" defer></script>
   ===================================================== */

(function () {
  "use strict";

  // --- Не показувати, якщо користувач просить менше анімації ---
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  document.addEventListener("DOMContentLoaded", function () {

    // ---- 1. Стилі ----
    var style = document.createElement("style");
    style.textContent = [
      ".croc-wrap{",
      "  position:fixed;",
      "  right:28px;",
      "  bottom:-220px;",            // схований під екраном
      "  width:150px;",
      "  height:200px;",
      "  z-index:9999;",
      "  pointer-events:none;",
      "  transition:bottom .9s cubic-bezier(.34,1.56,.64,1);", // пружинистий виліз
      "}",
      ".croc-wrap.croc-up{ bottom:-30px; }",                   // виліз нагору
      "@media (max-width:768px){",
      "  .croc-wrap{ right:14px; width:120px; height:160px; }",
      "}",

      /* лапка, що махає */
      ".croc-arm{",
      "  transform-origin:50px 118px;",
      "  animation:none;",
      "}",
      ".croc-wrap.croc-wave .croc-arm{",
      "  animation:croc-wave 0.5s ease-in-out 4;",             // махає 4 рази
      "}",
      "@keyframes croc-wave{",
      "  0%,100%{ transform:rotate(0deg); }",
      "  50%   { transform:rotate(-38deg); }",
      "}",

      /* легке погойдування тіла, поки крокодил нагорі */
      ".croc-wrap.croc-up .croc-body{",
      "  animation:croc-bob 1.6s ease-in-out infinite;",
      "  transform-origin:75px 180px;",
      "}",
      "@keyframes croc-bob{",
      "  0%,100%{ transform:translateY(0) rotate(0deg); }",
      "  50%   { transform:translateY(-4px) rotate(-1.5deg); }",
      "}",

      /* блимання ока */
      ".croc-eye{ animation:croc-blink 3.2s ease-in-out infinite; transform-origin:center; }",
      "@keyframes croc-blink{",
      "  0%,92%,100%{ transform:scaleY(1); }",
      "  96%        { transform:scaleY(0.1); }",
      "}"
    ].join("\n");
    document.head.appendChild(style);

    // ---- 2. Розмітка (SVG крокодил) ----
    var wrap = document.createElement("div");
    wrap.className = "croc-wrap";
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML =
      '<svg viewBox="0 0 150 200" xmlns="http://www.w3.org/2000/svg">' +
        '<g class="croc-body">' +
          /* хвіст */
          '<path d="M118 150 Q150 130 140 100 Q132 120 112 130 Z" fill="#3aa655"/>' +
          /* тіло */
          '<ellipse cx="75" cy="160" rx="52" ry="38" fill="#43b85f"/>' +
          /* лапка, що махає */
          '<g class="croc-arm">' +
            '<ellipse cx="44" cy="120" rx="13" ry="22" fill="#3aa655"/>' +
            '<circle cx="42" cy="100" r="11" fill="#43b85f"/>' +
          '</g>' +
          /* друга лапка (статична) */
          '<ellipse cx="104" cy="150" rx="12" ry="18" fill="#3aa655"/>' +
          /* голова */
          '<ellipse cx="75" cy="120" rx="40" ry="32" fill="#4ec96b"/>' +
          /* морда */
          '<ellipse cx="75" cy="142" rx="34" ry="16" fill="#4ec96b"/>' +
          /* посмішка */
          '<path d="M52 146 Q75 158 98 146" stroke="#27773d" stroke-width="3" fill="none" stroke-linecap="round"/>' +
          /* зубчики */
          '<path d="M58 147 l3 5 l3 -5 M68 149 l3 5 l3 -5 M80 149 l3 5 l3 -5 M90 147 l3 5 l3 -5" stroke="#fff" stroke-width="2" fill="none"/>' +
          /* очі (бугорки) */
          '<circle cx="62" cy="98" r="13" fill="#4ec96b"/>' +
          '<circle cx="88" cy="98" r="13" fill="#4ec96b"/>' +
          '<g class="croc-eye">' +
            '<circle cx="62" cy="96" r="8" fill="#fff"/>' +
            '<circle cx="88" cy="96" r="8" fill="#fff"/>' +
            '<circle cx="63" cy="97" r="4" fill="#1b2a1d"/>' +
            '<circle cx="89" cy="97" r="4" fill="#1b2a1d"/>' +
          '</g>' +
          /* ніздрі */
          '<circle cx="69" cy="134" r="2.4" fill="#27773d"/>' +
          '<circle cx="81" cy="134" r="2.4" fill="#27773d"/>' +
        '</g>' +
      '</svg>';
    document.body.appendChild(wrap);

    // ---- 3. Сценарій появи ----
    setTimeout(function () {
      wrap.classList.add("croc-up");          // виповзає

      setTimeout(function () {
        wrap.classList.add("croc-wave");       // махає лапкою (4 рази × 0.5с = 2с)
      }, 700);                                  // дочекатися кінця вильоту

      setTimeout(function () {
        wrap.classList.remove("croc-wave");
        wrap.classList.remove("croc-up");       // ховається назад
      }, 700 + 2200 + 600);                     // після махання + пауза → донизу

    }, 5000);                                   // старт через 5 секунд
  });
})();
