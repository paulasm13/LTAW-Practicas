//-- Carga de dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');

const PUERTO = 8080;

//-- Servidor App express / Servidor websockets http
const app = express();
const server = http.Server(app);
const io = socket(server);

//-- Msg
const commands = 'Los comandos soportados son: /help, /list, /hello y /date.';
const welcome = 'BIENVENIDOS AL CHAT!';
const in = ' se ha iniciado en el chat, bienvenido.';
const out = ' ha abandonado el chat, hasta pronto.';

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

  // Evento de desconexión
  socket.on('disconnect', function(){
    console.log('** CONEXIÓN TERMINADA **'.yellow);
    num_users -= 1;

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
          console.log('Nuevo usuario conectado.');
          socket.send(in);
          break;
        case '/date':
          break;
      }
    }

    //-- Reenviarlo a todos los clientes conectados
    io.send(msg);
  });

});

server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);