const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const pool = require('../../views/database');
const OAuth2 = google.auth.OAuth2;

const accountTransport = require("./acountTransport.json");


//Generar contraseñas
function generarContrasena() {
    const caracteres = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let contrasena = '';
  
    // Generar caracteres aleatorios
    for (let i = 0; i < 7; i++) {
      const caracterAleatorio = caracteres[Math.floor(Math.random() * caracteres.length)];
      contrasena += caracterAleatorio;
    }
  
    // Verificar si cumple con los requisitos y corregir en caso contrario
    if (!/[A-Z]/.test(contrasena)) {
      const mayusculaAleatoria = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
      contrasena = contrasena.slice(0, 1) + mayusculaAleatoria + contrasena.slice(1);
    }
  
    if (!/[a-z]/.test(contrasena)) {
      const minusculaAleatoria = 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
      contrasena = contrasena.slice(0, 2) + minusculaAleatoria + contrasena.slice(2);
    }
  
    if (!/[0-9]/.test(contrasena)) {
      const numeroAleatorio = '0123456789'[Math.floor(Math.random() * 10)];
      contrasena += numeroAleatorio;
    }
  
    if (!/[^a-zA-Z0-9]/.test(contrasena)) {
      const especialAleatorio = '!@#$%^&*()'[Math.floor(Math.random() * 10)];
      contrasena += especialAleatorio;
    }
  
    return contrasena;
  }

  const mail_rover = async (callback) => {
    try {
      const oauth2Client = new OAuth2(
        accountTransport.auth.clientId,
        accountTransport.auth.clientSecret,
        "https://developers.google.com/oauthplayground",
        );
        oauth2Client.setCredentials({
            refresh_token: accountTransport.auth.refreshToken,
            tls: {
                rejectUnauthorized: false
            }
        });
        oauth2Client.getAccessToken((err, token) => {
            if (err)
                return console.log(err);;
            accountTransport.auth.accessToken = token;
            callback(nodemailer.createTransport(accountTransport));
        });
    }catch (error){
        console.error(error);
    }
    
};


//Correos automaticos
function enviarCorreo(destinatario, asunto, contenido) {
    mail_rover(function (emailTransporter) {
      const mailOptions = {
        mail: emailTransporter, 
        from: 'glorialopezautomatico@gmail.com',
        to: destinatario,
        subject: asunto,
        text: contenido
      };
      emailTransporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.error('Error al enviar el correo electrónico:', error);
        } else {
            console.log('Correo electrónico enviado:', info);
        }
    });
    });
}

    //Funcion generica para verificar si existe un registro
  function verificarExiste(dato, consulta) {
    pool.query(consulta, 
      dato, (err, rows, fields) => {
       if(!err){
          if(rows.length > 0){
             return true;
           }else{
               return false;
           }
       }else{
           console.log(err);
       } 
      })
  }
  
  async function actualizarRegistro(tabla, datos, condicion) {
    try {
      const result = await new Promise((resolve, reject) => {
        connection.query(
          `UPDATE ${tabla} SET ? WHERE ${condicion}`,
          [datos],
          (error, result) => {
            if (error) {
              console.error('Error al actualizar el registro:', error);
              reject(error);
              return;
            }
    
            resolve(result.affectedRows);
          }
        );
      });
  
      return result;
    } catch (error) {
      console.error('Error al actualizar el registro:', error);
      throw error;
    }
  }

  module.exports = {
    generarContrasena,
    enviarCorreo,
    verificarExiste,
    actualizarRegistro
  };