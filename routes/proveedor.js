const express = require('express');
const router = express.Router();
const consultas = require('../scripts/consultas')
const pool = require('../views/database');


//Get para todos proveedores
router.get('/all', (req, res) => {
    pool.query(consultas.PROVEEDORES, (err, rows, fields) => {
        if (err) throw err;
        else {
            res.json(rows)
        }
    })
});

//Get para un proveedor
router.get('/proveedor/:id', (req, res) => {
    const { id } = req.params
    pool.query(consultas.PROVEEDOR, id,(err, rows, fields) => {
        if (err) throw err;
        else {
            res.json(rows)
        }
    })
});


router.post('/proveedor', (req,res) => {
    const {nombre, correo, direccion, idTipoDocumento, numeroDocumento} = req.body;
  
    const validaCorreo = util.verificarExiste(correo, consultas.VERIFICARCORREOPROVEEDOR);
    const validaDocumento = util.verificarExiste(numeroDocumento, consultas.VERIFICARDOCUMENTOPROVEEDOR);

    if (!validaCorreo && !validaDocumento) {
      pool.query(consultas.INSERTPROVEEDOR, 
        [nombre, correo, direccion, idTipoDocumento, numeroDocumento], (err, rows, fields) => {
          if(!err){
              res.json('Insertado correctamente');
          }else{
              console.log(err);
          } 
        })
    }else{
      res.json('Este proveedor ya esta registrado');
    }
    
  });


  router.post('/deactivate', (req,res) => {
    //Se le envia en activo lo que se quiere cambiar
    const {idEmpleado, activo} = req.body;
    pool.query(consultas.DESPROVEEDOR, 
      [idEmpleado, activo], (err, rows, fields) => {
       if(!err){
        res.json("Se cambio el estado con exito");
       }else{
           console.log(err);
       } 
      })
  });


//Actualizar registro
router.put('/update/:id', (req,res) => {
    const id = req.params.id;
    const {nombre, correo, direccion, idTipoDocumento, numeroDocumento} = req.body;
  
      pool.query(consultas.UPDATEPROVEEDOR, 
        [nombre, correo, direccion, idTipoDocumento, numeroDocumento, id], (err, rows, fields) => {
          if(!err){
              res.json('Actualizado correctamente');
          }else{
              console.log(err);
          } 
        })
  });

module.exports = router;