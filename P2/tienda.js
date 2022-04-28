//-- Definición de modulos y puerto
const http = require('http');
const url = require('url');
const fs = require('fs');

const PUERTO = 9090;

//-- HTML de la página de respuesta
const RESPUESTA = fs.readFileSync('form-resp.html', 'utf-8');


//-- Cargar fichero JSON 
const DATOS = fs.readFileSync('tienda.json','utf-8');

//-- Creo el servidor
const server = http.createServer((req, res) => {

  console.log('\nPetición recibida');

  //-- Construir el objeto url con la url de la solicitud
  let myURL = new URL(req.url, 'http://' + req.headers['host']);

  // Petición
  console.log(" * URL completa: " + myURL.href);
    // * Pathname devuelve el nombre de ruta de una URL
  console.log(" * Ruta: " + myURL.pathname);

  //-- Variables 
  let filename = "";
  let file = "";
  let user_enter = "";
  let password_enter = "";
  let info = JSON.parse(DATOS);


  //-- Analizar el recurso solicitado
  if (myURL.pathname == '/') {
    filename = '/main.html';

  }else if (myURL.pathname == '/procesar'){
    filename = '/form-resp.html';
    // Leer los parámetros
    user_enter = myURL.searchParams.get('usuario');
    password_enter = myURL.searchParams.get('contraseña');
    console.log(" - Nombre: " + user_enter);
    console.log(" - Apellidos: " + password_enter);
    
  }else{
    filename = myURL.pathname;
  }

  // Formalizar petición
  filename = '.' + filename;
  file = filename.slice(2);
  type_file = file.split(".")[1];
  console.log(' * Recurso solicitado: ' + filename);
  console.log(' * Extensión del recurso solicitado: ' + type_file);

  //-- Tipo de archivo
  const mime_type = {
    'html' : 'text/html',
    'css'  : 'text/css',
    'jpg'  : 'image/jpg',
    'ico'  : 'image/x-icon',
    'png'  : 'image/png',
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
      if (file == 'form-resp.html') {
        //-- Reemplazar las palabras claves por su valores
        //-- en la plantilla HTML
        data = RESPUESTA.replace("USUARIO", user_enter);
        data = data.replace("CONTRASEÑA", password_enter);

        let html_extra = "";

        //-- Recorrer el array de usuarios
        info["users"].forEach((element, index)=>{
            console.log("Usuarios registrados: " + (index + 1) + ": " + element["user"]);
            if(user_enter == element["user"]){
                html_extra = "<h2>USUARIO REGISTRADO<h2>";
                data = data.replace("HTML_EXTRA", html_extra);
            }
        });
      }else{
        data = fs.readFileSync(file);
      }
      res.write(data);
      res.end();
    }
  });
});

//-- Activo el servidor
server.listen(PUERTO);

console.log("Servidor activado. Escuchando en puerto: " + PUERTO + '\n');