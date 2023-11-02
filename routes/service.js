const express = require("express");
const router = express.Router();
const queries = require("../scripts/queries");
const pool = require("../views/database");
const { body, validationResult } = require("express-validator");
const messages = require("../scripts/messages");

router.get("/all", (req, res) => {
  pool.query(queries.service.allService, (err, rows, fields) => {
    if (err) throw err;
    else {
      res.json({
        status: 200,
        data: rows,
      });
    }
  });
});

router.get("/service", (req, res) => {
  const { idService } = req.body;
  pool.query(queries.service.service, idService, (err, rows, fields) => {
    if (err) throw err;
    else {
      res.json({
        status: 200,
        data: rows,
      });
    }
  });
});

router.get("/serviceByAppointment", (req, res) => {
  const { idAppointment } = req.body;
  pool.query(
    queries.service.serviceByAppointment,
    idAppointment,
    (err, rows, fields) => {
      if (err) throw err;
      else {
        res.json({
          status: 200,
          data: rows,
        });
      }
    },
  );
});

router.get("/serviceByCategory", (req, res) => {
  const { idCategory } = req.body;
  pool.query(
    queries.service.serviceByCategory,
    idAppointment,
    (err, rows, fields) => {
      if (err) throw err;
      else {
        res.json({
          status: 200,
          data: rows,
        });
      }
    },
  );
});

router.get("/serviceByProvider", (req, res) => {
  const { idProvider } = req.body;
  pool.query(
    queries.service.serviceByProvider,
    idProvider,
    (err, rows, fields) => {
      if (err) throw err;
      else {
        res.json({
          status: 200,
          data: rows,
        });
      }
    },
  );
});

router.post("/service", (req, res) => {
  const {
    idCategory,
    serviceName,
    serviceValue,
    serviceDescription,
    serviceDuration,
  } = req.body;

  pool.query(
    queries.service.newService,
    [
      idCategory,
      serviceName,
      serviceValue,
      serviceDescription,
      serviceDuration,
    ],
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
});

router.put("/deactivate", (req, res) => {
  const { idService } = req.body;

  pool.query(queries.service.deactivate, idService, (err, rows, fields) => {
    if (err) throw err;
    else {
      res.json({
        status: 200,
        data: messages.succesMessage.disabledSuccessfully,
      });
    }
  });
});

router.put("/update", (req, res) => {
  const {
    idCategory,
    serviceName,
    serviceValue,
    serviceDescription,
    serviceDuration,
    idService,
  } = req.body;

  pool.query(
    queries.service.updateService,
    [
      idCategory,
      serviceName,
      serviceValue,
      serviceDescription,
      serviceDuration,
      idService,
    ],
    (err, rows, fields) => {
      if (err) throw err;
      else {
        res.json({
          status: 200,
          data: messages.succesMessage.updatedSuccessfully,
        });
      }
    },
  );
});

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
      queries.service.newServiceAppointment,
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

router.post(
  "/serviceProvider",
  body("idService").not().isEmpty().trim().escape(),
  body("idProvider").not().isEmpty().trim().escape(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: 400, data: errors.array() });
    }

    const { idService, idProvider } = req.body;

    pool.query(
      queries.service.newServiceProvider,
      [idService, idProvider],
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

module.exports = router;
