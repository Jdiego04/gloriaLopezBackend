const express = require('express');
const router = express.Router();
const consultas = require('../scripts/consultas')
const pool = require('../views/database');

//Productos
router.get('/all', (req, res) => {
    pool.query(consultas.PRODUCTOS, (err, rows, fields) => {
       if (err) throw err;
        else {
            res.json(rows)
        }
    })
});

//Productos
router.get('/producto:id', (req, res) => {
    const { id } = req.params
    pool.query(consultas.PRODUCTO,id, (err, rows, fields) => {
       if (err) throw err;
        else {
            res.json(rows)
        }
    })
});


router.post('/productos', (req,res) => {

    const {nombreProducto, cantidad, idTipoProducto, idProveedor} = req.body;
    pool.query(consultas.INSERTPRODUCTO,
        [nombreProducto, cantidad, idTipoProducto], (err, rows, fields) => {
    if(!err){
        pool.query(consultas.INSERTPRODUCTO)
        res.json('Insertado correctamente');
    }else{
        console.log(err);
    }
})
});

// router.post('/producto', (req,res) => {

//     const {nombreProducto, cantidad, idTipoProducto, idProveedor} = req.body;
  
//     pool.query(consultas.INSERTPRODUCTO, 
//         [nombreProducto, cantidad, idTipoProducto], (err, rows, fields) => {
//           if(!err){
//             pool.query("SELECT MAX(ID_PRODUCTO) AS max_id FROM PRODUCTO", (err, rows, fields) => {

//                 if (err) throw err;
//                  else {
//                     const idProducto= rows[1][0].max_id;
//                     pool.query(consultas.INSERTPRODUCTOPROVEEDOR, 
//                         [idProducto, idProveedor], (err, rows, fields) => {
//                         if(!err){
//                               res.json('Insertado correctamente');
//                         }else{
//                               console.log(err);
//                         } 
//                     })
//                  }
//              })
//           }else{
//               console.log(err);
//           } 
//     })
//   });


router.put('/desactivar', (req, res) => {
    const {idProducto} = req.body

    pool.query(consultas.DESPRODUCTO, 
        idProducto, (err, rows, fields) => {
        if (err) throw err
        else {
            res.json({status: 'Se elimino con exito'})
        }
    })
})

router.put('/update/:id', (req,res) => {
    const id = req.params.id;
    const {nombreProducto, cantidad} = req.body;
  
      pool.query(consultas.UPDATEPRODUCTO, 
        [nombreProducto, cantidad, id], (err, rows, fields) => {
          if(!err){
              res.json('Actualizado correctamente');
          }else{
              console.log(err);
          } 
        })
  });

module.exports = router;