//-- Carga de dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');
const ip = require('ip');

const PUERTO = 8080;

//-- Servidor App express / Servidor websockets http
const app = express();
const server = http.Server(app);
const io = socket(server);

//-- Cargar el módulo de electron
const electron = require('electron');

//-- Msg
const commands = 'Los comandos soportados son: /help, /list, /hello y /date.';
const welcome = '¡BIENVENIDO AL CHAT!';
const user_in = 'El servidor te manda saludos. ¡Bienvenido ';
// Fecha actual
const date_init = new Date(Date.now());
const date = date_init.toDateString();

//-- Número de usuarios conectados
let num_users = 0;

//-- Dirección IP
let address = 'http://' + ip.address()+ ':'+ PUERTO + '/public/chat.html';
console.log(address);

//-- Entrada web
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/chat.html');
});

//-- Biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));

app.use(express.static('public'));

//-- GESTION SOCKETS IO
io.on('connect', (socket) => {
  
  // Evento de conexión
  console.log('** NUEVA CONEXION **'.yellow);
  num_users += 1;
  socket.send(welcome);
  // 'broadcast.emit' envia a todos los clientes excepto al remitente
  let text = 'El usuario ' + socket.id + ' se ha conectado al chat.';
  socket.broadcast.emit('message', text);
  win.webContents.send('users_in', num_users);

  // Evento de desconexión
  socket.on('disconnect', function(){
    console.log('** CONEXION TERMINADA **'.yellow);
    num_users -= 1;
    let text = 'El usuario ' + socket.id + ' se ha desconectado del chat.';
    socket.broadcast.emit('message', text);
    win.webContents.send('users_in', num_users);

  });  

  //-- Mensaje recibido: Reenviarlo a todos los clientes conectados
  socket.on("message", (msg)=> {
    console.log("Mensaje Recibido!: " + msg.blue);

    win.webContents.send('print', msg); 


    // Comandos especiales
    if (msg.startsWith('/')) {
      switch(msg){
        case '/list':
          console.log('Conteo de usuarios.'.green);
          socket.send('Hay ' + num_users + ' usuarios conectados.');
          break;
        case '/help':
          console.log('Lista de comandos.'.green);
          socket.send(commands);          
          break;
        case '/hello':
          console.log('Saludo del servidor.'.green);
          socket.send(user_in + socket.id + '!');
          break;
        case '/date':
          console.log('Consulta de la fecha.'.green);
          socket.send(date);
          break;
        default:
          console.log('Comando inválido'.green);
          socket.send('Comando inválido. Introduzca */help* para visualizar los comandos válidos.');
          break;
      }
    }

    //-- Reenviarlo a todos los clientes conectados
    io.send(' > ' + msg);
  });

});


//-- ELECTRON
console.log("Arrancando electron...");

//-- Variable global para acceder a la ventana principal
let win = null;

//-- Cuando Electron está listo, ejecuta la función.
electron.app.on('ready', () => {
    console.log("Evento Ready!");

    //-- Crear la ventana principal de nuestra aplicación
    win = new electron.BrowserWindow({
        width: 600,   //-- Anchura 
        height: 600,  //-- Altura

        //-- Permitir que la ventana tenga ACCESO AL SISTEMA
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
    });

  //-- Cargar interfaz gráfica en HTML
  win.loadFile("index.html");

  //-- Esperar a que la página se cargue y se muestre
  //-- y luego enviar el mensaje al proceso de renderizado para que 
  //-- lo saque por la interfaz gráfica
  win.on('ready-to-show', () => {
    win.webContents.send('ip', address);
  });

});


//-- Si llega un evento al que hemos llamado print,
// imprime ese mensaje en la consola.
electron.ipcMain.handle('print', (event, msg) => {
  console.log("Mensaje: " + msg);
  io.send(msg);
});


server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);