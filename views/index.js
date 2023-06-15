//En este archivo arranca la aplicación

const express = require('express');
const morgan = require('morgan');
const passport =require ('passport'); 
const cors =require ('cors'); 

//Initializations

const app = express();
const port = (process.env.port || 3000);
require("../lib/passport");

//Settings

app.set('port', port);

//Middlewares (funciones que se ejecutan cada vez que un usuario manda una petición)

app.use(morgan('dev')); //Utiliza el modulo morgan y lo ejecuta con la palara 'dev'
app.use(express.json());



//Routes


app.use(cors()); 
app.use(require('../routes/index'));
app.use(require('../routes/authenticationEmpleado'));
app.use(require('../routes/authenticationUsuario'));
app.use(require('../routes/empleado'));
app.use(require('../routes/estadoCita'));
app.use(require('../routes/pqrs'));
app.use(require('../routes/productos'));
app.use(require('../routes/proveedor'));
app.use(require('../routes/rol'));
app.use(require('../routes/servicio'));
app.use(require('../routes/tipoDocumento'));
app.use(require('../routes/tipoEmpleado'));
app.use(require('../routes/tipoProducto'));
app.use(require('../routes/usuario'));



app.use('/authEmp', require('../routes/authenticationEmpleado'));
app.use('/authUsu', require('../routes/authenticationUsuario'));
app.use('/empleado',require('../routes/empleado'));
app.use('/estadoCita',require('../routes/estadoCita'));
app.use('/pqrs',require('../routes/pqrs'));
app.use('/productos', require('../routes/productos'));
app.use('/proveedor', require('../routes/proveedor'));
app.use('/rol', require('../routes/rol'));
app.use('/servicio',require('../routes/servicio'));
app.use('/tipoDoc', require('../routes/tipoDocumento'));
app.use('/tipoEmpleado', require('../routes/tipoEmpleado'));
app.use('/tipoProducto', require('../routes/tipoProducto'));
app.use('/usuario', require('../routes/usuario'));

//Starting the server

app.listen(app.get('port'), (err) => {
    if (err) {
    console.log('Error al iniciar el servidor: ' + err)
    }
    console.log('Server inciando en el puerto: ' + app.get('port'));
});