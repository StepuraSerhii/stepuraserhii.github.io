(function (d, s, u, e, p) {
  p = d.getElementsByTagName(s)[0];
  e = d.createElement(s);
  e.async = 1;
  e.src = u;
  p.parentNode.insertBefore(e, p);
})(document, 'script', 'https://script.ringostat.com/v4/1b/1b754cb63e621f14d71ac9233d0ba04a7fd8a22a.js');

// Очікуємо, поки скрипт завантажиться і ініціалізуємо функцію
var pw = function () {
  if (typeof (ringostatAnalytics) === "undefined") {
    setTimeout(pw, 100); // повторюємо через 100 мс
  } else {
    ringostatAnalytics.sendHit('pageview');
  }
};
pw();

document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("navLinks");
  const navLinks = document.querySelectorAll(".nav-links a");

  // Перемикання меню на мобільних
  burger?.addEventListener("click", () => {
    menu?.classList.toggle("active");
  });

  // Закриття меню після переходу по пункту
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      menu?.classList.remove("active");
    });
  });

  // Додавання тіней до навбару при скролі
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }
  });
});

// API виклик через сервер
document.getElementById("callButton")?.addEventListener("click", () => {
  const phoneNumber = document.getElementById("phone").value.trim();
  const authKey = document.getElementById("authKey").value.trim();
  const projectId = document.getElementById("projectId").value.trim();
  const schemeId = document.getElementById("schemeId").value.trim();
  const direction = document.getElementById("direction").value;  // Напрямок дзвінка: 0 або 1
  const callType = document.getElementById("callType").value;    // Тип дзвінка: 'in' або 'out'

  if (!phoneNumber || !authKey || !projectId || !schemeId) {
    alert("Будь ласка, заповніть усі поля");
    return;
  }

  console.log("📞 Відправка запиту на сервер...");

  fetch("http://localhost:3001/api/call", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      phoneNumber,
      authKey,
      projectId,
      schemeId,
      direction,  // Напрямок дзвінка
      callType    // Тип дзвінка
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log("✅ Відповідь сервера:", data);
      if (data.error) {
        alert("❌ Помилка: " + data.error.message);
      } else {
        alert("✅ Запит на виклик надіслано!");
        document.getElementById("phone").value = "";
        document.getElementById("authKey").value = "";
        document.getElementById("projectId").value = "";
        document.getElementById("schemeId").value = "";
      }
    })
    .catch(error => {
      console.error("❗ Помилка запиту:", error);
      alert("Не вдалося надіслати запит: " + error.message);
    });
});