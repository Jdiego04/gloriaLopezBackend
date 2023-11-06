const express = require("express");
const router = express.Router();
const pool = require("../views/database");
const queries = require("../scripts/queries");

router.get("/all", (req, res) => {
  pool.query(queries.collaborator.all, (err, rows, fields) => {
    if (err) throw err;
    else {
      res.json({
        status: 200,
        data: messages.succesMessage.insertedSuccessfully,
      });
    }
  });
});

router.get("/collaborator", (req, res) => {
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
