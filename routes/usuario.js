const express = require('express');
const router = express.Router();
const pool = require('../views/database');
const keys = require('../views/keys');
const consultas = require('../scripts/consultas')
const util = require('../scripts/util/util')



router.get('/all', (req, res) => {
    pool.query(consultas.USUARIOS, (err, rows, fields) => {
        if (err) throw err;
        else {
            res.json(rows)
        }
    })
});

router.get('usuario/:id', (req, res) => {
    const { id } = req.params
    pool.query(consultas.USUARIO, id,(err, rows, fields) => {
        if (err) throw err;
        else {
            res.json(rows)
        }
    })
});


module.exports = router;