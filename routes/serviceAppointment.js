const express = require("express");
const router = express.Router();
const queries = require("../scripts/queries");
const pool = require("../views/database");
const { body, validationResult } = require("express-validator");
const messages = require("../scripts/messages");

router.post(
  "/serviceAppointment",
  body("idService").not().isEmpty().trim().escape(),
  body("idAppointment").not().isEmpty().trim().escape(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: 400, data: errors.array() });
    }

    const { idService, idAppointment } = req.body;

    pool.query(
      queries.serviceAppointment.newserviceAppointment,
      [idService, idAppointment],
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
