const express = require("express");
const router = express.Router();
const pool = require("../views/database");
const keys = require("../views/keys");
const consultas = require("../scripts/queries");
const util = require("../scripts/util/util");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const messages = require("../scripts/messages");
const { body, validationResult } = require("express-validator");

router.post(
  "/login",
  body("username").not().isEmpty().trim().escape().isEmail().normalizeEmail(),
  body("password").not().isEmpty().trim().escape(),
  (req, res) => {
    //Valida los campos
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    pool.query(
      consultas.AUTHUSU,
      [username, hashedPassword],
      (err, rows, fields) => {
        if (err) throw err;
        else {
          if (rows.length > 0) {
            let data = JSON.stringify(rows[0]);
            const token = jwt.sign({ data: data }, keys.secretUsu, {
              expiresIn: "1h",
            });
            res.cookie("token", token, { httpOnly: true });
            res.json({ status: 201, data: token });
          } else {
            res.json({ status: 401, data: messages.errors.invalidCredentials });
          }
        }
      },
    );
  },
);

//Para recuperar contraseña
router.post("/recoverPassword", (req, res) => {
  const { email } = req.body;

  // Verificar si el token está presente en la cookie
  //const token = req.cookies.token;
  // if (token) {
  pool.query(consultas.RECOVERPASSWORD, email, (err, rows, fields) => {
    if (!err) {
      if (rows.length > 0) {
        let data = JSON.stringify(rows[0]);
        //Genera una contraseña provicional
        const password = util.generatePassword();
        console.log("contraseña generada" + password);
        //Actualiza la contraseña
        const hashedPassword = crypto
          .createHash("sha256")
          .update(password)
          .digest("hex");
        pool.query(
          consultas.UPDATEPASSWORD,
          [hashedPassword, email],
          (err, rows, fields) => {
            if (!err) {
              console.log("Update exitoso");
            } else {
              console.log(err);
            }
          },
        );
        //Mensaje y asusnto para enviar en un correo automatico
        const subject = "Nueva contraseña Gloria Lopez";
        const content = ` Su nueva contraseña provisional es: ${password} 
                        Por favor, cambie su contraseña en cuanto pueda. `;
        //Envia el correo
        util.sendMail(email, subject, content);
        res.json("Enviado correctamente");
      } else {
        console.log("no se encontro");
      }
    } else {
      console.log(err);
    }
  });
  /* } else {
        // Redirigir a la página de inicio de sesión
        res.redirect('/logout');
    }*/
});

//Cerrar la session
router.get("/logout", (req, res) => {
  //Limpia la cookie
  res.clearCookie("token");
  res.send("Cierre de sesión exitoso");
});

router.post("/singUp", (req, res) => {
  const {
    nombre,
    idTipoDocumento,
    numeroDocumento,
    celular,
    correo,
    contrasena,
  } = req.body;

  const validaCorreo = util.checkIfExists(
    correo,
    consultas.VERIFICARCORREOUSUARIO,
  );
  const validaDocumento = util.checkIfExists(
    numeroDocumento,
    consultas.VERIFICARDOCUMENTOUSUARIO,
  );
  if (!validaCorreo && !validaDocumento) {
    const hashedPassword = crypto
      .createHash("sha256")
      .update(contrasena)
      .digest("hex");
    pool.query(
      consultas.INSERTUSUARIO,
      [
        nombre,
        idTipoDocumento,
        numeroDocumento,
        celular,
        correo,
        hashedPassword,
      ],
      (err, rows, fields) => {
        if (!err) {
          res.json("Insertado correctamente");
        } else {
          console.log(err);
        }
      },
    );
  } else {
    res.json("Este usuario ya esta registrado");
  }
});

//Actualizar registro
router.post("/update", (req, res) => {
  const {
    id,
    nombre,
    id_tipo_documento,
    numero_documento,
    celular,
    correo,
    contrasena,
  } = req.body;
  const hashedPassword = crypto
    .createHash("sha256")
    .update(contrasena)
    .digest("hex");
  pool.query(
    consultas.UPDATEUSUARIO,
    [
      nombre,
      id_tipo_documento,
      numero_documento,
      celular,
      correo,
      hashedPassword,
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
module.exports = router;
