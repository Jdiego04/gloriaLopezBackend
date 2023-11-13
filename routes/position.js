const express = require("express");
const router = express.Router();
const queries = require("../scripts/queries");
const pool = require("../views/database");
const { body, validationResult } = require("express-validator");
const messages = require("../scripts/messages");
const validation = require("../scripts/util/validation");

router.get("/all", validation.validateToken, (req, res) => {
  pool.query(queries.position.all, (err, rows, fields) => {
    if (err) throw err;
    else {
      res.json({
        status: 200,
        data: rows,
      });
    }
  });
});

router.get("/position", validation.validateToken, (req, res) => {
  const { idPosition } = req.body;
  pool.query(queries.position.position, idPosition, (err, rows, fields) => {
    if (err) throw err;
    else {
      res.json({
        status: 200,
        data: rows,
      });
    }
  });
});

router.post(
  "/position",
  body("position").not().isEmpty().trim().escape(),
  validation.validateToken,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: 400, data: errors.array() });
    }

    const { position } = req.body;

    pool.query(queries.position.newPosition, position, (err, rows, fields) => {
      if (err) throw err;
      else {
        res.json({
          status: 200,
          data: messages.succesMessage.insertedSuccessfully,
        });
      }
    });
  },
);

router.put("/deactivate", validation.validateToken, (req, res) => {
  const { idPosition } = req.body;

  pool.query(queries.position.deactivate, idPosition, (err, rows, fields) => {
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
  const { position, idPosition } = req.body;

  pool.query(
    queries.position.update,
    [position, idPosition],
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
