const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 📞 Виклик простого дзвінка
app.post('/api/call', async (req, res) => {
  let { phoneNumber, authKey } = req.body;

  console.log("📥 Отримано запит call:");
  console.log("📞 Номер телефону:", phoneNumber);
  console.log("🔑 Ключ авторизації:", authKey);

  // Очищення номера від непотрібних символів
  phoneNumber = phoneNumber.replace(/\D/g, '');

  try {
    const response = await fetch("https://api.ringostat.net/a/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Auth-key": authKey
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("📥 Відповідь від Ringostat (call):", data);
    res.json(data);
  } catch (error) {
    console.error("❌ Помилка сервера (call):", error);
    res.status(500).json({ error: "Серверна помилка при запиті" });
  }
});

// 🔀 З'єднання номеру і схеми переадресації
app.post('/api/connect', async (req, res) => {
  let { phoneNumber, authKey, projectId, sipLogin, direction, manager_dst } = req.body;

  console.log("📥 Отримано запит connect:");
  console.log(req.body);

  phoneNumber = phoneNumber.replace(/\D/g, '');

  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "Api\\V2\\Callback.external",
    params: {
      callee_type: "sip_account",    // 🔥 Підставляємо правильний тип
      caller: phoneNumber,
      callee: sipLogin,               // 🔥 Підставляємо логін SIP
      projectId: projectId,
      direction: direction,
      manager_dst: Number(manager_dst)
    }
  };

  try {
    const response = await fetch("https://api.ringostat.net/a/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Auth-key": authKey
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("📥 Відповідь від Ringostat (connect):", data);
    res.json(data);
  } catch (error) {
    console.error("❌ Помилка сервера (connect):", error);
    res.status(500).json({ error: "Серверна помилка при запиті" });
  }
});