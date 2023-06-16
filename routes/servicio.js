const express = require('express');
const router = express.Router();
const consultas = require('../scripts/consultas')
const pool = require('../views/database');

//SERVICIOS
router.get('/all', (req, res) => {
    pool.query(consultas.SERVICIOS, (err, rows, fields) => {
       if (err) throw err;
        else {
            res.json(rows)
        }
    })
});

//servicio
router.get('/servicio:id', (req, res) => {
    const { id } = req.params
    pool.query(consultas.SERVICIO,id, (err, rows, fields) => {
       if (err) throw err;
        else {
            res.json(rows)
        }
    })
});


router.post('/servicio', (req,res) => {

    const {nombre, valor} = req.body;
  
    pool.query(consultas.INSERTSERVICIO, 
        [nombre, valor], (err, rows, fields) => {
            if(!err){
                res.json('Insertado correctamente');
            }else{
                console.log(err);
            } 
          })
  });


router.put('/desactivar', (req, res) => {
    const {idProducto} = req.body

    pool.query(consultas.DESSERVICIO, 
        idProducto, (err, rows, fields) => {
        if (err) throw err
        else {
            res.json({status: 'Se elimino con exito'})
        }
    })
})

router.put('/update', (req,res) => {

    const {id,nombre, valor} = req.body;
  
      pool.query(consultas.UPDATESERVICIO, 
        [nombre, valor, id], (err, rows, fields) => {
          if(!err){
              res.json('Actualizado correctamente');
          }else{
              console.log(err);
          } 
        })
  });

module.exports = router;