const express = require("express");
const router = express.Router();
const queries = require("../scripts/queries");
const pool = require("../views/database");
const validation = require("../scripts/util/validation");
const messages = require("../scripts/messages");

router.get("/appointmentByState", validation.validateToken, (req, res) => {
  try {
    const { idState, startDate, endDate } = req.query;
    pool.query(
      queries.report.appointmentByState,
      [idState, startDate, endDate, startDate, endDate],
      (err, rows, fields) => {
        if (err) throw err;
        else {
          if (rows.length > 0) {
            res.json({ status: 200, data: rows });
          } else {
            res.json({ status: 204, data: messages.succesMessage.notResult });
          }
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

router.get(
  "/appointmentByCollaborator",
  validation.validateToken,
  (req, res) => {
    try {
      const { idCollaborator, idDocumentType, startDate, endDate } = req.query;
      pool.query(
        queries.report.appointmentByCollaborator,
        [
          idCollaborator,
          idDocumentType,
          startDate,
          endDate,
          startDate,
          endDate,
        ],
        (err, rows, fields) => {
          if (err) throw err;
          else {
            if (rows.length > 0) {
              res.json({ status: 200, data: rows });
            } else {
              res.json({ status: 204, data: messages.succesMessage.notResult });
            }
          }
        },
      );
    } catch (error) {
      res.json({
        status: 400,
        data: error,
      });
    }
  },
);

router.get("/appointmentByClient", validation.validateToken, (req, res) => {
  try {
    const { idClient, idDocumentType, startDate, endDate } = req.query;
    pool.query(
      queries.report.appointmentByClient,
      [idClient, idDocumentType, startDate, endDate, startDate, endDate],
      (err, rows, fields) => {
        if (err) throw err;
        else {
          if (rows.length > 0) {
            res.json({ status: 200, data: rows });
          } else {
            res.json({ status: 204, data: messages.succesMessage.notResult });
          }
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

router.get("/totalByCollaborator", validation.validateToken, (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    pool.query(
      queries.report.totalByCollaborator,
      [startDate, endDate, startDate, endDate],
      (err, rows, fields) => {
        if (err) throw err;
        else {
          if (rows.length > 0) {
            res.json({ status: 200, data: rows });
          } else {
            res.json({ status: 204, data: messages.succesMessage.notResult });
          }
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

router.get("/historyProduct", validation.validateToken, (req, res) => {
  try {
    pool.query(queries.report.historyProduct, (err, rows, fields) => {
      if (err) throw err;
      else {
        if (rows.length > 0) {
          res.json({ status: 200, data: rows });
        } else {
          res.json({ status: 204, data: messages.succesMessage.notResult });
        }
      }
    });
  } catch (error) {
    res.json({
      status: 400,
      data: error,
    });
  }
});

router.get("/historyProductByProduct", validation.validateToken, (req, res) => {
  try {
    const { idProduct } = req.query;
    pool.query(
      queries.report.historyProductByProduct,
      idProduct,
      (err, rows, fields) => {
        if (err) throw err;
        else {
          if (rows.length > 0) {
            res.json({ status: 200, data: rows });
          } else {
            res.json({ status: 204, data: messages.succesMessage.notResult });
          }
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

module.exports = router;
