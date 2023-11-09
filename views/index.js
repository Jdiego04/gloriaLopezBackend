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
app.use(require("../routes/service"));
app.use(require("../routes/provider"));
app.use(require("../routes/collaboratorAuthentication"));
app.use(require("../routes/modules"));
app.use(require("../routes/pqrs"));
app.use(require("../routes/clientAuthentication"));
app.use(require("../routes/collaborator"));

app.use(require("../routes/client"));
app.use(require("../routes/appointment"));
app.use(require("../routes/position"));
app.use(require("../routes/category"));
/*app.use(require('../routes/report'));*/

app.use("/documentType", require("../routes/documentType"));
app.use("/service", require("../routes/service"));
app.use("/provider", require("../routes/provider"));
app.use(
  "/collaboratorAuthentication",
  require("../routes/collaboratorAuthentication"),
);
app.use("/modules", require("../routes/modules"));
app.use("/pqrs", require("../routes/pqrs"));
app.use("/collaborator", require("../routes/collaborator"));
app.use("/clientAuthentication", require("../routes/clientAuthentication"));

app.use("/client", require("../routes/client"));
app.use("/appointment", require("../routes/appointment"));
app.use("/position", require("../routes/position"));
app.use("/category", require("../routes/category"));
/*app.use('/report', require('../routes/report'));*/

//Starting the server
app.listen(app.get("port"), (err) => {
  if (err) {
    console.log("Error al iniciar el servidor: " + err);
  }
  console.log("Server inciando en el puerto: " + app.get("port"));
});
