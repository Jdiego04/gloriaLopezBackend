const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const pool = require('../../views/database');

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

//Correos automaticos
async function enviarCorreo(destinatario, asunto, contenido) {
    try {
      // Configuración de OAuth 2.0
      const oauth2Client = new google.auth.OAuth2(
        '834017606216-0madn9d1i69r7m3rk793gt0tl9kkn13j.apps.googleusercontent.com',
        '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',
        'https://developers.google.com/oauthplayground'
      );
  
      // Obtener un token de acceso
      const tokens = {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
        scope: 'https://mail.google.com/',
        token_type: 'Bearer',
        expiry_date: 123456789
      };
  
      oauth2Client.setCredentials(tokens);
  
      // Crear un transporte de correo con OAuth 2.0
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: 'glorialopezautomatico@gmail.com',
          clientId: '834017606216-0madn9d1i69r7m3rk793gt0tl9kkn13j.apps.googleusercontent.com',
          clientSecret: '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',
          refreshToken: 'refresh_token',
          accessToken: tokens.access_token,
          expires: tokens.expiry_date
        }
      });
  
      // Configurar el mensaje de correo
      const mensajeCorreo = {
        from: 'glorialopezautomatico@gmail.com',
        to: destinatario,
        subject: asunto,
        html: contenido
      };
  
      // Enviar el correo
      const info = await transporter.sendMail(mensajeCorreo);
      console.log('Correo enviado correctamente:', info.response);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
    }
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