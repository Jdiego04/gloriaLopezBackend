const express = require('express');
const router = express.Router();
const consultas = require('../scripts/consultas')
const pool = require('../views/database');

//tipos
router.get('/all', (req, res) => {
    pool.query(consultas.TIPODOCUMENTOS, (err, rows, fields) => {
       if (err) throw err;
        else {
            res.json(rows)
        }
        res.json('Hola');
    })
});

//tipo
router.get('/tipo:id', (req, res) => {
    const { id } = req.params
    pool.query(consultas.TIPODOCUMENTO,id, (err, rows, fields) => {
       if (err) throw err;
        else {
            res.json(rows)
        }
        res.json('Hola');
    })
});


router.post('/tipo', (req,res) => {

    const {rol} = req.body;
  
    pool.query(consultas.INSERTTIPODOC, 
        rol, (err, rows, fields) => {
            if(!err){
                res.json('Insertado correctamente');
            }else{
                console.log(err);
            } 
          })
  });


router.delete('/eliminar', (req, res) => {
    const {idRol} = req.body

    pool.query(consultas.ELIMINARTIPODOC, 
        idRol, (err, rows, fields) => {
        if (err) throw err
        else {
            res.json({status: 'Se desactivo el producto'})
        }
    })
})

module.exports = router;