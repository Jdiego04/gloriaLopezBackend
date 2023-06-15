const express = require('express');
const router = express.Router();
const consultas = require('../scripts/consultas')
const pool = require('../views/database');

//tipos
router.get('/all', (req, res) => {
    pool.query(consultas.TIPOEMPLEADOS, (err, rows, fields) => {
       if (err) throw err;
        else {
            res.json(rows)
        }
    })
});

//tipo
router.get('/tipo:id', (req, res) => {
    const { id } = req.params
    pool.query(consultas.TIPOEMPLEADO,id, (err, rows, fields) => {
       if (err) throw err;
        else {
            res.json(rows)
        }
    })
});


router.post('/tipo', (req,res) => {

    const {tipoEmpleado} = req.body;
  
    pool.query(consultas.INSERTTIPOEMPLEADO, 
        tipoEmpleado, (err, rows, fields) => {
            if(!err){
                res.json('Insertado correctamente');
            }else{
                console.log(err);
            } 
          })
  });


  router.post('/deactivate', (req,res) => {
    const {idTipoEmpleado} = req.body;
    pool.query(consultas.DESTIPOEMPLEADOS, 
      [idTipoEmpleado], (err, rows, fields) => {
       if(!err){
        res.json("Se cambio el estado con exito");
       }else{
           console.log(err);
       } 
      })
  });

module.exports = router;