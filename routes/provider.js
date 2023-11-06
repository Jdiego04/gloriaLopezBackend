const express = require("express");
const router = express.Router();
const queries = require("../scripts/queries");
const pool = require("../views/database");
const { body, validationResult } = require("express-validator");
const messages = require("../scripts/messages");

router.get("/all", (req, res) => {
  pool.query(queries.provider.allProvider, (err, rows, fields) => {
    if (err) throw err;
    else {
      res.json({ status: 200, data: rows });
    }
  });
});

router.get("/provider", (req, res) => {
  const { idProvider } = req.body;
  pool.query(queries.provider.provider, idProvider, (err, rows, fields) => {
    if (err) throw err;
    else {
      res.json({ status: 200, data: rows });
    }
  });
});

router.post("/provider", (req, res) => {
  const { name, contactNumber, address } = req.body;

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
});

router.post("/deactivate", (req, res) => {
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

router.put("/update", (req, res) => {
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
