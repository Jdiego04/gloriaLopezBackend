const express = require('express');
const router = express.Router();
const consultas = require('../scripts/consultas')
const pool = require('../views/database');
const { body, validationResult } = require('express-validator');

router.get('/all', (req, res) => {

    pool.query(consultas.TIPODOCUMENTOS, (err, rows, fields) => {
        if (err) throw err;
        else {
            res.json({ status: 200, data: rows });
        }
    })
});

router.get('/tipo', (req, res) => {

    const {id} = req.query;
    pool.query(consultas.TIPODOCUMENTO,id, (err, rows, fields) => {
       if (err) throw err;
        else {
            res.json({ status: 200, data: rows });
        }
    })
});

router.post('/tipo',body('tipoDoc').not().isEmpty().trim().escape(), (req,res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: 400, data: errors.array() });
    }

    const {tipoDoc} = req.body;
  
    pool.query(consultas.INSERTTIPODOC, 
        tipoDoc, (err, rows, fields) => {
        if (err) throw err;
        else {
            res.json({ status: 200, data: [] });
        }
    })
});

router.put('/desactivar', (req, res) => {
    const {idTipoDoc} = req.body

    pool.query(consultas.DESACTIVARTIPODOC, 
        idTipoDoc, (err, rows, fields) => {
        if (err) throw err
        else {
            res.json({ status: 200, data: [] });
        }
    })
})

module.exports = router;