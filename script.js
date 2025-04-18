// Підключення зовнішнього скрипта Ringostat для аналітики
(function (d, s, u, e, p) {
  p = d.getElementsByTagName(s)[0];
  e = d.createElement(s);
  e.async = 1;
  e.src = u;
  p.parentNode.insertBefore(e, p);
})(document, 'script', 'https://script.ringostat.com/v4/1b/1b754cb63e621f14d71ac9233d0ba04a7fd8a22a.js');

// Очікуємо завантаження Ringostat-аналітики і відправляємо pageview
var pw = function () {
  if (typeof (ringostatAnalytics) === "undefined") {
    setTimeout(pw, 100); // Якщо аналітика ще не готова — повторюємо через 100 мс
  } else {
    ringostatAnalytics.sendHit('pageview');
  }
};
pw();

// Запускаємо функції після завантаження сторінки
document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("navLinks");
  const navLinks = document.querySelectorAll(".nav-links a");

  // Перемикання меню на мобільних пристроях
  burger?.addEventListener("click", () => {
    menu?.classList.toggle("active");
  });

  // Закриття меню після кліку по посиланню
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      menu?.classList.remove("active");
    });
  });

  // Додавання тіні до навбару при скролі
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

// 🔀 Відправка запиту на з'єднання номера та схеми
async function connectNumber(data) {
  try {
    const response = await fetch('https://stepuraserhii-github-io.onrender.com/api/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    console.log('✅ Результат з\'єднання:', result);
    alert('✅ З\'єднання успішне!');
  } catch (error) {
    console.error('❌ Помилка з\'єднання:', error);
    alert('❌ Помилка при з\'єднанні!');
  }
}

// Обробник кнопки для першої форми дзвінка
document.getElementById('callButton1')?.addEventListener('click', () => {
  const authKey = document.getElementById('authKey1').value;
  const phoneNumber = document.getElementById('phoneInput1').value;
  sendCall(authKey, phoneNumber);
});

// Обробник кнопки для другої форми дзвінка
document.getElementById('callButton2')?.addEventListener('click', () => {
  const authKey = document.getElementById('authKey2').value;
  const phoneNumber = document.getElementById('phoneInput2').value;
  sendCall(authKey, phoneNumber);
});

// Обробник кнопки для з'єднання номера і схеми
document.getElementById('connectButton3')?.addEventListener('click', () => {
  const authKey = document.getElementById('authKey3').value;
  const phoneNumber = document.getElementById('phone3').value;
  const projectId = document.getElementById('projectId3').value;
  const schemeId = document.getElementById('schemeId3').value;
  const manager_dst = document.getElementById('direction3').value;
  const direction = document.getElementById('callType3').value;

  connectNumber({ authKey, phoneNumber, projectId, schemeId, direction, manager_dst });
});