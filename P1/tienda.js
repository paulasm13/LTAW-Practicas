
// Definición de modulos y puerto
const http = require('http');

const PUERTO = 9090;

// Creo el servidor
const server = http.createServer();

server.listen(PUERTO);

console.log("Escuchando en puerto: " + PUERTO);