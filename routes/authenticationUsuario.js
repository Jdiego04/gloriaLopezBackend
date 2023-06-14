const express = require('express');
const router = express.Router();
const pool = require('../views/database');
const keys = require('../views/keys');
const consultas = require('../scripts/consultas')
const util = require('../scripts/util/util')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');

//Inicio de session para usuario
router.post('/login', (req,res) => {
    
   const {username, password} = req.body;
   //Crea el hash de sha256 con la contraseña
   const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
   //Hace la consulta
   pool.query(consultas.AUTHUSU, 
   [username, hashedPassword], (err, rows, fields) => {
    if(!err){
       if(rows.length > 0){
        //Crea el token y lo guarda en una cookie
          let data = JSON.stringify(rows[0]);
          const token = jwt.sign({data: data}, keys.secretUsu, {expiresIn: "1h"});
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
    const {email} = req.body;
  
    // Verificar si el token está presente en la cookie
    //const token = req.cookies.token;
   // if (token) {
        pool.query(consultas.RECOVERPASSWORD,
            email,(err, rows, fields) => {
                if(!err){
                    if(rows.length > 0){
                        let data = JSON.stringify(rows[0]);
                        //Genera una contraseña provicional
                        const password = util.generarContrasena();
                        console.log('contraseña generada' + password);
                        //Actualiza la contraseña
                        pool.query(consultas.UPDATEPASSWORD,
                            [password, email], (err, rows, fields) => {
                                if(!err){
                                    console.log('Update exitoso');
                                }else{
                                    console.log(err);
                                } 
                               })
                        //Mensaje y asusnto para enviar en un correo automatico
                        const asunto = 'Nueva contraseña Gloria Lopez'
                        const contenido = ` Su nueva contraseña provisional es: ${password} 
                        Por favor, cambie su contraseña en cuanto pueda. `;
                        //Envia el correo
                        util.enviarCorreo(email, asunto, contenido);
                        res.json('Enviado correctamente');
                    }else{
                      console.log("no se encontro");
                    }
                }else{
                  console.log(err);
                }
            })
   /* } else {
        // Redirigir a la página de inicio de sesión
        res.redirect('/logout');
    }*/
    
  });


//Cerrar la session
router.get('/logout', (req, res) => {
    //Limpia la cookie
    res.clearCookie('token');
    res.send('Cierre de sesión exitoso');
});

router.post('/singUp', (req,res) => {
    const {nombre, id_tipo_documento, numero_documento, celular, 
        correo, contrasena}= req.body;
  
    const validaCorreo = util.verificarExiste(correo, consultas.VERIFICARCORREOUSUARIO);
    const validaDocumento = util.verificarExiste(numero_documento, consultas.VERIFICARDOCUMENTOUSUARIO);
    if (!validaCorreo && !validaDocumento) {
    const hashedPassword = crypto.createHash('sha256').update(contrasena).digest('hex');
      pool.query(consultas.INSERTUSUARIO, 
        [nombre, id_tipo_documento, numero_documento, celular, correo, 
            hashedPassword], (err, rows, fields) => {
          if(!err){
              res.json('Insertado correctamente');
          }else{
              console.log(err);
          } 
        })
    }else{
      res.json('Este usuario ya esta registrado');
    }
    
  });
module.exports = router;