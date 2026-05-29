/* =====================================================
   tiny-bot.js — Анімований робот-аватар 🤖
   При кліку переходить на t.me/AITiny_bot
   Підключення: <script src="tiny-bot.js" defer></script>
   на всіх HTML сторінках
   ===================================================== */

(function () {
  "use strict";

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const TELEGRAM_URL = "https://t.me/AITiny_bot";
  const IMG_SRC = "images/tiny-bot.png"; // шлях до збереженої картинки

  document.addEventListener("DOMContentLoaded", function () {

    /* ── 1. Стилі ── */
    var style = document.createElement("style");
    style.textContent = `
      .tbot-wrap {
        position: fixed;
        right: 28px;
        top: 90px;
        z-index: 9990;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
      }

      /* Підпис */
      .tbot-label {
        background: #0e0e12;
        color: #f4f1ea;
        font-family: 'Space Mono', monospace, system-ui;
        font-size: 0.62rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        padding: 5px 12px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.12);
        white-space: nowrap;
        opacity: 0;
        order: 2;
        transform: translateY(-6px);
        transition: opacity 0.3s ease, transform 0.3s ease;
        pointer-events: none;
      }

      .tbot-wrap:hover .tbot-label,
      .tbot-wrap:focus-visible .tbot-label {
        opacity: 1;
        transform: translateY(0);
      }

      /* Зовнішнє кільце (орбіта) */
      .tbot-orbit {
        position: relative;
        width: 100px;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* Кільця-радари */
      .tbot-ring {
        position: absolute;
        border-radius: 50%;
        border: 1.5px solid rgba(80, 180, 255, 0.5);
        opacity: 0;
        animation: tbot-radar 3s cubic-bezier(0.16,1,0.3,1) infinite;
      }
      .tbot-ring:nth-child(1) { width: 72px;  height: 72px;  animation-delay: 0s;   }
      .tbot-ring:nth-child(2) { width: 72px;  height: 72px;  animation-delay: 1s;   }
      .tbot-ring:nth-child(3) { width: 72px;  height: 72px;  animation-delay: 2s;   }

      @keyframes tbot-radar {
        0%   { width: 72px;  height: 72px;  opacity: 0.9; border-color: rgba(80,180,255,0.7); }
        100% { width: 140px; height: 140px; opacity: 0;   border-color: rgba(80,180,255,0); }
      }

      /* Обертова дуга навколо аватара */
      .tbot-arc {
        position: absolute;
        width: 84px;
        height: 84px;
        border-radius: 50%;
        border: 1.5px dashed rgba(100, 200, 255, 0.3);
        animation: tbot-spin 8s linear infinite;
      }
      .tbot-arc::before {
        content: "";
        position: absolute;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #50b4ff;
        box-shadow: 0 0 10px #50b4ff, 0 0 20px rgba(80,180,255,0.6);
        top: -3.5px;
        left: 50%;
        margin-left: -3.5px;
      }
      @keyframes tbot-spin {
        to { transform: rotate(360deg); }
      }

      /* Аватар */
      .tbot-avatar {
        position: relative;
        width: 72px;
        height: 72px;
        border-radius: 50%;
        overflow: hidden;
        background: radial-gradient(circle at 40% 30%, #1a2a5e, #0a0a20);
        box-shadow:
          0 0 0 3px rgba(80,180,255,0.25),
          0 0 0 7px rgba(80,180,255,0.08),
          0 8px 30px rgba(0,0,0,0.45),
          0 0 40px rgba(80,180,255,0.2);
        animation: tbot-float 3s ease-in-out infinite;
        transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease;
        z-index: 1;
      }

      .tbot-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center 10%;
        display: block;
        transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
      }

      @keyframes tbot-float {
        0%, 100% { transform: translateY(0px);   }
        50%       { transform: translateY(-6px);  }
      }

      /* Ховер */
      .tbot-wrap:hover .tbot-avatar {
        transform: translateY(-4px) scale(1.08);
        box-shadow:
          0 0 0 4px rgba(80,180,255,0.45),
          0 0 0 10px rgba(80,180,255,0.12),
          0 16px 40px rgba(0,0,0,0.5),
          0 0 60px rgba(80,180,255,0.4);
        animation: none;
      }

      .tbot-wrap:hover .tbot-avatar img {
        transform: scale(1.06);
      }

      /* Клік */
      .tbot-wrap:active .tbot-avatar {
        transform: scale(0.94) !important;
        transition-duration: 0.1s;
      }

      /* Очі блимають */
      .tbot-avatar::after {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 50% 42%, rgba(80,180,255,0.08), transparent 60%);
        animation: tbot-glow 2.4s ease-in-out infinite alternate;
        pointer-events: none;
      }

      @keyframes tbot-glow {
        from { opacity: 0.4; }
        to   { opacity: 1;   }
      }

      /* Іскра при кліку */
      .tbot-spark {
        position: absolute;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #50b4ff;
        pointer-events: none;
        animation: tbot-spark-fly 0.6s ease-out forwards;
      }

      @keyframes tbot-spark-fly {
        0%   { transform: translate(0,0) scale(1);   opacity: 1; }
        100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
      }

      /* Tooltip "Telegram" */
      .tbot-tg-badge {
        position: absolute;
        top: -6px;
        right: -6px;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: #29b6f6;
        display: grid;
        place-items: center;
        box-shadow: 0 2px 8px rgba(41,182,246,0.6);
        z-index: 2;
        animation: tbot-badge-pulse 2s ease-in-out infinite;
      }

      @keyframes tbot-badge-pulse {
        0%,100% { box-shadow: 0 2px 8px rgba(41,182,246,0.6); }
        50%     { box-shadow: 0 2px 16px rgba(41,182,246,0.9); }
      }

      .tbot-tg-badge svg {
        width: 12px;
        height: 12px;
        fill: #fff;
      }

      /* Мобайл */
      @media (max-width: 768px) {
        .tbot-wrap { right: 16px; top: 80px; }
        .tbot-avatar { width: 62px; height: 62px; }
        .tbot-arc { width: 74px; height: 74px; }
      }
    `;
    document.head.appendChild(style);

    /* ── 2. Розмітка ── */
    var wrap = document.createElement("div");
    wrap.className = "tbot-wrap";
    wrap.setAttribute("role", "link");
    wrap.setAttribute("tabindex", "0");
    wrap.setAttribute("aria-label", "Написати боту в Telegram");
    wrap.title = "Написати боту в Telegram";

    wrap.innerHTML = `
      <div class="tbot-label">✦ AITiny Bot</div>
      <div class="tbot-orbit">
        <div class="tbot-ring"></div>
        <div class="tbot-ring"></div>
        <div class="tbot-ring"></div>
        <div class="tbot-arc"></div>
        <div class="tbot-avatar">
          <img src="${IMG_SRC}" alt="AI бот" draggable="false" />
          <div class="tbot-tg-badge">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.19 13.367l-2.965-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.963.192z"/>
            </svg>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);

    /* ── 3. Переходи і анімації ── */
    function spawnSparks() {
      var orbit = wrap.querySelector(".tbot-orbit");
      for (var i = 0; i < 8; i++) {
        (function(i) {
          var spark = document.createElement("div");
          spark.className = "tbot-spark";
          var angle = (i / 8) * 2 * Math.PI;
          var dist = 40 + Math.random() * 20;
          spark.style.setProperty("--tx", Math.cos(angle) * dist + "px");
          spark.style.setProperty("--ty", Math.sin(angle) * dist + "px");
          spark.style.left = "50%";
          spark.style.top  = "50%";
          spark.style.marginLeft = "-3px";
          spark.style.marginTop  = "-3px";
          spark.style.animationDelay = (i * 0.04) + "s";
          orbit.appendChild(spark);
          setTimeout(function() { spark.remove(); }, 700);
        })(i);
      }
    }

    function goToBot() {
      spawnSparks();
      setTimeout(function () {
        window.open(TELEGRAM_URL, "_blank", "noopener,noreferrer");
      }, 150);
    }

    wrap.addEventListener("click", goToBot);
    wrap.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goToBot(); }
    });

    /* ── 4. Якщо картинка не знайдена — показати емодзі замість ── */
    var img = wrap.querySelector("img");
    img.addEventListener("error", function () {
      var avatar = wrap.querySelector(".tbot-avatar");
      avatar.innerHTML = `
        <div style="width:100%;height:100%;display:grid;place-items:center;font-size:2.2rem;">🤖</div>
        <div class="tbot-tg-badge">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="#fff" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.19 13.367l-2.965-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.963.192z"/>
          </svg>
        </div>
      `;
    });

  });
})();
