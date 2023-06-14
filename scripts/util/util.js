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

//Correos automaticos
async function enviarCorreo(destinatario, asunto, contenido) {
  try {
    const CLIENT_ID = '1090448767404-9ulr4tshtj9n66hhfcf1aqda7jl03u1e.apps.googleusercontent.com';
    const CLIENT_SECRET = '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';
    const REDIRECT_URI = 'https://mail.google.com/mail/';
    const REFRESH_TOKEN = '1//04Wv2r4EOisAZCgYIARAAGAQSNwF-L9IrJTnZfjyHuWFm5q_4v09aR4u-KpkFG-SRJBjsAEntnu7jhyFdSLi2z-gAFzqaHwSz3Qc';

    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'glorialopezautomatico@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: 'glorialopezautomatico@gmail.com',
      to: destinatario,
      subject: asunto,
      text: contenido,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', result);
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