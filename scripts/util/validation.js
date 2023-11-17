const express = require("express");
const router = express.Router();
const queries = require("../queries");
const pool = require("../../views/database");
const jwt = require("jsonwebtoken");
const keys = require("../../views/keys");

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

  return new Date(dateHour.getTime() + durationInMilliseconds + 24 * 60 * 60 * 1000);
}

// Middleware para validar el token en las solicitudes protegidas
const validateToken = (req, res, next) => {
  const token = req.headers.authorization; // Obtén el token del encabezado Authorization

  if (!token) {
    return res
      .status(401)
      .json({ status: 401, data: "Token no proporcionado" });
  }

  const secrets = [keys.secretEmp, keys.secretUsu];

  let validToken = false;

  // Verifica el token con cada uno de los secretos
  for (const secret of secrets) {
    jwt.verify(token.split(" ")[1], secret, (err, decoded) => {
      if (!err) {
        // El token es válido con uno de los secretos
        validToken = true;
        next();
      }
    });
  }

  // Si no se validó con ningún secreto, el token es inválido
  if (!validToken) {
    return res.status(401).json({ status: 401, data: "Token inválido" });
  }
};

module.exports = {
  simultaneousService,
  duration,
  newDate,
  availability,
  validateToken,
};
