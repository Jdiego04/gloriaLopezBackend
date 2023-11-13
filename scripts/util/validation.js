const express = require("express");
const router = express.Router();
const queries = require("../queries");
const pool = require("../../views/database");

async function simultaneousService(services) {
  return new Promise((resolve, reject) => {
    pool.query(
      queries.appointment.simultaneous,
      [services, services],
      (err, rows, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows[0].SIMULTANEOS);
        }
      },
    );
  });
}

async function duration(idService) {
  return new Promise((resolve, reject) => {
    pool.query(queries.appointment.duration, idService, (err, rows, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows[0].DURACION);
      }
    });
  });
}

async function availability(
  idCollaborator,
  appointmentDate,
  newDate,
  idDocumentTypeCollaborator,
) {
  return new Promise((resolve, reject) => {
    pool.query(
      queries.appointment.availability,
      [idCollaborator, appointmentDate, newDate, idDocumentTypeCollaborator],
      (err, rows, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows[0].AVAILABILITY);
        }
      },
    );
  });
}

async function newDate(appointmentDate, duration) {
  const [hour, minutes, seconds] = duration.split(":");
  const durationInMilliseconds =
    (parseInt(hour) * 60 * 60 + parseInt(minutes) * 60 + parseInt(seconds)) *
    1000;

  const dateHour = new Date(appointmentDate);

  return new Date(dateHour.getTime() + durationInMilliseconds);
}

module.exports = {
  simultaneousService,
  duration,
  newDate,
  availability,
};
