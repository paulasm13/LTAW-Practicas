//-- Carga de dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');
const { text } = require('express');

const PUERTO = 8080;

//-- Servidor App express / Servidor websockets http
const app = express();
const server = http.Server(app);
const io = socket(server);

//-- Msg
const commands = 'Los comandos soportados son: /help, /list, /hello y /date.';
const welcome = 'BIENVENIDO AL CHAT!';
const user_in = 'El servidor te manda saludos. Bienvenido ';
// Fecha actual
const date_init = new Date(Date.now());
const date = date_init.toLocaleDateString();
// Nombre del usuario
const user_name =  [];

//-- Número de usuarios conectados
let num_users = 0;

//-- Entrada web
app.get('/', (req, res) => {
  res.send('Bienvenido a mi aplicación Web!!!' + '<p><a href="/chat.html">Chat</a></p>');
});

//-- Biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));

app.use(express.static('public'));

//-- GESTION SOCKETS IO
io.on('connect', (socket) => {
  
  // Evento de conexión
  console.log('** NUEVA CONEXIÓN **'.yellow);
  num_users += 1;
  socket.send(welcome);
  // 'broadcast.emit' envia a todos los clientes excepto al remitente
  let text = 'El usuario ' + socket.id + ' se ha conectado al chat';
  socket.broadcast.emit('message', text);

  // Evento de desconexión
  socket.on('disconnect', function(){
    console.log('** CONEXIÓN TERMINADA **'.yellow);
    num_users -= 1;
    let text = 'El usuario ' + socket.id + ' se ha desconectado del chat';
    socket.broadcast.emit('message', text);
  });  

  //-- Mensaje recibido: Reenviarlo a todos los clientes conectados
  socket.on("message", (msg)=> {
    console.log("Mensaje Recibido!: " + msg.blue);

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
          socket.send(user_in);
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

server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);