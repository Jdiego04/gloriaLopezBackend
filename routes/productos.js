const express = require('express');
const router = express.Router();
const consultas = require('../scripts/consultas')
const pool = require('../views/database');

//Productos
router.get('/', (req, res) => {
    let sql = consultas.PRODUCTOS;
    pool.query(sql, (err, rows, fields) => {
       if (err) throw err;
        else {
            res.json(rows)
        }
        res.json('Hola');
    })
});

//Get para un proveedor
/*router.get('/:IDENTIFICACION_PRODUCTO', (req, res) => {
    const { IDENTIFICACION_PRODUCTO } = req.params
    let sql = 'SELECT * FROM PRODUCTO WHERE IDENTIFICACION_PRODUCTO = ?'
    pool.query(sql, [IDENTIFICACION_PRODUCTO], (err, rows, fields) => {
        if (err) throw err;
        else {
            res.json(rows)
        }
    })
})*/

router.post('/', (req, res) => {
    const { IDENTIFICACION_PRODUCTO, NOMBRE_PRODUCTO, FECHA_COMPRA, CANTIDAD_PRODUCTO, IDENTIFICACION_PROVEEDOR } = req.body
    let sql = 'SELECT IDENTIFICACION_PRODUCTO FROM PRODUCTO WHERE IDENTIFICACION_PRODUCTO= ?'
    pool.query(sql,[IDENTIFICACION_PRODUCTO], (err,rows,fields)=>{
        if(err) return err;
        if(rows[0]) return res.json({status: "error", error: "Este dato ya existe"})   
    else{
        let sql = `INSERT INTO PRODUCTO(IDENTIFICACION_PRODUCTO, NOMBRE_PRODUCTO, FECHA_COMPRA, CANTIDAD_PRODUCTO, IDENTIFICACION_PROVEEDOR) 
        values ('${IDENTIFICACION_PRODUCTO}','${NOMBRE_PRODUCTO}','${FECHA_COMPRA}','${CANTIDAD_PRODUCTO}','${IDENTIFICACION_PROVEEDOR}')`
        pool.query(sql, (err, rows, fields) => {
            if (err) throw err
            else {
                res.json({ status: 'Producto agregado agregado' })
            }
        })
    } 
    })   
});

router.put('/desactivar', (req, res) => {

    const {idProducto} = req.body

    pool.query(consultas.DESPRODUCTO, 
        [idProducto], (err, rows, fields) => {
        if (err) throw err
        else {
            res.json({status: 'Se desactivo el producto'})
        }
    })
})

router.put('/:ID', (req, res) => {
    const {ID} = req.params
    const {IDENTIFICACION_PRODUCTO, NOMBRE_PRODUCTO, FECHA_COMPRA, CANTIDAD_PRODUCTO, IDENTIFICACION_PROVEEDOR} = req.body

    let sql = `UPDATE PRODUCTO SET
    IDENTIFICACION_PRODUCTO = '${IDENTIFICACION_PRODUCTO}',
    NOMBRE_PRODUCTO = '${NOMBRE_PRODUCTO}',
    FECHA_COMPRA = '${FECHA_COMPRA}',
    CANTIDAD_PRODUCTO = ${CANTIDAD_PRODUCTO},
    IDENTIFICACION_PROVEEDOR = '${IDENTIFICACION_PROVEEDOR}'
    where IDENTIFICACION_PRODUCTO = '${ID}'`
    


    pool.query(sql, (err, rows, fields) => {
        if (err) throw err
        else {
            res.json({status: 'Se modifico la informacion del proveedor'})
        }
    })
})
module.exports = router;