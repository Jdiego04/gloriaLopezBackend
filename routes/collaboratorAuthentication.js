const express = require("express");
const router = express.Router();
const pool = require("../views/database");
const keys = require("../views/keys");
const queries = require("../scripts/queries");
const util = require("../scripts/util/util");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { body, validationResult } = require("express-validator");
const messages = require("../scripts/messages");

router.post(
  "/login",
  body("username").not().isEmpty().trim().escape().isEmail(),
  body("password").not().isEmpty().trim().escape(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: 400, data: errors.array() });
    }

    const { username, password } = req.body;
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    pool.query(
      queries.collaborator.collaboratorAuthentication,
      [username, hashedPassword],
      (err, rows, fields) => {
        if (!err) {
          if (rows.length > 0) {
            let data = JSON.stringify(rows[0]);
            const token = jwt.sign({ data: data }, keys.secretEmp, {
              expiresIn: "1h",
            });
            res.cookie("token", token, { httpOnly: true });
            res.json({ status: 400, data: { token, data } });
          } else {
            res.json({ status: 200, data: messages.errors.invalidCredentials });
          }
        } else {
          console.log(err);
        }
      },
    );
  },
);

router.post("/recoverPassword", (req, res) => {
  const { email } = req.body;

  // Verificar si el token está presente en la cookie
  //const token = req.cookies.token;
  // if (token) {
  pool.query(queries.recoverPassword, email, (err, rows, fields) => {
    if (err) throw err;
    else {
      if (rows.length > 0) {
        //Genera una contraseña provicional
        const password = util.generatePassword();
        const hashedPassword = crypto
          .createHash("sha256")
          .update(password)
          .digest("hex");
        //Actualiza la contraseña
        pool.query(
          queries.collaborator.updatePassword,
          [password, email],
          (err, rows, fields) => {
            if (err) throw err;
            else {
              const subject = "Nueva contraseña Gloria Lopez";
              const content = ` Su nueva contraseña provisional es: ${password} 
                    Por favor, cambie su contraseña en cuanto pueda. `;
              //Envia el correo
              util.sendMail(email, subject, content);
              res.json({
                status: 200,
                data: messages.succesMessage.updatedSuccessfully,
              });
            }
          },
        );
      } else {
        res.json({ status: 200, data: messages.errors.notExist });
      }
    }
  });
  /* } else {
      // Redirigir a la página de inicio de sesión
      res.redirect('/logout');
  }*/
});

router.post("/updatePassword", (req, res) => {
  const { password, email } = req.body;

  // Verificar si el token está presente en la cookie
  //const token = req.cookies.token;
  // if (token) {

  pool.query(
    queries.collaborator.updatePassword,
    [password, email],
    (err, rows, fields) => {
      if (err) throw err;
      else {
        res.json({
          status: 200,
          data: messages.succesMessage.updatedSuccessfully,
        });
      }
    },
  );

  /* } else {
      // Redirigir a la página de inicio de sesión
      res.redirect('/logout');
  }*/
});
router.post("/singUp", (req, res) => {
  const {
    names,
    firstLastname,
    secondLastname,
    documentTypeId,
    collaboratorId,
    contactNumber,
    email,
    password,
    entryDate,
    birthDate,
    positionId,
  } = req.body;

  /* const validaCorreo = util.checkIfExists(
    correo,
    consultas.VERIFICARCORREOEMPLEADO,
  );
  const validaDocumento = util.checkIfExists(
    numeroDocumento,
    consultas.VERIFICARDOCUMENTOEMPLEADO,
  );*/
  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
  // if (!validaCorreo && !validaDocumento) {
  pool.query(
    queries.collaborator.newCollaborator,
    [
      names,
      firstLastname,
      secondLastname,
      documentTypeId,
      collaboratorId,
      contactNumber,
      email,
      hashedPassword,
      entryDate,
      birthDate,
      positionId,
    ],
    (err, rows, fields) => {
      if (err) throw err;
      else {
        res.json({
          status: 200,
          data: messages.succesMessage.insertedSuccessfully,
        });
      }
    },
  );
  /* } else {
    res.json("Este usuario ya esta registrado");
  }*/
});

/*router.post("/deactivate", (req, res) => {
  //Se le envia en activo lo que se quiere cambiar
  const { idEmpleado } = req.body;
  pool.query(
    consultas.DEACTIVATEEMPLEADO,
    [idEmpleado],
    (err, rows, fields) => {
      if (!err) {
        res.json("Se cambio el estado con exito");
      } else {
        console.log(err);
      }
    },
  );
});

//Actualizar registro
router.put("/update", (req, res) => {
  const {
    id,
    nombre,
    fechaNacimiento,
    fechaIngreso,
    direccion,
    idTipoDocumento,
    numeroDocumento,
    correo,
    celular,
    contrasena,
    idRol,
    idTipoEmpleado,
  } = req.body;

  const hashedPassword = crypto
    .createHash("sha256")
    .update(contrasena)
    .digest("hex");
  pool.query(
    consultas.UPDATEEMPLEADO,
    [
      nombre,
      fechaNacimiento,
      fechaIngreso,
      direccion,
      idTipoDocumento,
      numeroDocumento,
      correo,
      celular,
      hashedPassword,
      idRol,
      idTipoEmpleado,
      id,
    ],
    (err, rows, fields) => {
      if (!err) {
        res.json("Actualizado correctamente");
      } else {
        console.log(err);
      }
    },
  );
});

//Cerrar la session
router.get("/logout", (req, res) => {
  //Limpia la cookie
  res.clearCookie("token");
  res.send("Cierre de sesión exitoso");
});
*/
//JSON con mensajes de errores
{
  "errors"[
    {
      location: "body",
      msg: "Invalid value",
      param: "username",
    }
  ];
}

module.exports = router;
