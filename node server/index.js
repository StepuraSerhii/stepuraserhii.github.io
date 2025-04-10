const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/call', async (req, res) => {
  const { phoneNumber, authKey } = req.body;

  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "Api\\V2\\Callback.external",
    params: {
      callee_type: "scheme",
      caller: phoneNumber,
      callee: "231146",
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
    res.json(data);
  } catch (error) {
    console.error("Помилка сервера:", error);
    res.status(500).json({ error: "Серверна помилка при запиті" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Сервер працює: http://localhost:${PORT}`);
});