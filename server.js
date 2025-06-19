const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
const { getOrderStatus } = require("./shopify"); // Shopify logic

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  try {
    if (userMessage.toLowerCase().includes("track order")) {
      const match = userMessage.match(/\d+/); // find order number
      if (match) {
        const status = await getOrderStatus(match[0]);
        return res.json({ reply: status });
      }
    }

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    });
    res.json({ reply: completion.data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "AI error", details: err.message });
  }
});

app.listen(port, () => {
  console.log(`SagarBot running at http://localhost:${port}`);
});
