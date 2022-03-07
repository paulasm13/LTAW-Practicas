
//-- Definición de modulos y puerto
const http = require('http');
const url = require('url');

const PUERTO = 9090;

//-- Creo el servidor
const server = http.createServer((req, res) => {

  console.log('Petición recibida');

  //-- Construir el objeto url con la url de la solicitud
  let myURL = new URL(req.url, 'http://' + req.headers['host']);
  console.log(" * URL completa: " + myURL.href);
  console.log(" * Ruta: " + myURL.pathname);

});

//-- Activo el servidor
server.listen(PUERTO);

console.log("Servidor activado. Escuchando en puerto: " + PUERTO);