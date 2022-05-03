//-- Definición de modulos y puerto
const http = require('http');
const url = require('url');
const fs = require('fs');

const PUERTO = 9090;

//-- Leer ficheros

// HTML de la página de respuesta
const RESPUESTA = fs.readFileSync('form-resp.html', 'utf-8');
// HTML de la página de respuesta de error
const LOGIN_ERROR = fs.readFileSync('form-resp-error.html', 'utf-8');
// HTML de la página principal con login
const MAIN_LOGIN = fs.readFileSync('main_login.html', 'utf-8');
// HTML de los productos
const PRODUCTO1 = fs.readFileSync('libro1.html', 'utf-8');
const PRODUCTO2 = fs.readFileSync('libro2.html', 'utf-8');
const PRODUCTO3 = fs.readFileSync('libro3.html', 'utf-8');
const PRODUCTO4 = fs.readFileSync('libro4.html', 'utf-8');
const PRODUCTO5 = fs.readFileSync('libro5.html', 'utf-8');
const PRODUCTO6 = fs.readFileSync('libro6.html', 'utf-8');


//-- Cargar fichero JSON y registro
const DATOS = fs.readFileSync('tienda.json','utf-8');
let info = JSON.parse(DATOS);
let register = [];
let products = [];

// Usuarios en el registro
info["users"].forEach((element, index)=>{
  console.log("Usuarios registrados: " + (index + 1) + "/ " + element["nombre"]);
  register.push(element["nombre"]);
});   

// Productos en el registro
info["products"].forEach((element, index)=>{
  console.log("Productos registrados: " + (index + 1) + "/ " + element["nombre"] + "/ " + element["descripcion"]
              + "/ " + element["seccion"] + "/ " + element["precio"] + "/ " + element["stock"]);
  products.push(element["nombre"], element["descripcion"], element["seccion"], element["precio"], element["stock"]);
});   


//-- Cookies

// Usuario
function get_user(req) {
  // Leer cookies
  const cookie = req.headers.cookie;
  if (cookie) {
    //-- Obtener un array con todos los pares user=valor
    let pares = cookie.split(";");
    //-- Variable para guardar el usuario y la contraseña
    let user_cookie;
    //-- Recorrer todos los pares user=valor
    pares.forEach((element) => {
      //-- Obtener los nombres y valores por separado
      let [nombre, valor] = element.split('=');
      //-- Leer el usuario
      //-- Solo si el nombre es 'user'
      if (nombre.trim() === 'user') {
        user_cookie = valor;
      }
    });

    //-- Si la variable user no está asignada
    //-- se devuelve null
    return user_cookie || null;
  }
}


//-- Creo el servidor
const server = http.createServer((req, res) => {

  console.log('\nPetición recibida');

  // Construir el objeto url con la url de la solicitud
  let myURL = new URL(req.url, 'http://' + req.headers['host']);

  // Petición
  console.log(" * URL completa: " + myURL.href);
  console.log(" * Ruta: " + myURL.pathname);

  // Variables 
  let filename = "";
  let file = "";
  let user_enter = "";
  let html_extra = "";
  let user_cookie = get_user(req);

  // Analizar el recurso solicitado
  if (myURL.pathname == '/' || myURL.pathname == '/main.html') {
    // En caso de estar conectado...
    if (user_cookie){
      filename = '/main_login.html';
    }else{
      filename = '/main.html';
    }

  }else if (myURL.pathname == '/procesar'){
    // Leer los parámetros
    user_enter = myURL.searchParams.get('usuario');

    if (register.includes(user_enter)) {
      // Envio de cookies
      res.setHeader('Set-Cookie', "user=" + user_enter);
      filename = '/form-resp.html';
      html_extra = "<h2>¡Bienvenido!<h2>";
      console.log("REGISTRADO, COOKIES ENVIADAS.");
    }else{
      filename = '/form-resp-error.html';
      html_extra = "<h2>ERROR. Usuario desconocido.<h2>";
    }

  }else if (myURL.pathname == '/producto1'){
    filename = './producto1.html';
  }else{

    filename = myURL.pathname;
  }

  //-- Formalizar petición
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
    // Fichero no encontrado, página de error
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      console.log('\n404: Not Found');
      file = './error.html';
      data = fs.readFileSync(file);
      res.write(data);
      res.end();
    }else{
      res.writeHead(200, {'Content-Type': mime});
      console.log('\n200: OK');
      data = fs.readFileSync(file);
      if(file == 'form-resp.html'){
        data = RESPUESTA.replace("USUARIO", user_enter);
        data = data.replace("HTML_EXTRA", html_extra);
      }
      if(file == 'main_login.html'){
        data = MAIN_LOGIN.replace("LOGIN", user_cookie);
      }
      if(file == 'form-resp-error.html'){
        data = LOGIN_ERROR.replace("USUARIO", user_enter);
        data = data.replace("HTML_EXTRA", html_extra);
      }
      if(file == 'libro1.html'){
        data = PRODUCTO1.replace("NOMBRE", products[0]);
        data = data.replace("DESCRIPCION", products[1]);
        data = data.replace("SECCION", products[2]);
        data = data.replace("PRECIO", products[3]);
        data = data.replace("STOCK", products[4]);
      }
      if(file == 'libro2.html'){
        data = PRODUCTO2.replace("NOMBRE", products[5]);
        data = data.replace("DESCRIPCION", products[6]);
        data = data.replace("SECCION", products[7]);
        data = data.replace("PRECIO", products[8]);
        data = data.replace("STOCK", products[9]);
      }
      if(file == 'libro3.html'){
        data = PRODUCTO3.replace("NOMBRE", products[10]);
        data = data.replace("DESCRIPCION", products[11]);
        data = data.replace("SECCION", products[12]);
        data = data.replace("PRECIO", products[13]);
        data = data.replace("STOCK", products[14]);
      }
      if(file == 'libro4.html'){
        data = PRODUCTO4.replace("NOMBRE", products[15]);
        data = data.replace("DESCRIPCION", products[16]);
        data = data.replace("SECCION", products[17]);
        data = data.replace("PRECIO", products[18]);
        data = data.replace("STOCK", products[19]);
      }
      if(file == 'libro5.html'){
        data = PRODUCTO5.replace("NOMBRE", products[20]);
        data = data.replace("DESCRIPCION", products[21]);
        data = data.replace("SECCION", products[22]);
        data = data.replace("PRECIO", products[23]);
        data = data.replace("STOCK", products[24]);
      }
      if(file == 'libro6.html'){
        data = PRODUCTO6.replace("NOMBRE", products[25]);
        data = data.replace("DESCRIPCION", products[26]);
        data = data.replace("SECCION", products[27]);
        data = data.replace("PRECIO", products[28]);
        data = data.replace("STOCK", products[29]);
      }
      res.write(data);
      res.end();
    }
  });
});

//-- Activo el servidor
server.listen(PUERTO);
console.log("Servidor activado. Escuchando en puerto: " + PUERTO + '\n');