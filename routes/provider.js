const express = require("express");
const router = express.Router();
const queries = require("../scripts/queries");
const pool = require("../views/database");
const { body, validationResult } = require("express-validator");
const messages = require("../scripts/messages");
const util = require("../scripts/util/util");
const validation = require("../scripts/util/validation");

router.get("/all", validation.validateToken, (req, res) => {
  try {
    pool.query(queries.provider.allProvider, (err, rows, fields) => {
      if (err) throw err;
      else {
        res.json({ status: 200, data: rows });
      }
    });
  } catch (error) {
    res.json({ status: 400, data: error });
  }
});

router.get("/provider", validation.validateToken, (req, res) => {
  try {
    const { idProvider } = req.query;
    pool.query(queries.provider.provider, idProvider, (err, rows, fields) => {
      if (err) throw err;
      else {
        res.json({ status: 200, data: rows });
      }
    });
  } catch (error) {
    res.json({ status: 400, data: error });
  }
});

router.post("/provider", validation.validateToken, async (req, res) => {
  try {
    const { name, contactNumber, address } = req.body;

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

router.post("/deactivate", validation.validateToken, (req, res) => {
  try {
    const { idProvider } = req.body;
    pool.query(
      queries.provider.deactivate,
      [idProvider],
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
    res.json({ status: 400, data: error });
  }
});

router.put("/update", validation.validateToken, (req, res) => {
  try {
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
  } catch (error) {
    res.json({ status: 400, data: error });
  }
});

module.exports = router;
