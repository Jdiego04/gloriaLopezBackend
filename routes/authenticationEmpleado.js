const express = require('express');
const router = express.Router();
const pool = require('../views/database');
const keys = require('../views/keys');
const consultas = require('../scripts/consultas')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');


//Inicio de sesion
router.post('/singin',
    body('username').not().isEmpty().trim().escape().isEmail().normalizeEmail(),
    body('password').not().isEmpty().trim().escape(),
    (req,res) => {
   //Valida los campos
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
   
   const {username, password} = req.body;
   const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
   pool.query(consultas.AUTHEMP, 
   [username, hashedPassword], (err, rows, fields) => {
    if(!err){
       if(rows.length > 0){
          let data = JSON.stringify(rows[0]);
          const token = jwt.sign({data: data}, keys.secretEmp, {expiresIn: "1h"});
          res.cookie('token', token, { httpOnly: true });
          res.json({token});
        }else{
            res.json('Correo o contraseña incorrectas');
        }
    }else{
        console.log(err);
    } 
   })
});

//Cerrar la session
router.get('/logout', (req, res) => {
  //Limpia la cookie
  res.clearCookie('token');
  res.send('Cierre de sesión exitoso');
});

//JSON con mensajes de errores
{
    "errors" [
      {
        "location": "body",
        "msg": "Invalid value",
        "param": "username"
      }
    ]
  }

module.exports = router;