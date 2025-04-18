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

// 📞 Відправка запиту на простий дзвінок
async function sendCall(authKey, phoneNumber) {
  try {
    const response = await fetch('https://твій-домен-на-рендері.onrender.com/api/call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authKey, phoneNumber })
    });
    const result = await response.json();
    console.log('✅ Результат виклику:', result);
  } catch (error) {
    console.error('❌ Помилка виклику:', error);
  }
}

// 🔀 Відправка запиту на з'єднання
async function connectNumber(data) {
  try {
    const response = await fetch('https://твій-домен-на-рендері.onrender.com/api/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    console.log('✅ Результат зєднання:', result);
  } catch (error) {
    console.error('❌ Помилка зєднання:', error);
  }
}

document.getElementById('callButton1')?.addEventListener('click', () => {
  const authKey = document.getElementById('authKey1').value;
  const phoneNumber = document.getElementById('phoneInput1').value;
  sendCall(authKey, phoneNumber);
});

document.getElementById('callButton2')?.addEventListener('click', () => {
  const authKey = document.getElementById('authKey2').value;
  const phoneNumber = document.getElementById('phoneInput2').value;
  sendCall(authKey, phoneNumber);
});

document.getElementById('connectButton3')?.addEventListener('click', () => {
  const authKey = document.getElementById('authKey3').value;
  const phoneNumber = document.getElementById('phone3').value;
  const projectId = document.getElementById('projectId3').value;
  const schemeId = document.getElementById('schemeId3').value;
  const manager_dst = document.getElementById('direction3').value;
  const direction = document.getElementById('callType3').value;

  connectNumber({ authKey, phoneNumber, projectId, schemeId, direction, manager_dst });
});