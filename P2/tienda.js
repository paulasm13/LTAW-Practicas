
//-- Definición de modulos y puerto
const http = require('http');
const url = require('url');
const fs = require('fs');

const PUERTO = 9090;

//-- Cargar pagina principal
const MAIN = fs.readFileSync('main.html','utf-8');

//-- Cargar la página de error
const ERROR = fs.readFileSync('error.html', 'utf-8');

//-- Cargar pagina web del formulario
const FORMULARIO = fs.readFileSync('form-login.html','utf-8');

//-- HTML de la página de respuesta
const RESPUESTA = fs.readFileSync('form-resp.html', 'utf-8');

//-- Cargar fichero JSON 
const DATOS = fs.readFileSync('tienda.json','utf-8');

//-- Creo el servidor
const server = http.createServer((req, res) => {

  console.log('\nPetición recibida');

  //-- Construir el objeto url con la url de la solicitud
  let myURL = new URL(req.url, 'http://' + req.headers['host']);
  let filename = "";

  console.log(" * URL completa: " + myURL.href);
  console.log(" * Método: " + req.method);
  console.log(" * Ruta: " + myURL.pathname.split(".")[1]);
  

  //-- Fichero del recurso
  let data = "";

  //-- Analizar el recurso solicitado
  if (myURL.pathname == '/'){
    filename = '/main.html';
    data = MAIN;

  }else if (myURL.pathname == '/procesar'){
    filename = '/form-resp.html';

    // Leer los parámetros
    let nombre = myURL.searchParams.get('nombre');
    let apellidos = myURL.searchParams.get('apellidos');
    console.log(" - Nombre: " + nombre);
    console.log(" - Apellidos: " + apellidos);

    //-- Reemplazar las palabras claves por su valores
    //-- en la plantilla HTML
    data = RESPUESTA.replace("NOMBRE", nombre);
    data = data.replace("APELLIDOS", apellidos);

    // Obtener el array de usuarios registrados
    let info = JSON.parse(DATOS);
    info_usuarios = info["users"]; 
    console.log(info_usuarios);

  }else if ((myURL.pathname.split(".")[1]) == 'css' || 'jpg' || 'png'){
    filename = myURL.pathname;
    data = filename.split("/")[1];
    data = fs.readFileSync(data,'utf-8');
  }else{
    filename = '/error.html';
    // * La página de error es un MIME tipo 'html'
    res.writeHead(404, {'Content-Type': 'text/html'});
    console.log('\n404: Not Found\n');
    res.write(ERROR);
    res.end();
  }

  // Construir solicitud vol.2
  type_file = filename.split(".")[1];
  filename = '.' + filename;
  console.log(' * Recurso solicitado: ' + filename);
  console.log(' * Extensión del recurso solicitado: ' + type_file);

   //-- Tipo de archivo
   const mime_type = {
    'html' : 'text/html',
    'css'  : 'text/css',
    'jpg'  : 'image/jpg',
    'png'  : 'image/png',
    'json' : 'application/json',
  };

  let mime = mime_type[type_file];
  console.log(' * Tipo de MIME: ' + mime);

  // Respuesta
  res.writeHead(200, {'Content-Type': mime});
  console.log('\n200: OK');
  res.write(data);
  res.end();
});

//-- Activo el servidor
server.listen(PUERTO);

console.log("Servidor activado. Escuchando en puerto: " + PUERTO);
