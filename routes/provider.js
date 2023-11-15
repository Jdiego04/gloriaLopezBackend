const express = require("express");
const router = express.Router();
const queries = require("../scripts/queries");
const pool = require("../views/database");
const { body, validationResult } = require("express-validator");
const messages = require("../scripts/messages");
const util = require("../scripts/util/util");
const validation = require("../scripts/util/validation");

router.get("/all", validation.validateToken, (req, res) => {
  pool.query(queries.provider.allProvider, (err, rows, fields) => {
    if (err) throw err;
    else {
      res.json({ status: 200, data: rows });
    }
  });
});

router.get("/provider", validation.validateToken, (req, res) => {
  const { idProvider } = req.body;
  pool.query(queries.provider.provider, idProvider, (err, rows, fields) => {
    if (err) throw err;
    else {
      res.json({ status: 200, data: rows });
    }
  });
});

router.post("/provider", validation.validateToken, async (req, res) => {
  const { name, contactNumber, address } = req.body;

  try {
    const verifyNumber = await util.checkIfExists(
      messages.tables.tblProvider,
      "Numero_Contacto",
      contactNumber,
    );

    if (!verifyNumber) {
      pool.query(
        queries.provider.newProvider,
        [name, contactNumber, address],
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
    } else {
      res.json({
        status: 400,
        data: messages.errors.exist,
      });
    }
  } catch (error) {
    console.error('Error en la validación:', error);
    res.json({
      status: 500,
      data: messages.errors.internalServerError,
    });
  }
});

router.post("/deactivate", validation.validateToken, (req, res) => {
  const { idProvider } = req.body;
  pool.query(queries.provider.deactivate, [idProvider], (err, rows, fields) => {
    if (err) throw err;
    else {
      res.json({
        status: 200,
        data: messages.succesMessage.disabledSuccessfully,
      });
    }
  });
});

router.put("/update", validation.validateToken, (req, res) => {
  const { name, contactNumber, address, idProvider } = req.body;

  pool.query(
    queries.provider.updateProvider,
    [name, contactNumber, address, idProvider],
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
});

module.exports = router;
