const express = require('express');
const router = express.Router();
const consultas = require('../scripts/consultas')
const pool = require('../views/database');


router.get('/', (req, res) => {
    let sql = consultas.EMPLEADOS
    pool.query(sql, (err, rows, fields) => {
        if (err) throw err;
        else {
            res.json(rows)
        }
    })
});

//Un empleado

/*router.get('/:IDENTIFICACION_EMPLEADO', (req, res) => {
    const { IDENTIFICACION_EMPLEADO } = req.params
    let sql = 'SELECT * FROM EMPLEADO WHERE IDENTIFICACION_EMPLEADO = ?'
    pool.query(sql, [IDENTIFICACION_EMPLEADO], (err, rows, fields) => {
        if (err) throw err;
        if(!rows[0]){
            res.json({error: "Este dato no existe"})
        }
        else {
            res.json(rows)
        }
    })
})*/

//Post
router.post('/', (req, res) => {
    const { IDENTIFICACION_EMPLEADO,
        TIPO_DOCUMENTO,
        NOMBRE_EMPLEADO,
        FECHA_NACIMIENTO_EMPLEADO,
        DIRECCION,
        SEXO_EMPLEADO,
        TELEFONO,
        CORREO,
        EPS,
        FONDO_PENSION,
        ESTADO_CIVIL,
        HIJOS,
        ESTUDIOS,
        TIPO_SERVICIO
    } = req.body
    let sql = 'SELECT IDENTIFICACION_EMPLEADO FROM EMPLEADO WHERE IDENTIFICACION_EMPLEADO= ?'
    pool.query(sql, [IDENTIFICACION_EMPLEADO], (err, rows, fields) => {
        if (err) return err;
        if (rows[0]) return res.json({ status: "error", error: "Este dato ya existe" })
        else {
            let sql = `INSERT INTO EMPLEADO(
            IDENTIFICACION_EMPLEADO, 
            TIPO_DOCUMENTO, 
            NOMBRE_EMPLEADO, 
            FECHA_NACIMIENTO_EMPLEADO, 
            DIRECCION,
            SEXO_EMPLEADO,
            TELEFONO,
            CORREO,
            EPS,
            FONDO_PENSION,
            ESTADO_CIVIL,
            HIJOS,
            ESTUDIOS,
            TIPO_SERVICIO) 
        values (
        '${IDENTIFICACION_EMPLEADO}',
        '${TIPO_DOCUMENTO}',
        '${NOMBRE_EMPLEADO}',
        '${FECHA_NACIMIENTO_EMPLEADO}',
        '${DIRECCION}',
        '${SEXO_EMPLEADO}',
        '${TELEFONO}',
        '${CORREO}',
        '${EPS}',
        '${FONDO_PENSION}',
        '${ESTADO_CIVIL}',
        '${HIJOS}',
        '${ESTUDIOS}',
        '${TIPO_SERVICIO}'
        )`
            pool.query(sql, (err, rows, fields) => {
                if (err) throw err
                else {
                    res.json({ status: 'empleado agregado' })
                }
            })
        }
    })
});

//Delete
router.delete('/:IDENTIFICACION_EMPLEADO', (req, res) => {
    const { IDENTIFICACION_EMPLEADO } = req.params

    let sql = `DELETE FROM EMPLEADO WHERE IDENTIFICACION_EMPLEADO = '${IDENTIFICACION_EMPLEADO}'`
    pool.query(sql, (err, rows, fields) => {
        if (err) throw err
        else {
            res.json({ status: 'Se elimino el proveedor' })
        }
    })
});


//Put

router.put('/:ID', (req, res) => {
    const { ID } = req.params

    const {
        IDENTIFICACION_EMPLEADO,
        TIPO_DOCUMENTO,
        NOMBRE_EMPLEADO,
        FECHA_NACIMIENTO_EMPLEADO,
        DIRECCION,
        SEXO_EMPLEADO,
        TELEFONO,
        CORREO,
        EPS,
        FONDO_PENSION,
        ESTADO_CIVIL,
        HIJOS,
        ESTUDIOS,
        TIPO_SERVICIO
    } = req.body

    let sql = `update EMPLEADO set
    IDENTIFICACION_EMPLEADO = '${IDENTIFICACION_EMPLEADO}',
    TIPO_DOCUMENTO = '${TIPO_DOCUMENTO}',
    NOMBRE_EMPLEADO = '${NOMBRE_EMPLEADO}',
    FECHA_NACIMIENTO_EMPLEADO = '${FECHA_NACIMIENTO_EMPLEADO}',
    DIRECCION = '${DIRECCION}',
    SEXO_EMPLEADO = '${SEXO_EMPLEADO}',
    TELEFONO = '${TELEFONO}',
    CORREO = '${CORREO}',
    EPS = '${EPS}',
    FONDO_PENSION = '${FONDO_PENSION}',
    ESTADO_CIVIL = '${ESTADO_CIVIL}',
    HIJOS = '${HIJOS}',
    ESTUDIOS = '${ESTUDIOS}',
    TIPO_SERVICIO = '${TIPO_SERVICIO}'
    where IDENTIFICACION_EMPLEADO = '${ID}'`

    pool.query(sql, (err, rows, fields) => {
        if (err) throw err
        else {
            res.json({ status: 'Se modifico la informacion del empleado' })
        }
    })
})
module.exports = router;