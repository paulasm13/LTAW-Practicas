const electron = require('electron');
const address = require('ip');
const qrcode = require('qrcode');

console.log("Hola desde el proceso de la web...");

//-- Obtener elementos de la interfaz
const btn_prueba = document.getElementById("btn_prueba");
const v_node = document.getElementById("v_node");
const v_chrome = document.getElementById("v_chrome");
const v_electron = document.getElementById("v_electron");
const arq = document.getElementById("arq");
const plat = document.getElementById("plat");
const direct = document.getElementById("direct");
    // Número de usuarios y dirección IP
const users_in = document.getElementById("users_in");
const ip = document.getElementById("ip");
    // Mensajes asociados al evento Print
const print = document.getElementById("print");
    // Código QR
const qr = document.getElementById("qr");


//-- Acceder a la API de node para obtener la info
//-- Sólo es posible si nos han dado permisos desde
//-- el proceso princpal
v_node.textContent = process.versions.node;
v_chrome.textContent = process.versions.chrome;
v_electron.textContent = process.versions.electron;
arq.textContent = process.arch;
plat.textContent = process.platform;
direct.textContent = process.cwd();

users_in.innerHTML = 0;

//-- Dirección IP
electron.ipcRenderer.on('ip', (event, address) => {
    console.log(address);
    ip.textContent = address;

    // Código QR
    qrcode.toDataURL(address, function (err, url) {
        console.log("Imprimiendo codigo qr");
        qr.src = url;
    });
});


//-- Número de usuarios
electron.ipcRenderer.on('users_in', (event, num_users) => {
    console.log("Recibido: " + num_users);
    users_in.textContent = num_users;
});


//-- Botón de prueba
btn_prueba.onclick = () => {
    print.innerHTML += "* Mensaje de prueba *" + `<br>`;
    console.log("Botón apretado!");

    //-- Enviar mensaje al proceso principal
    electron.ipcRenderer.invoke('print', "MENSAJE DE PRUEBA: Boton apretado");
}

//-- Mensaje asociado al evento Print
electron.ipcRenderer.on('print', (event, msg) => {
    console.log("Recibido: " + msg);
    print.innerHTML += '> ' + msg + `<br>`;
});