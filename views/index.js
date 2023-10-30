//En este archivo arranca la aplicación

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

//Initializations
const app = express();
const port = process.env.port || 3000;

//Settings
app.set("port", port);

//Middlewares (funciones que se ejecutan cada vez que un usuario manda una petición)

app.use(morgan("dev")); //Utiliza el modulo morgan y lo ejecuta con la palara 'dev'
app.use(express.json());

//Routes
app.use(cors());
app.use(require("../routes/documentType"));
app.use(require("../routes/serviceAppointment"));
app.use(require("../routes/service"));
app.use(require("../routes/serviceProvider"));
/*
app.use(require('../routes/index'));
app.use(require('../routes/authenticationColaborador'));
app.use(require('../routes/authenticationCliente'));
app.use(require('../routes/colaborador'));
app.use(require('../routes/estadoCita'));
app.use(require('../routes/pqrs'));
app.use(require('../routes/productos'));
app.use(require('../routes/proveedor'));
app.use(require('../routes/rol'));

app.use(require('../routes/tipoEmpleado'));
app.use(require('../routes/tipoProducto'));
app.use(require('../routes/usuario'));*/

app.use("/documentType", require("../routes/documentType"));
app.use("/serviceAppointment", require("../routes/serviceAppointment"));
app.use("/service", require("../routes/service"));
app.use("/serviceProvider", require("../routes/serviceProvider"));
/*app.use('/authEmp', require('../routes/authenticationColaborador'));
app.use('/authUsu', require('../routes/authenticationCliente'));
app.use('/colaborador',require('../routes/colaborador'));
app.use('/estadoCita',require('../routes/estadoCita'));
app.use('/pqrs',require('../routes/pqrs'));
app.use('/productos', require('../routes/productos'));
app.use('/proveedor', require('../routes/proveedor'));
app.use('/rol', require('../routes/rol'));

app.use('/tipoEmpleado', require('../routes/tipoEmpleado'));
app.use('/tipoProducto', require('../routes/tipoProducto'));
app.use('/usuario', require('../routes/usuario'));*/

//Starting the server
app.listen(app.get("port"), (err) => {
  if (err) {
    console.log("Error al iniciar el servidor: " + err);
  }
  console.log("Server inciando en el puerto: " + app.get("port"));
});
