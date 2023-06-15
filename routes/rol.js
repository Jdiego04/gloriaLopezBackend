const express = require('express');
const router = express.Router();
const consultas = require('../scripts/consultas')
const pool = require('../views/database');

//roles
router.get('/all', (req, res) => {
    pool.query(consultas.ROLES, (err, rows, fields) => {
       if (err) throw err;
        else {
            res.json(rows)
        }
    })
});

//rol
router.get('/rol:id', (req, res) => {
    const { id } = req.params
    pool.query(consultas.ROL,id, (err, rows, fields) => {
       if (err) throw err;
        else {
            res.json(rows)
        }
    })
});


router.post('/rol', (req,res) => {

    const {rol} = req.body;
  
    pool.query(consultas.INSERTROL, 
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

    pool.query(consultas.ELIMINARROL, 
        idRol, (err, rows, fields) => {
        if (err) throw err
        else {
            res.json({status: 'Se elimino con exito'})
        }
    })
})

module.exports = router;