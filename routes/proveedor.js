const express = require('express');
const router = express.Router();
const consultas = require('../scripts/consultas')
const pool = require('../views/database');
const util = require('../scripts/util/util')


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
router.get('/proveedor', (req, res) => {
  const {id} = req.body;
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
console.log(nombre)
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
    const {idProveedor} = req.body;
    pool.query(consultas.DESPROVEEDOR, 
      [idProveedor], (err, rows, fields) => {
       if(!err){
        res.json("Se cambio el estado con exito");
       }else{
           console.log(err);
       } 
      })
  });


//Actualizar registro
router.put('/update', (req,res) => {

    const {id,nombre, correo, direccion, idTipoDocumento, numeroDocumento} = req.body;
  
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