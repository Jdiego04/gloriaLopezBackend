const express = require("express");
const router = express.Router();
const queries = require("../scripts/queries");
const pool = require("../views/database");
const { body, validationResult } = require("express-validator");
const messages = require("../scripts/messages");

router.get("/all", (req, res) => {
  pool.query(queries.module.all, (err, rows, fields) => {
    if (err) throw err;
    else {
      res.json({ status: 200, data: rows });
    }
  });
});

router.get("/module", (req, res) => {
  const { idModule } = req.query;
  pool.query(queries.module.module, idModule, (err, rows, fields) => {
    if (err) throw err;
    else {
      res.json({ status: 200, data: rows });
    }
  });
});

router.post(
  "/module",
  body("moduleName").not().isEmpty().trim().escape(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: 400, data: errors.array() });
    }

    const { moduleName } = req.body;

    pool.query(queries.module.newModule, moduleName, (err, rows, fields) => {
      if (err) throw err;
      else {
        res.json({
          status: 200,
          data: messages.succesMessage.insertedSuccessfully,
        });
      }
    });
  },
);

router.put("/deactivate", (req, res) => {
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
});

router.put("/updateModule", (req, res) => {
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
});

router.post(
  "/permissionModule",
  body("idmodule").not().isEmpty().trim().escape(),
  body("idCollaborator").not().isEmpty().trim().escape(),
  body("idDocumentType").not().isEmpty().trim().escape(),
  body("idPermission").not().isEmpty().trim().escape(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: 400, data: errors.array() });
    }

    const { idmodule, idCollaborator, idDocumentType, idPermission } = req.body;

    pool.query(
      queries.module.newPermissionModule,
      [idmodule, idCollaborator, idDocumentType, idPermission],
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

router.get("/allPermissionModuleByCollaborator", (req, res) => {
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
});

router.get("/permissionModuleByCollaborator", (req, res) => {
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
});

router.put("/updatePermissionModule", (req, res) => {
  const { idPermission, idModule, idCollaborator, idDocumentType } = req.body;

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
});

module.exports = router;
