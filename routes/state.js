const express = require("express");
const router = express.Router();
const queries = require("../scripts/queries");
const pool = require("../views/database");
const { body, validationResult } = require("express-validator");
const messages = require("../scripts/messages");
const validation = require("../scripts/util/validation");

router.get("/all", (req, res) => {
  try {
    pool.query(queries.state.all, (err, rows, fields) => {
      if (err) throw err;
      else {
        res.json({ status: 200, data: rows });
      }
    });
  } catch (error) {
    res.json({
      status: 400,
      data: error,
    });
  }
});

router.get("/state", validation.validateToken, (req, res) => {
  try {
    const { idState } = req.query;
    pool.query(
      queries.state.state,
      idState,
      (err, rows, fields) => {
        if (err) throw err;
        else {
          res.json({ status: 200, data: rows });
        }
      },
    );
  } catch (error) {
    res.json({
      status: 400,
      data: error,
    });
  }
});


module.exports = router;
