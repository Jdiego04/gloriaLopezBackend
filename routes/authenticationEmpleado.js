const express = require('express');
const router = express.Router();
const pool = require('../views/database');
const keys = require('../views/keys');
const consultas = require('../scripts/consultas')
const util = require('../scripts/util/util')
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

//Para recuperar contraseña
router.post('/recoverPassword', (req,res) => {
  const email = req.body;
  // Verificar si el token está presente en la cookie
  const token = req.cookies.token;
  if (token) {
      pool.query(consultas.RECOVERPASSWORDEMPLEADO,
          email,(err, rows, fields) => {
              if(!err){
                  if(rows.length > 0){
                      let data = JSON.stringify(rows[0]);
                      //Genera una contraseña provicional
                      const password = util.generarContrasena();
                      //Actualiza la contraseña
                      pool.query(consultas.UPDATEPASSWORDEMPLEADO,
                          [password, data.ID_USUARIO], (err, rows, fields) => {
                              if(!err){
                                  console.log('Update exitoso');
                              }else{
                                  console.log(err);
                              } 
                             })
                      //Mensaje y asusnto para enviar en un correo automatico
                      const asunto = 'Nueva contraseña Gloria Lopez'
                      const contenido = `
                          <html>
                          <body>
                              <h2>Su nueva contraseña provisional es: ${password}</h2>
                              <p>Por favor, cambie su contraseña en cuanto pueda.</p>
                              <p>Gracias.</p>
                          </body>
                          </html>
                      `;
                      //Envia el correo
                      util.enviarCorreo(email, asunto, contenido);
                  }
              }
          })
  } else {
      // Redirigir a la página de inicio de sesión
      res.redirect('/logout');
  }
  
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