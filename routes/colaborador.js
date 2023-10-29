const express = require("express");
const router = express.Router();
const pool = require("../views/database");
const keys = require("../views/keys");
const consultas = require("../scripts/consultas");
const util = require("../scripts/util/util");

router.get("/all", (req, res) => {
  pool.query(consultas.EMPLEADOS, (err, rows, fields) => {
    if (err) throw err;
    else {
      res.json(rows);
    }
  });
});

router.get("/empleado", (req, res) => {
  const { id } = req.body;
  pool.query(consultas.EMPLEADO, id, (err, rows, fields) => {
    if (err) throw err;
    else {
      res.json(rows);
    }
  });
});

module.exports = router;
