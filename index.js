const http = require('http');
const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenAI } = require('@google/genai');

const token = process.env.TELEGRAM_TOKEN;
const apiKey = process.env.GEMINI_API_KEY;
const PORT = process.env.PORT || 7860;

if (!token || !apiKey) {
    console.error("[ERROR] Falta TELEGRAM_TOKEN o GEMINI_API_KEY en los Secrets.");
    process.exit(1);
}

// Inicializar el bot en modo polling activo
const bot = new TelegramBot(token, { polling: true });
const ai = new GoogleGenAI({ apiKey: apiKey });

console.log("[SISTEMA] Omnisolver Core inicializado con éxito. Escuchando Telegram...");

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text || text.startsWith('/')) {
        if (text === '/start') {
            bot.sendMessage(chatId, "¡Omnisolver Core en línea! Envíame cualquier dilema o consulta de negocio y la procesaré con Gemini.");
        }
        return;
    }

    bot.sendChatAction(chatId, 'typing');

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: text,
        });

        const replyText = response.text || "No obtuve una respuesta clara.";
        await bot.sendMessage(chatId, replyText);
    } catch (error) {
        console.error("Error en Gemini:", error);
        await bot.sendMessage(chatId, "Error interno en mi cerebro de IA.");
    }
});

// Servidor de respaldo para Hugging Face
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Omnisolver Core Live\n');
}).listen(PORT, () => {
    console.log(`Servidor HTTP activo en puerto ${PORT}`);
});
