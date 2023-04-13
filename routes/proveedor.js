const express = require('express');
const router = express.Router();

const pool = require('../views/database');
//Proveedores: 


//Get para varios proveedores
router.get('/', (req, res) => {
    let sql = 'SELECT * FROM PROVEEDOR'
    pool.query(sql, (err, rows, fields) => {
        if (err) throw err;
        else {
            res.json(rows)
        }
    })
});
//Get para un proveedor
router.get('/:IDENTIFICACION_PROVEEDOR', (req, res) => {
    const { IDENTIFICACION_PROVEEDOR } = req.params
    let sql = 'SELECT * FROM PROVEEDOR WHERE IDENTIFICACION_PROVEEDOR = ?'
    pool.query(sql, [IDENTIFICACION_PROVEEDOR], (err, rows, fields) => {
        if (err) throw err;
        else {
            res.json(rows)
        }
    })
})

//Post
router.post('/', (req, res) => {
    const { IDENTIFICACION_PROVEEDOR, NOMBRE_PROVEEDOR, TELEFONO, CORREO, DIRECCION } = req.body
    let sql = 'SELECT IDENTIFICACION_PROVEEDOR FROM PROVEEDOR WHERE IDENTIFICACION_PROVEEDOR= ?'
    pool.query(sql,[IDENTIFICACION_PROVEEDOR], (err,rows,fields) =>{
        if(err) return err;
        if(rows[0]) return res.json({status: "error", error: "Este dato ya existe"})   
    else{
        let sql = `INSERT INTO PROVEEDOR(IDENTIFICACION_PROVEEDOR, NOMBRE_PROVEEDOR, TELEFONO, CORREO, DIRECCION) 
        values ('${IDENTIFICACION_PROVEEDOR}','${NOMBRE_PROVEEDOR}','${TELEFONO}','${CORREO}','${DIRECCION}')`
        pool.query(sql, (err, rows, fields) => {
            if (err) throw err
            else {
                res.json({ status: 'Proveedor agregado' })
            }
        })
    }
    }) 
});

//Delete
router.delete('/:IDENTIFICACION_PROVEEDOR', (req, res) => {
    const { IDENTIFICACION_PROVEEDOR } = req.params

    let sql = `DELETE FROM PROVEEDOR WHERE IDENTIFICACION_PROVEEDOR = '${IDENTIFICACION_PROVEEDOR}'`
    pool.query(sql, (err, rows, fields) => {
        if (err) throw err
        else {
            res.json({ status: 'Se elimino el proveedor' })
        }
    })
}); 

//Put
router.put('/:ID', (req, res) => {
    const {ID} = req.params
    const {IDENTIFICACION_PROVEEDOR, NOMBRE_PROVEEDOR, TELEFONO, CORREO, DIRECCION} = req.body

    let sql = `update PROVEEDOR set
    IDENTIFICACION_PROVEEDOR = '${IDENTIFICACION_PROVEEDOR}',
    NOMBRE_PROVEEDOR = '${NOMBRE_PROVEEDOR}',
    TELEFONO = '${TELEFONO}',
    CORREO = '${CORREO}',
    DIRECCION = '${DIRECCION}'
    where IDENTIFICACION_PROVEEDOR = '${ID}'`

    pool.query(sql, (err, rows, fields) => {
        if (err) throw err
        else {
            console.log('hola '+sql);
            res.json({status: 'Se modifico la informacion del proveedor'})
        }
    })
})




module.exports = router;