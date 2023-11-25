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
              res.json({ status: 200, data: { token, data } });
            } else {
              res.json({
                status: 400,
                data: messages.errors.invalidCredentials,
              });
            }
          } else {
            console.log(err);
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

    pool.query(
      queries.collaborator.recoverPassword,
      email,
      (err, rows, fields) => {
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
      },
    );
  } catch (error) {
    res.json({ status: 400, data: error });
  }
});

router.post("/updatePassword", (req, res) => {
  try {
    const { password, email } = req.body;
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
      collaboratorId,
      contactNumber,
      email,
      password,
      entryDate,
      birthDate,
      positionId,
    } = req.body;

    const validateEmail = await util.checkIfExists(
      messages.tables.tblCollaborator,
      "Correo_Electronico",
      email,
    );
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    if (!validateEmail) {
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
          if (err) {
            try{
              console.error(err);
              throw err;
            }catch{
              res.json({ status: 400, data: messages.errors.exist });
            }
          }
          else {
            res.json({
              status: 201,
              data: messages.succesMessage.insertedSuccessfully,
            });
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

router.put("/deactivate", validation.validateToken, (req, res) => {
  try {
    const { idCollaborator, idDocumentType } = req.body;

    pool.query(
      queries.collaborator.deactivate,
      [idCollaborator, idDocumentType],
      (err, rows, fields) => {
        if (err) throw err;
        else {
          res.json({
            status: 200,
            data: messages.succesMessage.disabledSuccessfully,
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

router.put("/update", validation.validateToken, (req, res) => {
  try {
    const {
      names,
      firstLastname,
      secondLastname,
      contactNumber,
      positionId,
      idCollaborator,
      idDocumentType,
    } = req.body;

    pool.query(
      queries.collaborator.updateCollaborator,
      [
        names,
        firstLastname,
        secondLastname,
        contactNumber,
        positionId,
        idCollaborator,
        idDocumentType,
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
      status: 400,
      data: error,
    });
  }
});

router.post("/collaboratorCategory", validation.validateToken, (req, res) => {
  try {
    const { idCategory, idCollaborator, idDocumentType } = req.body;

    pool.query(
      queries.collaborator.newCollaboratorCategory,
      [idCategory, idCollaborator, idDocumentType],
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
  } catch (error) {
    res.json({
      status: 400,
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
