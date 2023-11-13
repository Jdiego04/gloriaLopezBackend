const express = require("express");
const router = express.Router();
const pool = require("../views/database");
const queries = require("../scripts/queries");
const messages = require("../scripts/messages");

router.get("/all", (req, res) => {
  pool.query(queries.client.all, (err, rows, fields) => {
    if (err) throw err;
    else {
      res.json({ status: 200, data: rows });
    }
  });
});

router.get("/client", (req, res) => {
  const { idClient, idDocumentType } = req.body;
  pool.query(
    queries.client.client,
    [idClient, idDocumentType],
    (err, rows, fields) => {
      if (err) throw err;
      else {
        res.json({ status: 200, data: rows });
      }
    },
  );
});

router.put("/deactivate", (req, res) => {
  const { documentTypeId, clientId, otp } = req.body;

  pool.query(
    queries.client.otp,
    [clientId, documentTypeId, otp],
    (err, rows, fields) => {
      if (err) throw err;
      else {
        pool.query(
          queries.client.deactivate,
          [documentTypeId, clientId],
          (err, rows, fields) => {
            if (err) throw err;
          },
        );
        res.json({
          status: 200,
          data: messages.succesMessage.disabledSuccessfully,
        });
      }
    },
  );
});
module.exports = router;
