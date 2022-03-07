
//-- Definición de modulos y puerto
const http = require('http');
const url = require('url');
const fs = require('fs');

const PUERTO = 9090;


//-- Creo el servidor
const server = http.createServer((req, res) => {

  console.log('\nPetición recibida');

  //-- Construir el objeto url con la url de la solicitud
  let myURL = new URL(req.url, 'http://' + req.headers['host']);
  console.log(" * URL completa: " + myURL.href);
    // * Pathname devuelve el nombre de ruta de una URL
  console.log(" * Ruta: " + myURL.pathname);

  //-- Fichero del recurso
  let file = "";

  //-- Analizar el recurso solicitado
  if (myURL.pathname == '/') {
    file = '/main.html';
  }else{
    file = myURL.pathname;
  }

  type_file = file.split(".")[1];
  file = '.' + file;
  console.log(' * Recurso solicitado: ' + file);
  console.log(' * Extensión del recurso solicitado: ' + type_file);

  //-- Tipo de archivo
  const mime_type = {
    'html' : 'text/html',
    'css'  : 'text/css',
    'jpg'  : 'image/jpg',
    'ico'  : 'image/x-icon'
  };

  let mime = mime_type[type_file];
  console.log(' * Tipo de MIME: ' + mime);

  //-- Lectura asincrona del fichero
  fs.readFile(file, (err,data) => {
    //-- Fichero no encontrado, página de error
    if (err) {
      // * La página de error es un MIME tipo 'html'
      res.writeHead(404, {'Content-Type': 'text/html'});
      console.log('\n404: Not Found');
      file = './error.html';
      data = fs.readFileSync(file);
      res.write(data);
      res.end();
    }else{
      res.writeHead(200, {'Content-Type': mime});
      console.log('\n200: OK');
      res.write(data);
      res.end();
    }
  });
});

//-- Activo el servidor
server.listen(PUERTO);

console.log("Servidor activado. Escuchando en puerto: " + PUERTO + '\n');