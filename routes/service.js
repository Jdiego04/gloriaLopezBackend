const express = require("express");
const router = express.Router();
const queries = require("../scripts/queries");
const pool = require("../views/database");
const { body, validationResult } = require("express-validator");
const messages = require("../scripts/messages");
const util = require("../scripts/util/util");
const validation = require("../scripts/util/validation");

router.get("/all", validation.validateToken, (req, res) => {
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

router.get("/service", validation.validateToken, (req, res) => {
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

router.get("/serviceByAppointment", validation.validateToken, (req, res) => {
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

router.get("/serviceByCategory", validation.validateToken, (req, res) => {
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

router.post("/service", validation.validateToken, (req, res) => {
  const {
    idCategory,
    serviceName,
    serviceValue,
    serviceDescription,
    serviceDuration,
    idProvider,
  } = req.body;

  const verifyName = util.checkIfExists(
    messages.tables.tblService,
    "Nombre_Servicio",
    serviceName,
  );

  if (!verifyName) {
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
          const idService = rows.insertId;
          if (idProvider != null) {
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
          }
        }
      },
    );
  } else {
    res.json({
      status: 400,
      data: messages.errors.exist,
    });
  }
});

router.put("/deactivate", validation.validateToken, (req, res) => {
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

router.put("/update", validation.validateToken, (req, res) => {
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
  validation.validateToken,
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
  validation.validateToken,
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

router.get("/allServiceHistory", validation.validateToken, (req, res) => {
  pool.query(queries.service.allServiceHistory, (err, rows, fields) => {
    if (err) throw err;
    else {
      res.json({
        status: 200,
        data: rows,
      });
    }
  });
});

router.get("/serviceHistory", validation.validateToken, (req, res) => {
  const { idserviceHistory } = req.body;
  pool.query(
    queries.service.serviceHistory,
    idserviceHistory,
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

router.get(
  "/serviceHistoryByCollaborator",
  validation.validateToken,
  (req, res) => {
    const { idCollaborator, idDocumentType } = req.body;
    pool.query(
      queries.service.serviceHistoryByCollaborator,
      [idCollaborator, idDocumentType],
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
  },
);

router.get(
  "/serviceHistoryByProvider",
  validation.validateToken,
  (req, res) => {
    const { idProvider } = req.body;
    pool.query(
      queries.service.serviceHistoryByProvider,
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
  },
);

router.get("/serviceHistoryByService", validation.validateToken, (req, res) => {
  const { idService } = req.body;
  pool.query(
    queries.service.serviceHistoryByService,
    idService,
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

router.post(
  "/serviceHistory",
  body("idService").not().isEmpty().trim().escape(),
  body("amount").not().isEmpty().trim().escape(),
  body("modificationType").not().isEmpty().trim().escape(),
  body("serviceDescription").not().isEmpty().trim().escape(),
  body("idCollaborator").not().isEmpty().trim().escape(),
  body("idDocumentType").not().isEmpty().trim().escape(),
  validation.validateToken,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: 400, data: errors.array() });
    }

    const {
      idService,
      amount,
      modificationType,
      serviceDescription,
      idCollaborator,
      idDocumentType,
    } = req.body;

    pool.query(
      queries.service.newServiceHistory,
      [
        idService,
        amount,
        modificationType,
        serviceDescription,
        idCollaborator,
        idDocumentType,
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
  },
);

router.get(
  "/accountAllServiceHistory",
  validation.validateToken,
  (req, res) => {
    const { idService } = req.body;
    pool.query(
      queries.service.accountAllServiceHistory,
      idService,
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
  },
);

router.get("/accountServiceHistory", validation.validateToken, (req, res) => {
  const { idService } = req.body;
  pool.query(
    queries.service.accountServiceHistory,
    idService,
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

router.get(
  "/accountAllServiceHistory",
  validation.validateToken,
  (req, res) => {
    pool.query(queries.service.accountServiceHistory, (err, rows, fields) => {
      if (err) throw err;
      else {
        res.json({
          status: 200,
          data: rows,
        });
      }
    });
  },
);

router.get("/allProduct", validation.validateToken, (req, res) => {
  pool.query(queries.service.allProduct, (err, rows, fields) => {
    if (err) throw err;
    else {
      res.json({
        status: 200,
        data: rows,
      });
    }
  });
});

router.get("/product", validation.validateToken, (req, res) => {
  const { idService } = req.body;
  pool.query(queries.service.product, idService, (err, rows, fields) => {
    if (err) throw err;
    else {
      res.json({
        status: 200,
        data: rows,
      });
    }
  });
});

router.get("/productByProvider", validation.validateToken, (req, res) => {
  const { idProvider } = req.body;
  pool.query(
    queries.service.productByProvider,
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

module.exports = router;
