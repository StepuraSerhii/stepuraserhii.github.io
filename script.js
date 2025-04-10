// =========================
// 🌐 БУРГЕР-МЕНЮ ТА НАВІГАЦІЯ
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("navLinks");
  const navLinks = document.querySelectorAll(".nav-links a");

  burger?.addEventListener("click", () => {
    menu?.classList.toggle("active");
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      menu?.classList.remove("active");
    });
  });

  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }
  });
});

// =========================
// 📞 API ВИКЛИК (НЕ ЧІПАТИ: Ringostat Chat скрипт)
// =========================
(function (d,s,u,e,p) {
  p=d.getElementsByTagName(s)[0],e=d.createElement(s),e.async=1,e.src=u,p.parentNode.insertBefore(e, p);
})(document, 'script', 'https://script.ringostat.com/v4/1b/1b754cb63e621f14d71ac9233d0ba04a7fd8a22a.js');

var pw = function() {
  if (typeof(ringostatAnalytics) === "undefined") {
    setTimeout(pw, 100);
  } else {
    ringostatAnalytics.sendHit('pageview');
  }
}; 
pw();

// =========================
// ☎️ ОБРОБКА ВИКЛИКУ ЧЕРЕЗ ЛОКАЛЬНИЙ СЕРВЕР
// =========================
document.getElementById("callButton")?.addEventListener("click", () => {
  const phoneNumber = document.getElementById("phoneInput")?.value.trim();
  const authKey = document.getElementById("authKey")?.value.trim();

  if (!phoneNumber || !authKey) {
    alert("Будь ласка, заповніть усі поля");
    return;
  }

  console.log("📞 Відправка запиту на сервер...");

  fetch("http://localhost:3001/api/call", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ phoneNumber, authKey })
  })
    .then(response => response.json())
    .then(data => {
      console.log("✅ Відповідь сервера:", data);
      if (data.error) {
        alert("❌ Помилка: " + data.error.message);
      } else {
        alert("✅ Запит на виклик надіслано!");
      }
    })
    .catch(error => {
      console.error("❗ Помилка запиту:", error);
      alert("Не вдалося надіслати запит: " + error.message);
    });
});