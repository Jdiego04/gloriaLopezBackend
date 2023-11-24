const express = require("express");
const router = express.Router();
const queries = require("../scripts/queries");
const pool = require("../views/database");
const { body, validationResult } = require("express-validator");
const messages = require("../scripts/messages");
const util = require("../scripts/util/util");
const validation = require("../scripts/util/validation");

router.get("/all", validation.validateToken, (req, res) => {
  try {
    pool.query(queries.service.all, (err, rows, fields) => {
      if (err) throw err;
      else {
        res.json({
          status: 200,
          data: rows,
        });
      }
    });
  } catch (error) {
    res.json({
      status: 400,
      data: error,
    });
  }
});

router.get("/allService", validation.validateToken, (req, res) => {
  try {
    pool.query(queries.service.allService, (err, rows, fields) => {
      if (err) throw err;
      else {
        res.json({
          status: 200,
          data: rows,
        });
      }
    });
  } catch (error) {
    res.json({
      status: 400,
      data: error,
    });
  }
});

router.get("/service", validation.validateToken, (req, res) => {
  try {
    const { idService } = req.query;
    pool.query(queries.service.service, idService, (err, rows, fields) => {
      if (err) throw err;
      else {
        res.json({
          status: 200,
          data: rows,
        });
      }
    });
  } catch (error) {
    res.json({
      status: 400,
      data: error,
    });
  }
});

router.get("/serviceByAppointment", validation.validateToken, (req, res) => {
  try {
    const { idAppointment } = req.query;
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
  } catch (error) {
    res.json({
      status: 400,
      data: error,
    });
  }
});
router.get("/serviceByAppointmentCliente", (req, res) => {
  try {
    const { idAppointment } = req.query;
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
  } catch (error) {
    res.json({
      status: 400,
      data: error,
    });
  }
});

router.get("/serviceByCategory", validation.validateToken, (req, res) => {
  try {
    const { idCategory } = req.query;
    pool.query(
      queries.service.serviceByCategory,
      idCategory,
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
  } catch (error) {
    res.json({
      status: 400,
      data: error,
    });
  }
});
router.get("/serviceByCategorycliente", (req, res) => {
  try {
    const { idCategory } = req.query;
    pool.query(
      queries.service.serviceByCategory,
      idCategory,
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
  } catch (error) {
    res.json({
      status: 400,
      data: error,
    });
  }
});

router.post("/service", validation.validateToken, async (req, res) => {
  try {
    const {
      idCategory,
      serviceName,
      serviceValue,
      serviceDescription,
      serviceDuration,
      idProvider,
    } = req.body;

    const verifyName = await util.checkIfExists(
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
                      status: 201,
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
  } catch (error) {
    res.json({
      status: 400,
      data: error,
    });
  }
});

router.put("/deactivate", validation.validateToken, (req, res) => {
  try {
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
  } catch (error) {
    res.json({
      status: 400,
      data: error,
    });
  }
});

router.put("/update", validation.validateToken, (req, res) => {
  try {
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
  } catch (error) {
    res.json({
      status: 400,
      data: error,
    });
  }
});

router.post(
  "/serviceAppointment",
  body("idService").not().isEmpty().trim().escape(),
  body("idAppointment").not().isEmpty().trim().escape(),
  validation.validateToken,
  (req, res) => {
    try {
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
              status: 201,
              data: messages.succesMessage.insertedSuccessfully,
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
  },
);

router.post(
  "/serviceProvider",
  body("idService").not().isEmpty().trim().escape(),
  body("idProvider").not().isEmpty().trim().escape(),
  validation.validateToken,
  (req, res) => {
    try {
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
              status: 201,
              data: messages.succesMessage.insertedSuccessfully,
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
  },
);

router.get("/allServiceHistory", validation.validateToken, (req, res) => {
  try {
    pool.query(queries.service.allServiceHistory, (err, rows, fields) => {
      if (err) throw err;
      else {
        res.json({
          status: 200,
          data: rows,
        });
      }
    });
  } catch (error) {
    res.json({
      status: 400,
      data: error,
    });
  }
});

router.get("/serviceHistory", validation.validateToken, (req, res) => {
  try {
    const { idserviceHistory } = req.query;
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
  } catch (error) {
    res.json({
      status: 400,
      data: error,
    });
  }
});

router.get(
  "/serviceHistoryByCollaborator",
  validation.validateToken,
  (req, res) => {
    try {
      const { idCollaborator, idDocumentType } = req.query;
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
    } catch (error) {
      res.json({
        status: 400,
        data: error,
      });
    }
  },
);

router.get(
  "/serviceHistoryByProvider",
  validation.validateToken,
  (req, res) => {
    try {
      const { idProvider } = req.query;
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
    } catch (error) {
      res.json({
        status: 400,
        data: error,
      });
    }
  },
);

router.get("/serviceHistoryByService", validation.validateToken, (req, res) => {
  try {
    const { idService } = req.query;
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
  } catch (error) {
    res.json({
      status: 400,
      data: error,
    });
  }
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
  async (req, res) => {
    try {
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

      const totalServiceAmount = await validation.getTotalServiceAmount(idService);

      console.log(totalServiceAmount);
      console.log(modificationType);

      if (modificationType === "S" && parseFloat(amount) > totalServiceAmount) {
        return res.json({
          status: 400,
          data: messages.errors.no,
        });
      }

      const [rows, fields] = await pool.query(
        queries.service.newServiceHistory,
        [idService, amount, modificationType, serviceDescription, idDocumentType, idCollaborator]
      );

      res.json({
        status: 201,
        data: messages.succesMessage.insertedSuccessfully,
      });
    } catch (error) {
      console.error(error);
      res.json({
        status: 400,
        data: error, 
      });
    }
  },
);

router.get(
  "/accountAllServiceHistory",
  validation.validateToken,
  (req, res) => {
    try {
      const { idService } = req.query;
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
    } catch (error) {
      res.json({
        status: 400,
        data: error,
      });
    }
  },
);

router.get("/accountServiceHistory", validation.validateToken, (req, res) => {
  try {
    const { idService } = req.query;
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
  } catch (error) {
    res.json({
      status: 400,
      data: error,
    });
  }
});

router.get(
  "/accountAllServiceHistory",
  validation.validateToken,
  (req, res) => {
    try {
      pool.query(queries.service.accountServiceHistory, (err, rows, fields) => {
        if (err) throw err;
        else {
          res.json({
            status: 200,
            data: rows,
          });
        }
      });
    } catch (error) {
      res.json({
        status: 400,
        data: error,
      });
    }
  },
);

router.get("/allProduct", validation.validateToken, (req, res) => {
  try {
    pool.query(queries.service.allProduct, (err, rows, fields) => {
      if (err) throw err;
      else {
        res.json({
          status: 200,
          data: rows,
        });
      }
    });
  } catch (error) {
    res.json({
      status: 400,
      data: error,
    });
  }
});

router.get("/product", validation.validateToken, (req, res) => {
  try {
    const { idService } = req.query;
    pool.query(queries.service.product, idService, (err, rows, fields) => {
      if (err) throw err;
      else {
        res.json({
          status: 200,
          data: rows,
        });
      }
    });
  } catch (error) {
    res.json({
      status: 400,
      data: error,
    });
  }
});

router.get("/productByProvider", validation.validateToken, (req, res) => {
  try {
    const { idProvider } = req.query;
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
  } catch (error) {
    res.json({
      status: 400,
      data: error,
    });
  }
});

module.exports = router;
