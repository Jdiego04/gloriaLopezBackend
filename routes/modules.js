const express = require("express");
const router = express.Router();
const queries = require("../scripts/queries");
const pool = require("../views/database");
const { body, validationResult } = require("express-validator");
const messages = require("../scripts/messages");
const validation = require("../scripts/util/validation");

router.get("/all", validation.validateToken, (req, res) => {
  try {
    pool.query(queries.module.all, (err, rows, fields) => {
      if (err) throw err;
      else {
        res.json({ status: 200, data: rows });
      }
    });
  } catch (error) {
    res.json({ status: 400, data: error });
  }
});

router.get("/module", validation.validateToken, (req, res) => {
  try {
    const { idModule } = req.query;
    pool.query(queries.module.module, idModule, (err, rows, fields) => {
      if (err) throw err;
      else {
        res.json({ status: 200, data: rows });
      }
    });
  } catch (error) {
    res.json({ status: 400, data: error });
  }
});

router.get(
  "/moduleByCollaborator",
  validation.validateToken,
  body("idCollaborator").not().isEmpty().trim().escape(),
  body("idDocumentType").not().isEmpty().trim().escape(),
  (req, res) => {
    try {
      const { idCollaborator, idDocumentType } = req.query;
      pool.query(
        queries.module.moduleByCollaborator,
        [idCollaborator, idDocumentType],
        (err, rows, fields) => {
          if (err) throw err;
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

router.post(
  "/module",
  body("moduleName").not().isEmpty().trim().escape(),
  validation.validateToken,
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({ status: 400, data: errors.array() });
      }

      const { moduleName } = req.body;

      pool.query(queries.module.newModule, moduleName, (err, rows, fields) => {
        if (err) throw err;
        else {
          res.json({
            status: 201,
            data: messages.succesMessage.insertedSuccessfully,
          });
        }
      });
    } catch (error) {
      res.json({ status: 400, data: error });
    }
  },
);

router.put("/deactivate", validation.validateToken, (req, res) => {
  try {
    const { idModule } = req.body;

    pool.query(queries.module.deactivate, idModule, (err, rows, fields) => {
      if (err) throw err;
      else {
        res.json({
          status: 200,
          data: messages.succesMessage.disabledSuccessfully,
        });
      }
    });
  } catch (error) {
    res.json({ status: 400, data: error });
  }
});

router.put("/updateModule", validation.validateToken, (req, res) => {
  try {
    const { moduleName, idModule } = req.body;

    pool.query(
      queries.module.updateModule,
      [moduleName, idModule],
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
    res.json({ status: 400, data: error });
  }
});

router.post(
  "/permissionModule",
  body("idmodule").not().isEmpty().trim().escape(),
  body("idCollaborator").not().isEmpty().trim().escape(),
  body("idDocumentType").not().isEmpty().trim().escape(),
  body("idPermission").not().isEmpty().trim().escape(),
  validation.validateToken,
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({ status: 400, data: errors.array() });
      }

      const { idmodule, idCollaborator, idDocumentType, idPermission } =
        req.body;

      pool.query(
        queries.module.newPermissionModule,
        [idmodule, idCollaborator, idDocumentType, idPermission],
        (err, rows, fields) => {
          if (err) {
            try {
              console.error(err);
              throw err;
            } catch {
              res.json({ status: 400, data: messages.errors.exist });
            }
          }
          else {
            res.json({
              status: 201,
              data: messages.succesMessage.insertedSuccessfully,
            });
          }
        },
      );
    } catch (error) {
      res.json({ status: 400, data: error });
    }
  },
);

router.get(
  "/allPermissionModuleByCollaborator",
  validation.validateToken,
  (req, res) => {
    try {
      const { idCollaborator, idDocumentType } = req.query;
      pool.query(
        queries.module.allPermissionModuleByCollaborator,
        [idCollaborator, idDocumentType],
        (err, rows, fields) => {
          if (err) throw err;
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

router.get(
  "/permissionModuleByCollaborator",
  validation.validateToken,
  (req, res) => {
    try {
      const { idCollaborator, idDocumentType, idModule } = req.query;
      pool.query(
        queries.module.permissionModuleByCollaborator,
        [idCollaborator, idDocumentType, idModule],
        (err, rows, fields) => {
          if (err) throw err;
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

router.put(
  "/updatePermissionModule",
  validation.validateToken,
  body("idModule").not().isEmpty().trim().escape(),
  body("idCollaborator").not().isEmpty().trim().escape(),
  body("idDocumentType").not().isEmpty().trim().escape(),
  body("idPermission").not().isEmpty().trim().escape(),
  (req, res) => {
    try {
      const { idPermission, idModule, idCollaborator, idDocumentType } =
        req.body;

      pool.query(
        queries.module.updatePermissionModule,
        [idPermission, idModule, idCollaborator, idDocumentType],
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
      res.json({ status: 400, data: error });
    }
  },
);

router.get("/allPermissionModule", validation.validateToken, (req, res) => {
  try {
    pool.query(queries.module.permissionModule, (err, rows, fields) => {
      if (err) throw err;
      else {
        res.json({ status: 200, data: rows });
      }
    });
  } catch (error) {
    res.json({ status: 400, data: error });
  }
});

router.get("/allPermission", validation.validateToken, (req, res) => {
  try {
    pool.query(queries.module.allPermission, (err, rows, fields) => {
      if (err) throw err;
      else {
        res.json({ status: 200, data: rows });
      }
    });
  } catch (error) {
    res.json({ status: 400, data: error });
  }
});

module.exports = router;
