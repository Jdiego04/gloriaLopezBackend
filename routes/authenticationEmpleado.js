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
          res.json({token});
        }else{
            res.json('Correo o contraseña incorrectas');
        }
    }else{
        console.log(err);
    } 
   })
});


router.post('/test', verifyToken, (req,res) => {
   res.json('Informacion secreta');
 });

function verifyToken(req, res, next){
    if(!req.headers.authorization) return res.status(400).json('No autorizado');
    const token = req.headers['authorization'];
    
    if(token !== ''){
        const content =jwt.verify(token, keys.secretEmp);
        req.data = content;
        next();
    }else{
        res.status(401).json('Token vacio');
    }
}

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