const express = require("express");
const router = express.Router();
const queries = require("../scripts/queries");
const pool = require("../views/database");
const { body, validationResult } = require("express-validator");
const messages = require("../scripts/messages");
const util = require("../scripts/util/util");


router.get("/appointmentByStatus", (req, res) => {
    try {
      pool.query(queries.report.appointmentByStatus, (err, rows, fields) => {
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

module.exports = router;
