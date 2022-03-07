
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
    // * Pathname devuelve el nombre de ruta de una URL
  console.log(" * Ruta: " + myURL.pathname);

  //-- Fichero a devolver
  let file = "";

  //-- Analizar el recurso solicitado
  if (myURL.pathname == '/') {
    file = '/main.html';
  }else{
    file = myURL.pathname;
  }

  console.log(' * Nombre del fichero: ' + file);
  
});

//-- Activo el servidor
server.listen(PUERTO);

console.log("Servidor activado. Escuchando en puerto: " + PUERTO + '\n');