const express = require("express");
const router = express.Router();
const queries = require("../scripts/queries");
const pool = require("../views/database");
const { body, validationResult } = require("express-validator");
const messages = require("../scripts/messages");
const validation = require("../scripts/util/validation");
const util = require("../scripts/util/util");
const moment = require('moment');

router.get("/all", validation.validateToken, (req, res) => {
  try {
    pool.query(queries.appointment.allAppointment, (err, rows, fields) => {
      if (err) {
        try {
          console.error(err);
          throw err;
        } catch {
          res.json({ status: 400, data: messages.errors.errorSystem });
        }
      }
      else {
        res.json({ status: 200, data: rows });
      }
    });
  } catch (error) {
    res.json({ status: 400, data: error });
  }
});

router.get("/appointment", validation.validateToken, (req, res) => {
  try {
    const { idAppoinment } = req.query;
    pool.query(
      queries.appointment.appointment,
      idAppoinment,
      (err, rows, fields) => {
        if (err) {
          try {
            console.error(err);
            throw err;
          } catch {
            res.json({ status: 400, data: messages.errors.errorSystem });
          }
        }
        else {
          res.json({ status: 200, data: rows });
        }
      },
    );
  } catch (error) {
    res.json({ status: 400, data: error });
  }
});

router.get("/appointmentByCliente", validation.validateToken, (req, res) => {
  try {
    const { idClient, idDocumentType } = req.query;
    pool.query(
      queries.appointment.appointmentByCliente,
      [idClient, idDocumentType],
      (err, rows, fields) => {
        if (err) {
          try {
            console.error(err);
            throw err;
          } catch {
            res.json({ status: 400, data: messages.errors.errorSystem });
          }
        }
        else {
          res.json({ status: 200, data: rows });
        }
      },
    );
  } catch (error) {
    res.json({ status: 400, data: error });
  }
});

router.get("/appointmentByClientCorreo", (req, res) => {
  try {
    const { CorreoCliente } = req.query;
    pool.query(
      queries.appointment.appointmentByClientCorreo,
      [CorreoCliente],
      (err, rows, fields) => {
        if (err) {
          try {
            console.error(err);
            throw err;
          } catch {
            res.json({ status: 400, data: messages.errors.errorSystem });
          }
        }
        else {
          res.json({ status: 200, data: rows });
        }
      },
    );
  } catch (error) {
    res.json({ status: 400, data: error });
  }
});

router.get(
  "/appointmentByColaborador",
  validation.validateToken,
  (req, res) => {
    try {
      const { idCollaborator, idDocumentType } = req.query;
      pool.query(
        queries.appointment.appointmentByColaborador,
        [idCollaborator, idDocumentType],
        (err, rows, fields) => {
          if (err) {
            try {
              console.error(err);
              throw err;
            } catch {
              res.json({ status: 400, data: messages.errors.errorSystem });
            }
          }
          else {
            res.json({ status: 200, data: rows });
          }
        },
      );
    } catch (error) {
      res.json({ status: 400, data: error });
    }
  },
);

