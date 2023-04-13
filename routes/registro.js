const express = require('express');
const router = express.Router();
const pool = require('../views/database');

const jwt = require('jsonwebtoken');


router.get('/', (req,res)=>{

    let sql = 'select * from USUARIO'
    pool.query(sql, (err, rows, fields) => {
        if (err) throw err;
        else {
            res.json(rows)
        }
    })
});

router.post('/', (req, res) => {
    const { IDENTIFICACION_CLIENTE, NOMBRE_CLIENTE, CORREO_CLIENTE, CONTRASENA_CLIENTE, SEXO_EMPLEADO } = req.body;
    let sql = `INSERT INTO USUARIO(IDENTIFICACION_CLIENTE, NOMBRE_CLIENTE, CORREO_CLIENTE, CONTRASENA_CLIENTE, SEXO_EMPLEADO) 
    values ('${IDENTIFICACION_CLIENTE}','${NOMBRE_CLIENTE}','${CORREO_CLIENTE}','${CONTRASENA_CLIENTE}','${SEXO_EMPLEADO}')`
    pool.query(sql, (err, rows, fields) => {
        if (err) throw err
        else {
            res.json({ status: 'Registro exitoso' })
        }
    })
});



module.exports = router;