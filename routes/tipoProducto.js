const express = require('express');
const router = express.Router();
const consultas = require('../scripts/consultas')
const pool = require('../views/database');

//tipos
router.get('/all', (req, res) => {
    pool.query(consultas.TIPOPRODUCTOS, (err, rows, fields) => {
       if (err) throw err;
        else {
            res.json(rows)
        }
    })
});

//tipo
router.get('/tipo', (req, res) => {
    const {id} = req.body;
    pool.query(consultas.TIPOPRODUCTO,id, (err, rows, fields) => {
       if (err) throw err;
        else {
            res.json(rows)
        }
    })
});


router.post('/tipo', (req,res) => {

    const {tipoProducto} = req.body;
  
    pool.query(consultas.INSERTTIPOPRODUCTO, 
        tipoProducto, (err, rows, fields) => {
            if(!err){
                res.json('Insertado correctamente');
            }else{
                console.log(err);
            } 
          })
  });


  router.post('/deactivate', (req,res) => {
    const {idTipoProducto} = req.body;
    pool.query(consultas.DESTIPOPRODUCTO, 
      [idTipoProducto], (err, rows, fields) => {
       if(!err){
        res.json("Se cambio el estado con exito");
       }else{
           console.log(err);
       } 
      })
  });

module.exports = router;