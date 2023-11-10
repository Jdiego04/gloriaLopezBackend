const express = require("express");
const router = express.Router();
const queries = require("../scripts/queries");
const pool = require("../views/database");
const { body, validationResult } = require("express-validator");
const messages = require("../scripts/messages");
const validation = require("../scripts/util/validation");

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

router.post(
  "/appointment",
  body("idClient").not().isEmpty().trim().escape(),
  body("idCollaborator").not().isEmpty().trim().escape(),
  body("appointmentDate").not().isEmpty().trim().escape(),
  body("state").not().isEmpty().trim().escape(),
  body("idDocumentTypeClient").not().isEmpty().trim().escape(),
  body("idDocumentTypeCollaborator").not().isEmpty().trim().escape(),
  body("services").not().isEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: 400, data: errors.array() });
    }

    const {
      idClient,
      idCollaborator,
      appointmentDate,
      state,
      idDocumentTypeClient,
      idDocumentTypeCollaborator,
      services,
    } = req.body;

    let newDate;
    if (services.length > 1) {
      let time1 = await validation.duration(services[0]);
      let time2 = await validation.duration(services[1]);
      if (await validation.simultaneousService(services)) {
        if (time1 > time2) {
          newDate = await validation.newDate(appointmentDate, time1);
        } else {
          newDate = await validation.newDate(appointmentDate, time2);
        }
      } else {
        let aux = await validation.newDate(appointmentDate, time1);
        newDate = await validation.newDate(aux, time2);
      }
    } else {
      let time1 = await validation.duration(services[0]);
      newDate = await validation.newDate(appointmentDate, time1);
    }

    if (
      (await validation.availability(
        idClient,
        idCollaborator,
        appointmentDate,
        idDocumentTypeClient,
        idDocumentTypeCollaborator,
      )) > 0
    ) {
      res.json({
        status: 200,
        data: messages.errors.notAvailable,
      });
    } else {
      pool.query(
        queries.appointment.newAppointment,
        [
          idClient,
          idCollaborator,
          appointmentDate,
          newDate,
          state,
          idDocumentTypeClient,
          idDocumentTypeCollaborator,
        ],
        (err, rows, fields) => {
          if (err) {
            throw err;
          } else {
            res.json({
              status: 200,
              data: messages.succesMessage.insertedSuccessfully,
            });
          }
        },
      );
    }
  },
);

module.exports = router;
