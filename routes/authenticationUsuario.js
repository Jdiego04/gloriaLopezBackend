const express = require('express');
const router = express.Router();
const pool = require('../views/database');
const keys = require('../views/keys');
const consultas = require('../scripts/consultas')
const util = require('../scripts/util/util')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');



router.post('/singin', (req,res) => {
   const {username, password} = req.body;
   const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
   pool.query(consultas.AUTHUSU, 
   [username, hashedPassword], (err, rows, fields) => {
    if(!err){
       if(rows.length > 0){
          let data = JSON.stringify(rows[0]);
          const token = jwt.sign({data: data}, keys.secretUsu, {expiresIn: "1h"});
          res.json({token});
        }else{
            res.json('Correo o contraseña incorrectas');
        }
    }else{
        console.log(err);
    } 
   })
});


router.post('/recoverPassword', (req,res) => {
    const email = req.body;
    pool.query(consultas.RECOVERPASSWORD,
        email,(err, rows, fields) => {
            if(!err){
                if(rows.length > 0){
                    let data = JSON.stringify(rows[0]);
                    const password = util.generarContrasena();

                    pool.query(consultas.UPDATEPASSWORD,
                        [password, data.ID_USUARIO], (err, rows, fields) => {
                            if(!err){
                                console.log('Update exitoso');
                            }else{
                                console.log(err);
                            } 
                           })
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

                    util.enviarCorreo(email, asunto, contenido);
                }
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
        const content =jwt.verify(token, keys.secretUsu);
        req.data = content;
        next();
    }else{
        res.status(401).json('Token vacio');
    }
}


module.exports = router;