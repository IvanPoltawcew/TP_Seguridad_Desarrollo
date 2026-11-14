require("express-async-errors"); // captura errores en promesas, usar async await
const express = require("express");
const path = require("path");

// leer archivo de configuracion
require('dotenv').config();

console.log("base", process.env.base);
console.log("NODE_ENV", process.env.NODE_ENV);

// crear servidor
const app = express();

// configurar servidor
const cors = require("cors");

app.use(cors({
    origin: true,  // El dominio del frontend al que permites el acceso
    credentials: true,              // Permite enviar y recibir cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', '*'],  // Encabezados permitidos
}));

const cookieParser = require("cookie-parser");
app.use(cookieParser()); // entiende cookies

app.use(express.text()); // entiende texto
app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
app.use(express.json()); // para poder leer json en el body

// sirve archivos estaticos
app.use("/", express.static(path.join(__dirname, "public")));


const routerLogin = require("./routes/login.js");

const ecoRouter = require("./routes/eco.js");
const erroresRouter = require("./routes/errores.js");
const catalogosRouter = require("./routes/catalogos.js");
const validateIdentity = require("./middleware/validateIdentity.js");
const routerCloseSession = require("./routes/closeSession.js");

app.use(routerLogin);
app.use(validateIdentity,ecoRouter)
app.use(validateIdentity,erroresRouter)
app.use(validateIdentity,catalogosRouter);
app.use(validateIdentity, routerCloseSession)


//------------------------------------
//-- Control de errores --------------
//------------------------------------
const { errorHandler, _404Handler } = require("./error-handler/errorhandler");
app.use(errorHandler);
app.use(_404Handler);


//------------------------------------
//-- INICIO ---------------------------
//------------------------------------

if (!module.parent) {   // si no es llamado por otro modulo, es decir, si es el modulo principal -> levantamos el servidor
  const port = process.env.PORT || 3002;   // en produccion se usa el puerto de la variable de entorno PORT
  app.locals.fechaInicio = new Date();
  app.listen(port, () => {
    console.log(`sitio escuchando en el puerto ${port}`);
  });
}

module.exports = app;