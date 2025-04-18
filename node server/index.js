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
  console.log("📞 Номер:", phoneNumber);
  console.log("🔑 Ключ:", authKey);

  phoneNumber = phoneNumber.replace(/\D/g, '');

  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "Api\\V2\\Callback.external",
    params: {
      callee_type: "scheme",
      caller: phoneNumber,
      callee: "231146", // Тут залишається заглушка або потім винесемо в налаштування
      projectId: "171946",
      direction: "out",
      manager_dst: "0"
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
    console.log("📥 Відповідь від Ringostat (call):", data);
    res.json(data);
  } catch (error) {
    console.error("❌ Помилка сервера (call):", error);
    res.status(500).json({ error: "Серверна помилка при запиті" });
  }
});

// 🔀 З'єднання номеру і схеми
app.post('/api/connect', async (req, res) => {
  let { phoneNumber, authKey, projectId, schemeId, direction, callType } = req.body;

  console.log("📥 Отримано запит connect:");
  console.log(req.body);

  phoneNumber = phoneNumber.replace(/\D/g, '');

  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "Api\\V2\\Callback.external",
    params: {
      callee_type: "scheme",
      caller: phoneNumber,
      callee: schemeId,
      projectId: projectId,
      direction: callType,
      manager_dst: direction
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

app.listen(PORT, () => {
  console.log(`✅ Сервер працює: http://localhost:${PORT}`);
});