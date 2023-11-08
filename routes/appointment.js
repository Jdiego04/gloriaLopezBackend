const express = require("express");
const router = express.Router();
const queries = require("../scripts/queries");
const pool = require("../views/database");
const { body, validationResult } = require("express-validator");
const messages = require("../scripts/messages");

router.get("/all", (req, res) => {
  pool.query(queries.appointment.allAppointment, (err, rows, fields) => {
    if (err) throw err;
    else {
      res.json({ status: 200, data: rows });
    }
  });
});

router.get("/appointment", (req, res) => {
  const { idAppoinment } = req.body;
  pool.query(
    queries.appointment.appointment,
    idAppoinment,
    (err, rows, fields) => {
      if (err) throw err;
      else {
        res.json({ status: 200, data: rows });
      }
    },
  );
});

router.get("/appointmentByCliente", (req, res) => {
  const { idClient, idDocumentType } = req.body;
  pool.query(
    queries.appointment.appointmentByCliente,
    [idClient, idDocumentType],
    (err, rows, fields) => {
      if (err) throw err;
      else {
        res.json({ status: 200, data: rows });
      }
    },
  );
});

router.get("/appointmentByColaborador", (req, res) => {
  const { idCollaborator, idDocumentType } = req.body;
  pool.query(
    queries.appointment.appointmentByColaborador,
    [idCollaborator, idDocumentType],
    (err, rows, fields) => {
      if (err) throw err;
      else {
        res.json({ status: 200, data: rows });
      }
    },
  );
});

router.put("/change", (req, res) => {
  const { idAppoinment } = req.body;

  pool.query(queries.appointment.change, idAppoinment, (err, rows, fields) => {
    if (err) throw err;
    else {
      res.json({
        status: 200,
        data: messages.succesMessage.disabledSuccessfully,
      });
    }
  });
});

router.put("/updateAppointment", (req, res) => {
  const { idCollaborator, appointmentDate, idDocumentType, idAppoinment } =
    req.body;

  pool.query(
    queries.appointment.updateAppointment,
    [idCollaborator, appointmentDate, idDocumentType, idAppoinment],
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
