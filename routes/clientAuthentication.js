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
const validation = require("../scripts/util/validation");

router.post(
  "/login",
  body("username").not().isEmpty().trim().escape().isEmail(),
  body("password").not().isEmpty().trim().escape(),
  (req, res) => {
    try {
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
        queries.client.clientAuthentication,
        [username, hashedPassword],
        (err, rows, fields) => {
          if (!err) {
            if (rows.length > 0) {
              let data = JSON.stringify(rows[0]);
              const token = jwt.sign({ data: data }, keys.secretUsu, {
                expiresIn: "1h",
              });
              res.cookie("token", token, { httpOnly: true });
              res.json({ status: 200, data: { token } });
            } else {
              res.json({
                status: 400,
                data: messages.errors.invalidCredentials,
              });
            }
          } else {
          }
        },
      );
    } catch (error) {
      res.json({ status: 400, data: error });
    }
  },
);

router.post("/recoverPassword", (req, res) => {
  try {
    const { email } = req.body;

    pool.query(queries.client.recoverPassword, email, (err, rows, fields) => {
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
            queries.client.updatePassword,
            [hashedPassword, email],
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
          res.json({ status: 400, data: messages.errors.notExist });
        }
      }
    });
  } catch (error) {
    res.json({ status: 400, data: error });
  }
});

router.post("/updatePassword", validation.validateToken, (req, res) => {
  try {
    const { password, email } = req.body;

    pool.query(
      queries.client.updatePassword,
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
  } catch (error) {
    res.json({
      status: 400,
      data: error,
    });
  }
});

router.post("/singUp", async (req, res) => {
  try {
    const {
      names,
      firstLastname,
      secondLastname,
      documentTypeId,
      clientId,
      contactNumber,
      email,
      password,
      birthDate,
    } = req.body;

    const validateEmail = await util.checkIfExists(
      messages.tables.tblClient,
      "Correo_Electronico",
      email,
    );

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    if (!validateEmail) {
      pool.query(
        queries.client.newClient,
        [
          names,
          firstLastname,
          secondLastname,
          documentTypeId,
          clientId,
          contactNumber,
          email,
          hashedPassword,
          birthDate,
        ],
        (err, rows, fields) => {
          if (err) throw err;
          else {
            const otp = util.generateOTP();
            const subject = "Codigo de verificacion";
            const content = ` Su codigo de verificacion es: ${otp} `;
            //Envia el correo
            util.sendMail(email, subject, content);
            pool.query(
              queries.otp.newOtp,
              [clientId, documentTypeId, otp],
              (err, rows, fields) => {
                if (err) throw err;
                else {
                  res.json({
                    status: 201,
                    data: messages.succesMessage.insertedSuccessfully,
                  });
                }
              },
            );
          }
        },
      );
    } else {
      res.json({
        status: 400,
        data: messages.errors.exist,
      });
    }
  } catch (error) {
    res.json({
      status: 400,
      data: error,
    });
  }
});

//Actualizar registro
router.put("/update", validation.validateToken, (req, res) => {
  try {
    const {
      names,
      firstLastname,
      secondLastname,
      contactNumber,
      clientId,
      documentTypeId,
    } = req.body;

    pool.query(
      queries.client.updateClient,
      [
        names,
        firstLastname,
        secondLastname,
        contactNumber,
        clientId,
        documentTypeId,
      ],
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
  } catch (error) {
    res.json({
      status: 200,
      data: error,
    });
  }
});

router.get("/logout", (req, res) => {
  try {
    res.clearCookie("token");
    res.json({
      status: 200,
      data: messages.succesMessage.logoutSuccessfully,
    });
  } catch (error) {
    res.json({
      status: 400,
      data: error,
    });
  }
});

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
