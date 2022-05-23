const electron = require('electron');
const address = require('ip');

console.log("Hola desde el proceso de la web...");

//-- Obtener elementos de la interfaz
const v_node = document.getElementById("v_node");
const v_chrome = document.getElementById("v_chrome");
const v_electron = document.getElementById("v_electron");

//-- Acceder a la API de node para obtener la info
//-- Sólo es posible si nos han dado permisos desde
//-- el proceso princpal
v_node.textContent = process.versions.node;
v_chrome.textContent = process.versions.chrome;
v_electron.textContent = process.versions.electron;

