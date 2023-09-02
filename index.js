const TelegramBot = require("node-telegram-bot-api");

const express = require("express");

const cors = require("cors");

const app = express();

const PORT = 8000;

app.use(express.json());
app.use(cors());

const token = "6559371245:AAEyNm_kATLFpLDychTrFmNxc4uJ9sytVH8";

const webAppUrl = "https://master--chipper-chimera-974ae8.netlify.app";

const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  console.log(msg);

  if (text === "/start") {
    await bot.sendMessage(chatId, "Send", {
      reply_markup: {
        keyboard: [
          [
            {
              text: "Send",
              web_app: { url: webAppUrl + "/form" },
            },
          ],
        ],
      },
    });
    await bot.sendMessage(chatId, "Fill the form below", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Send",
              web_app: { url: webAppUrl },
            },
          ],
        ],
      },
    });
  }
  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);
      console.log(data);
      await bot.sendMessage(chatId, "Success!");
      await bot.sendMessage(chatId, "Country: " + data?.country);
      await bot.sendMessage(chatId, "City: " + data?.city);
      await bot.sendMessage(chatId, "Subject: " + data?.subject);
    } catch (error) {
      console.log(error);
    }
  }
});

app.post("/web-data", async (req, res) => {
  const { queryId, totalPrice, products = [] } = req.body;
  try {
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Success deal!",
      input_message_content: {
        message_text: `Success deal: ${totalPrice}, ${products
          .map((item) => item.title)
          .join(" ,")}`,
      },
    });
    return res.status(200).json({});
  } catch (error) {
    console.log(error);
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Bad request",
      input_message_content: { message_text: "Bad request" },
    });
    return res.status(500).json({});
  }
});

app.listen(PORT, () => {
  console.log(`server working on port: ${PORT}`);
});
