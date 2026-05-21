const http = require('http');

// Servidor básico para que Hugging Face sepa que estamos activos
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Omnisolver Core esta en linea y esperando ordenes.\n');
});

// Hugging Face usa el puerto 7860 por defecto
const PORT = process.env.PORT || 7860;

server.listen(PORT, () => {
    console.log(`[SISTEMA INICIADO] Omnisolver vivo en el puerto ${PORT}`);
});
