const express = require('express');
const router = express.Router();
const consultas = require('../scripts/consultas')
const pool = require('../views/database');

//estados
router.get('/all', (req, res) => {
    pool.query(consultas.ESTADOS, (err, rows, fields) => {
       if (err) throw err;
        else {
            res.json(rows)
        }
        res.json('Hola');
    })
});

//estado
router.get('/estado:id', (req, res) => {
    const { id } = req.params
    pool.query(consultas.ESTADO,id, (err, rows, fields) => {
       if (err) throw err;
        else {
            res.json(rows)
        }
        res.json('Hola');
    })
});


router.post('/estado', (req,res) => {

    const {rol} = req.body;
  
    pool.query(consultas.INSERTESTADO, 
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

    pool.query(consultas.ELIMINARESTADO, 
        idRol, (err, rows, fields) => {
        if (err) throw err
        else {
            res.json({status: 'Se desactivo el producto'})
        }
    })
})

module.exports = router;