const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const pool = require("../../views/database");
const OAuth2 = google.auth.OAuth2;
const mysql = require('mysql');

const accountTransport = require("./acountTransport.json");


//Generar contraseñas
function generatePassword() {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";

  // Generar caracteres aleatorios
  for (let i = 0; i < 7; i++) {
    const randomCharacters =
      characters[Math.floor(Math.random() * characters.length)];
    password += randomCharacters;
  }

  // Verificar si cumple con los requisitos y corregir en caso contrario
  if (!/[A-Z]/.test(password)) {
    const randomUppercaseLetter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[
      Math.floor(Math.random() * 26)
    ];
    password = password.slice(0, 1) + randomUppercaseLetter + password.slice(1);
  }

  if (!/[a-z]/.test(password)) {
    const randomLowercaseLetter = "abcdefghijklmnopqrstuvwxyz"[
      Math.floor(Math.random() * 26)
    ];
    password = password.slice(0, 2) + randomLowercaseLetter + password.slice(2);
  }

  if (!/[0-9]/.test(password)) {
    const randomNumber = "0123456789"[Math.floor(Math.random() * 10)];
    password += randomNumber;
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    const randomSpecialCharacter = "!@#$%^&*()"[Math.floor(Math.random() * 10)];
    password += randomSpecialCharacter;
  }

  return password;
}

async function configureMailTransport(callback) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      accountTransport.auth.clientId,
      accountTransport.auth.clientSecret,
      accountTransport.auth.redirectUri
    );

    oauth2Client.setCredentials({
      refresh_token: accountTransport.auth.refreshToken,
      tls: {
        rejectUnauthorized: false,
      },
    });

    oauth2Client.getAccessToken((err, token) => {
      if (err) return console.log(err);
      accountTransport.auth.accessToken = token;
      callback(nodemailer.createTransport(accountTransport));
    });
  } catch (error) {
    console.error(error);
  }
}

//Correos automaticos
function sendMail(recipient, subject, content) {
  configureMailTransport(function (emailTransporter) {
    const mailOptions = {
      mail: emailTransporter,
      from: "glorialopezautomatico@gmail.com",
      to: recipient,
      subject: subject,
      text: content,
    };
    emailTransporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error al enviar el correo electrónico:", error);
      } else {
        console.log("Correo electrónico enviado:", info);
      }
    });
  });
}

//Funcion generica para verificar si existe un registro
async function checkIfExists(dato1, dato2, dato3) {
  try {
    // Realizar la consulta usando async/await
    const rows = await pool.query(`SELECT * FROM ${mysql.escapeId(dato1)} WHERE ${mysql.escapeId(dato2)} = ?`, [dato3]);

    // Verificar si hay resultados
    return rows.length > 0;
  } catch (error) {
    // Manejar errores
    console.error('Error en la consulta:', error);
    throw error;
  }
}

function generateOTP() {
  const characters = "0123456789";
  let otp = "";

  for (let i = 0; i < 6; i++) {
    const randomCharacters =
      characters[Math.floor(Math.random() * characters.length)];
    otp += randomCharacters;
  }
  return otp;
}

module.exports = {
  generatePassword,
  sendMail,
  checkIfExists,
  generateOTP,
};
