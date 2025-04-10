// =========================
// 🌐 БУРГЕР-МЕНЮ ТА НАВІГАЦІЯ
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("navLinks");
  const navLinks = document.querySelectorAll(".nav-links a");

  // 🎯 Перемикання меню на мобільних
  burger?.addEventListener("click", () => {
    menu?.classList.toggle("active");
  });

  // 🎯 Закриття меню після переходу по пункту
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      menu?.classList.remove("active");
    });
  });

  // 🎯 Додавання тіней до навбару при скролі
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
// 📞 API ВИКЛИК (НЕ ЧІПАТИ: Ringostat)
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
// ☎️ ОБРОБКА ВИКЛИКУ ЧЕРЕЗ API
// =========================
document.getElementById("callButton")?.addEventListener("click", () => {
  const phoneNumber = document.getElementById("phoneInput")?.value.trim();
  const authKey = document.getElementById("authKey")?.value.trim();

  if (!phoneNumber || !authKey) {
    alert("Будь ласка, заповніть усі поля");
    return;
  }

  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "Api\\V2\\Callback.external",
    params: {
      callee_type: "scheme",
      caller: phoneNumber,
      callee: "34373",
      projectId: "39071",
      direction: "out",
      manager_dst: "0"
    }
  };

  fetch("https://api.ringostat.net/a/v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Auth-key": authKey
    },
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .then(data => {
      console.log("Успішна відповідь:", data);
      alert("Запит на виклик надіслано!");
    })
    .catch(error => {
      console.error("Помилка:", error);
      alert("Не вдалося надіслати запит.");
    });
});