const express = require("express");
const router = express.Router();
const pool = require("../views/database");
const queries = require("../scripts/queries");
const messages = require("../scripts/messages");
const validation = require("../scripts/util/validation");
router.get("/all", validation.validateToken, (req, res) => {
  try {
    pool.query(queries.client.all, (err, rows, fields) => {
      if (err) {
        try {
          console.error(err);
          throw err;
        } catch {
          res.json({ status: 400, data: messages.errors.errorSystem });
        }
      }
      else {
        res.json({ status: 200, data: rows });
      }
    });
  } catch (error) {
    res.json({ status: 200, data: error });
  }
});

router.get("/client", validation.validateToken, (req, res) => {
  try {
    const { idClient, idDocumentType } = req.query;
    pool.query(
      queries.client.client,
      [idClient, idDocumentType],
      (err, rows, fields) => {
        if (err) {
          try {
            console.error(err);
            throw err;
          } catch {
            res.json({ status: 400, data: messages.errors.errorSystem });
          }
        }
        else {
          res.json({ status: 200, data: rows });
        }
      },
    );
  } catch (error) {
    res.json({ status: 400, data: error });
  }
});

router.get("/clientByEmail", (req, res) => {
  try {
    const { eMail } = req.query;
    pool.query(queries.client.clientByEmail, [eMail], (err, rows, fields) => {
      if (err) {
        try {
          console.error(err);
          throw err;
        } catch {
          res.json({ status: 400, data: messages.errors.errorSystem });
        }
      }
      else {
        res.json({ status: 200, data: rows });
      }
    });
  } catch (error) {
    res.json({ status: 400, data: error });
  }
});

router.put("/deactivate", (req, res) => {
  try {
    const { documentTypeId, clientId, otp } = req.body;

    pool.query(
      queries.client.otp,
      [clientId, documentTypeId, otp],
      (err, rows, fields) => {
        if (err) {
          try {
            console.error(err);
            throw err;
          } catch {
            res.json({ status: 400, data: messages.errors.errorSystem });
          }
        }
        else {
          pool.query(
            queries.client.deactivate,
            [documentTypeId, clientId],
            (err, rows, fields) => {
              if (err) {
                try {
                  console.error(err);
                  throw err;
                } catch {
                  res.json({ status: 400, data: messages.errors.errorSystem });
                }
              }
            },
          );
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

router.get("/allCitasCliente", (req, res) => {
  try {
    pool.query(queries.client.all, (err, rows, fields) => {
      if (err) {
        try {
          console.error(err);
          throw err;
        } catch {
          res.json({ status: 400, data: messages.errors.errorSystem });
        }
      }
      else {
        res.json({ status: 200, data: rows });
      }
    });
  } catch (error) {
    res.json({ status: 200, data: error });
  }
});
module.exports = router;
