//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");
const enter = document.getElementById("send");
const audio = new Audio('sonido.mp3');

//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();


socket.on("message", (msg)=>{
  display.innerHTML += '<p style="color:blue">' + msg + '</p>';
});


//-- Al apretar botón 'intro' se envía un mensaje al servidor
send.onclick = () => {
  if (mesg_entry.value){
      socket.send(msg_entry.value);
      console.log('Mensaje enviado');
      audio.play();
  }
  //-- Borrar el mensaje actual
  msg_entry.value = "";
}


//-- Al apretar tecla 'intro' se envía un mensaje al servidor
msg_entry.onchange = () => {
  if (msg_entry.value)
    socket.send(msg_entry.value);
    console.log('Mensaje enviado');
    audio.play();

  //-- Borrar el mensaje actual
  msg_entry.value = "";
}