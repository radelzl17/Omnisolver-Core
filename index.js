const http = require('http');
const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenAI } = require('@google/genai');

// 1. Configuración de Variables de Entorno
const token = process.env.TELEGRAM_TOKEN;
const apiKey = process.env.GEMINI_API_KEY;
const PORT = process.env.PORT || 7860;

if (!token || !apiKey) {
    console.error("[ERROR CRÍTICO] Faltan variables de entorno en Hugging Face.");
    process.exit(1);
}

// 2. Inicializar Clientes (Telegram en modo Polling para la nube)
const bot = new TelegramBot(token, { polling: true });
const ai = new GoogleGenAI({ apiKey: apiKey });

console.log("[SISTEMA] Conectando servicios...");

// 3. Lógica del Bot de Telegram con Gemini
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    // Ignorar mensajes vacíos o comandos iniciales comunes si se prefiere
    if (!text) return;

    // Enviar estado de "escribiendo..." en Telegram para mejorar UX
    bot.sendChatAction(chatId, 'typing');

    try {
        // Llamada oficial a la API de Gemini usando el modelo rápido idóneo para agentes
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: text,
        });

        const replyText = response.text || "No obtuve una respuesta clara del motor.";
        
        // Responder al usuario en Telegram
        await bot.sendMessage(chatId, replyText);
    } catch (error) {
        console.error("Error procesando con Gemini:", error);
        await bot.sendMessage(chatId, "Lo siento, tuve un problema al procesar tu solicitud en mi cerebro de IA.");
    }
});

// 4. Mantener vivo el contenedor en Hugging Face
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Omnisolver Core está funcionando activamente.\n');
});

server.listen(PORT, () => {
    console.log(`[OK] Servidor web escuchando en puerto ${PORT}`);
});
