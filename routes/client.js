const express = require("express");
const router = express.Router();
const pool = require("../views/database");
const queries = require("../scripts/queries");
const messages = require("../scripts/messages");
const validation = require("../scripts/util/validation");
router.get("/all", validation.validateToken, (req, res) => {
  pool.query(queries.client.all, (err, rows, fields) => {
    if (err) throw err;
    else {
      res.json({ status: 200, data: rows });
    }
  });
});

router.get("/client", validation.validateToken, (req, res) => {
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

router.put("/deactivate", validation.validateToken, (req, res) => {
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
