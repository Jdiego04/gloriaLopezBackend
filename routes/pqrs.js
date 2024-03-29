const express = require("express");
const router = express.Router();
const messages = require("../scripts/messages");
const util = require("../scripts/util/util");
const accountTransport = require("../scripts/util/acountTransport.json");

router.post("/pqrs", (req, res) => {
  try {
    const { subject, content } = req.body;
    util.sendMail(accountTransport.auth.user, subject, content);
    res.json({
      status: 200,
      data: messages.succesMessage.sendSuccessfully,
    });
  } catch (error) {
    res.json({
      status: 400,
      data: error,
    });
  }
});

module.exports = router;
