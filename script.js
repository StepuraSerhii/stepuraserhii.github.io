//СКРИПТ ДЛЯ НАВІГАЦІЇ//
// Отримуємо елементи для бургер-меню та списку навігації
const burger = document.getElementById("burger"); // Бургер-меню (іконка)
const menu = document.getElementById("navLinks");  // Список навігаційних посилань

// Додаємо слухача події на бургер-меню
burger.addEventListener("click", () => {
  // Перевірка, чи меню відкрите, якщо так — закрити, якщо ні — відкрити
  menu.classList.toggle("active"); // Перемикає клас "active", що відкриває або закриває меню
});



//СКРИПТ РІНГОСТАТ//
(function (d,s,u,e,p) {
  p=d.getElementsByTagName(s)[0],e=d.createElement(s),e.async=1,e.src=u,p.parentNode.insertBefore(e, p);
})(document, 'script', 'https://script.ringostat.com/v4/1b/1b754cb63e621f14d71ac9233d0ba04a7fd8a22a.js');
var pw = function() {if (typeof(ringostatAnalytics) === "undefined") {setTimeout(pw,100);} else {ringostatAnalytics.sendHit('pageview');}}; 
pw();