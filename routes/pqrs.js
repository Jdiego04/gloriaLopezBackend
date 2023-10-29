const express = require("express");
const router = express.Router();
const pool = require("../views/database");
const consultas = require("../scripts/consultas");
const util = require("../scripts/util/util");

const crypto = require("crypto");

const email = "glorialopezautomatico@gmail.com";

//Para recuperar contraseña
router.post("/pqrs", (req, res) => {
  const { subject, content } = req.body;
  util.sendMail(email, subject, content);
  res.json("Enviado correctamente");
});

module.exports = router;
