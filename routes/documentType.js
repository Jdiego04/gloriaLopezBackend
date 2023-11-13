const express = require("express");
const router = express.Router();
const queries = require("../scripts/queries");
const pool = require("../views/database");
const { body, validationResult } = require("express-validator");
const messages = require("../scripts/messages");
const validation = require("../scripts/util/validation");

router.get("/all", validation.validateToken, (req, res) => {
  pool.query(queries.documentType.allDocumentType, (err, rows, fields) => {
    if (err) throw err;
    else {
      res.json({ status: 200, data: rows });
    }
  });
});

router.get("/documentType", validation.validateToken, (req, res) => {
  const { idDocumentType } = req.query;
  pool.query(
    queries.documentType.documentType,
    idDocumentType,
    (err, rows, fields) => {
      if (err) throw err;
      else {
        res.json({ status: 200, data: rows });
      }
    },
  );
});

router.post(
  "/documentType",
  body("documentType").not().isEmpty().trim().escape(),
  validation.validateToken,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: 400, data: errors.array() });
    }

    const { documentType } = req.body;

    pool.query(
      queries.documentType.newDocumentType,
      documentType,
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
  },
);

router.put("/deactivate", validation.validateToken, (req, res) => {
  const { idDocumentType } = req.body;

  pool.query(
    queries.documentType.deactivate,
    idDocumentType,
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
});

module.exports = router;
