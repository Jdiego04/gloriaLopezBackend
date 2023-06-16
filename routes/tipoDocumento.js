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
    })
});

//tipo
router.get('/tipo', (req, res) => {
    const {id} = req.body;
    pool.query(consultas.TIPODOCUMENTO,id, (err, rows, fields) => {
       if (err) throw err;
        else {
            res.json(rows)
        }
    })
});


router.post('/tipo', (req,res) => {

    const {tipoDoc} = req.body;
  
    pool.query(consultas.INSERTTIPODOC, 
        tipoDoc, (err, rows, fields) => {
            if(!err){
                res.json('Insertado correctamente');
            }else{
                console.log(err);
            } 
          })
  });


router.delete('/eliminar', (req, res) => {
    const {idTipoDoc} = req.body

    pool.query(consultas.ELIMINARTIPODOC, 
        idTipoDoc, (err, rows, fields) => {
        if (err) throw err
        else {
            res.json({status: 'Se elimino con exito'})
        }
    })
})

module.exports = router;