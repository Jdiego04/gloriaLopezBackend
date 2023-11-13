const express = require("express");
const router = express.Router();
const pool = require("../views/database");
const queries = require("../scripts/queries");
const messages = require("../scripts/messages");
const validation = require("../scripts/util/validation");

router.get("/all", validation.validateToken, (req, res) => {
  pool.query(queries.collaborator.all, (err, rows, fields) => {
    if (err) throw err;
    else {
      res.json({ status: 200, data: rows });
    }
  });
});

router.get("/collaborator", validation.validateToken, (req, res) => {
  const { idCollaborator, idDocumentType } = req.body;
  pool.query(
    queries.collaborator.collaborator,
    [idCollaborator, idDocumentType],
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

module.exports = router;
