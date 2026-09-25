const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/ask", async (req, res) => {

  try {

    const question = req.body.question;

    if (!question) {
      return res.status(400).json({
        error: "Question is required"
      });
    }

    const response = await client.responses.create({
      model: "gpt-5.6",
      input: [
        {
          role: "system",
          content:
            "You are a helpful AI assistant. Answer clearly and naturally. If the user asks in Hindi, answer in Hindi. If the user asks in English, answer in English."
        },
        {
          role: "user",
          content: question
        }
      ]
    });

    res.json({
      answer: response.output_text
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "AI response failed"
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`AI server running on port ${PORT}`);
});
