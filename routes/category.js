const express = require("express");
const router = express.Router();
const queries = require("../scripts/queries");
const pool = require("../views/database");
const { body, validationResult } = require("express-validator");
const messages = require("../scripts/messages");
const util = require("../scripts/util/util");
const validation = require("../scripts/util/validation");

router.get("/all", validation.validateToken, (req, res) => {
  pool.query(queries.categoy.allCategorys, (err, rows, fields) => {
    if (err) throw err;
    else {
      res.json({
        status: 200,
        data: rows,
      });
    }
  });
});

router.get("/categoy", validation.validateToken, (req, res) => {
  const { idCategory } = req.body;
  pool.query(queries.categoy.category, idCategory, (err, rows, fields) => {
    if (err) throw err;
    else {
      res.json({
        status: 200,
        data: rows,
      });
    }
  });
});

router.post(
  "/category",
  body("category").not().isEmpty().trim().escape(),
  validation.validateToken,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: 400, data: errors.array() });
    }

    const { category } = req.body;

    const validateCategory = util.checkIfExists(
      messages.tables.tblCategory,
      "Categoria",
      category,
    );
    if (!validateCategory) {
      pool.query(queries.categoy.newCategory, category, (err, rows, fields) => {
        if (err) throw err;
        else {
          res.json({
            status: 200,
            data: messages.succesMessage.insertedSuccessfully,
          });
        }
      });
    } else {
      res.json({
        status: 400,
        data: messages.errors.exist,
      });
    }
  },
);

router.put("/deactivate", validation.validateToken, (req, res) => {
  const { idCategory } = req.body;

  pool.query(
    queries.documentType.deactivate,
    idCategory,
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

router.put("/update", validation.validateToken, (req, res) => {
  const { category, idCategory } = req.body;

  pool.query(
    queries.categoy.update,
    [category, idCategory],
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
  "/categoryCollaborator",
  body("idCategory").not().isEmpty().trim().escape(),
  body("idCollaborator").not().isEmpty().trim().escape(),
  body("idDocumentType").not().isEmpty().trim().escape(),
  validation.validateToken,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: 400, data: errors.array() });
    }

    const { idCategory, idCollaborator, idDocumentType } = req.body;

    pool.query(
      queries.categoy.newCategory,
      [idCategory, idCollaborator, idDocumentType],
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