router.put("/change", validation.validateToken, (req, res) => {
  try {
    const { idState, value, idAppoinment } = req.body;

    pool.query(
      queries.appointment.change,
      [idState, value, idAppoinment],
      (err, rows, fields) => {
        if (err) {
          try {
            console.error(err);
            throw err;
          } catch {
            res.json({ status: 400, data: messages.errors.errorSystem });
          }
        }
        else {
          res.json({
            status: 200,
            data: messages.succesMessage.disabledSuccessfully,
          });
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
router.put("/changeCliente", (req, res) => {
  try {
    const { idState, value, idAppoinment } = req.body;

    pool.query(
      queries.appointment.change,
      [idState, value, idAppoinment],
      (err, rows, fields) => {
        if (err) {
          try {
            console.error(err);
            throw err;
          } catch {
            res.json({ status: 400, data: messages.errors.errorSystem });
          }
        }
        else {
          res.json({
            status: 200,
            data: messages.succesMessage.disabledSuccessfully,
          });
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

router.post(
  "/appointmentClient",
  body("idClient").not().isEmpty().trim().escape(),
  body("idCollaborator").not().isEmpty().trim().escape(),
  body("appointmentDate").not().isEmpty().trim().escape(),
  body("state").not().isEmpty().trim().escape(),
  body("idDocumentTypeClient").not().isEmpty().trim().escape(),
  body("idDocumentTypeCollaborator").not().isEmpty().trim().escape(),
  body("services").not().isEmpty(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({
          status: 400,
          data: errors.array() ,
        });
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
      let valorCita;
      if (services.length > 1) {
        let time1 = await validation.duration(services[0]);
        let time2 = await validation.duration(services[1]);

        let aux = await validation.newDate(appointmentDate, time1);
        newDate = await validation.newDate(aux, time2);

        let auxValue = await util.valueService(services[0]);
        valorCita =
          parseFloat(await util.valueService(services[1])) +
          parseFloat(auxValue);
      } else {
        let time1 = await validation.duration(services[0]);
        newDate = await validation.newDate(appointmentDate, time1);
        valorCita = parseFloat(await util.valueService(services[0]));
      }

      const maxTime = moment(newDate).set({ hour: 19, minute: 0, second: 0 });
      if (moment(newDate).isAfter(maxTime)) {
        return res.json({
          status: 400,
          data: messages.errors.invalidTime,
        });
      }
      const dayOfWeek = moment(newDate).day();
      if (dayOfWeek === 6) {
        const maxSaturdayTime = moment(newDate).set({
          hour: 18,
          minute: 0,
          second: 0,
        });
        if (moment(newDate).isAfter(maxSaturdayTime)) {
          return res.json({
            status: 400,
            data: messages.errors.invalidTimeSaturday,
          });
        }
      }
      if (
        (await validation.availability(
          idCollaborator,
          appointmentDate,
          newDate,
          idDocumentTypeCollaborator,
        )) > 0
      ) {
        res.json({
          status: 400,
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
            valorCita,
          ],
          async (err, rows, fields) => {
            if (err) {
              try {
                console.error(err);
                throw err;
              } catch {
                res.json({ status: 400, data: messages.errors.errorSystem });
              }
            } else {
              const idAppointment = rows.insertId;
              await util.newServiceAppointment(services, idAppointment);

              res.json({
                status: 201,
                data: messages.succesMessage.insertedSuccessfully,
              });
            }
          },
        );
      }
    } catch (error) {
      res.json({ status: 400, data: error });
    }
  },
);

router.post(
  "/appointment",
  body("idClient").not().isEmpty().trim().escape(),
  body("idCollaborator").not().isEmpty().trim().escape(),
  body("appointmentDate").not().isEmpty().trim().escape(),
  body("state").not().isEmpty().trim().escape(),
  body("idDocumentTypeClient").not().isEmpty().trim().escape(),
  body("idDocumentTypeCollaborator").not().isEmpty().trim().escape(),
  body("services").not().isEmpty(),
  validation.validateToken,
  async (req, res) => {
    try {
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
      let valorCita;
      if (services.length > 1) {
        let time1 = await validation.duration(services[0]);
        let time2 = await validation.duration(services[1]);

        let aux = await validation.newDate(appointmentDate, time1);
        newDate = await validation.newDate(aux, time2);

        let auxValue = await util.valueService(services[0]);
        valorCita =
          parseFloat(await util.valueService(services[1])) +
          parseFloat(auxValue);
      } else {
        let time1 = await validation.duration(services[0]);
        newDate = await validation.newDate(appointmentDate, time1);
        valorCita = parseFloat(await util.valueService(services[0]));
      }

      const maxTime = moment(newDate).set({ hour: 19, minute: 0, second: 0 });
      if (moment(newDate).isAfter(maxTime)) {
        return res.json({
          status: 400,
          data: messages.errors.invalidTime,
        });
      }
      const dayOfWeek = moment(newDate).day();
      if (dayOfWeek === 6) {
        const maxSaturdayTime = moment(newDate).set({
          hour: 18,
          minute: 0,
          second: 0,
        });
        if (moment(newDate).isAfter(maxSaturdayTime)) {
          return res.json({
            status: 400,
            data: messages.errors.invalidTimeSaturday,
          });
        }
      }

      if (
        (await validation.availability(
          idCollaborator,
          appointmentDate,
          newDate,
          idDocumentTypeCollaborator,
        )) > 0
      ) {
        res.json({
          status: 400,
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
            valorCita,
          ],
          async (err, rows, fields) => {
            if (err) {
              throw err;
            } else {
              const idAppointment = rows.insertId;
              await util.newServiceAppointment(services, idAppointment);

              res.json({
                status: 201,
                data: messages.succesMessage.insertedSuccessfully,
              });
            }
          },
        );
      }
    } catch (error) {
      res.json({ status: 400, data: error });
    }
  },
);

module.exports = router;
