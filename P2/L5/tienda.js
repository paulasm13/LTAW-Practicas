//-- Crear una variable con la estructura definida
//-- en un fichero JSON

const fs = require('fs');

//-- Npmbre del fichero JSON a leer
const FICHERO_JSON = "tienda.json"

//-- NOmbre del fichero JSON de salida
const FICHERO_JSON_OUT = "tienda.json"

//-- Leer el fichero JSON
const  tienda_json = fs.readFileSync(FICHERO_JSON);

//-- Crear la estructura tienda a partir del contenido del fichero
const tienda = JSON.parse(tienda_json);

//-- Mostrar informacion sobre la tienda
console.log("Número de usuarios registrados: " + tienda["users"].length);

//-- Recorrer el array de usuarios
tienda["users"].forEach((element, index)=>{
  console.log("Usuarios: " + (index + 1) + ": " + element["nombre"]);
});

console.log("Productos en la tienda: " + tienda["products"].length);

//-- Recorrer el array de productos e incrementar su stock
tienda["products"].forEach((element, index)=>{
  console.log("Producto: " + (index + 1) + ": " + element["nombre"] + " / " + element["descripcion"] + " / " + element["stock"]);
  element["stock"] = element["stock"] + 1;
});

console.log("Pedidos pendientes: " + tienda["orders"].length);

//-- Recorrer el array de pedidos
tienda["orders"].forEach((element, index)=>{
  console.log("Pedidos pendientes: " + (index + 1) + ": " + element["usuario"] + " / " + element["direccion"] + " / " + element["tarjeta"] + " / " + element["productos"]);
});

//-- Convertir la variable a cadena JSON
let myJSON = JSON.stringify(tienda);

//-- Guardar cambios en el fichero destino
fs.writeFileSync(FICHERO_JSON_OUT, myJSON);