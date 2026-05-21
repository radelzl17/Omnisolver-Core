const http = require('http');
const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const token = process.env.TELEGRAM_TOKEN;
const apiKey = process.env.GEMINI_API_KEY;
const PORT = process.env.PORT || 7860;

if (!token || !apiKey) {
    console.error("[ERROR] Falta TELEGRAM_TOKEN o GEMINI_API_KEY en los Secrets.");
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });
const ai = new GoogleGenerativeAI(apiKey);
const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

console.log("[SISTEMA] Omnisolver Core inicializado con éxito. Escuchando Telegram...");

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text || text.startsWith('/')) {
        if (text === '/start') {
            bot.sendMessage(chatId, "¡Omnisolver Core en línea! Envíame cualquier consulta.");
        }
        return;
    }

    bot.sendChatAction(chatId, 'typing');

    try {
        const result = await model.generateContent(text);
        const response = await result.response;
        const replyText = response.text();
        await bot.sendMessage(chatId, replyText);
    } catch (error) {
        console.error("Error en Gemini:", error);
        await bot.sendMessage(chatId, "Error interno en mi cerebro de IA.");
    }
});

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Omnisolver Core Live\n');
}).listen(PORT, () => {
    console.log(`Servidor HTTP activo en puerto ${PORT}`);
});
