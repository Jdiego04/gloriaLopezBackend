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


app.use(cors()); // no tocar si nno queire dañar el proyecto 
app.use(require('../routes/index'));
app.use(require('../routes/authenticationEmpleado'));
app.use(require('../routes/authenticationUsuario'));
app.use(require('../routes/registro'));


app.use('/proveedor', require('../routes/proveedor'));
app.use('/authEmp', require('../routes/authenticationEmpleado'));
app.use('/authUsu', require('../routes/authenticationUsuario'));
app.use('/reg', require('../routes/registro'));
app.use('/productos', require('../routes/productos'));
app.use('/empleado',require('../routes/empleado'));
app.use('/servicio',require('../routes/servicio'));


//Starting the server

app.listen(app.get('port'), (err) => {
    if (err) {
    console.log('Error al iniciar el servidor: ' + err)
    }
    console.log('Server inciando en el puerto: ' + app.get('port'));
});