const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const pool = require("../../views/database");
const OAuth2 = google.auth.OAuth2;
const mysql = require("mysql2");

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
      accountTransport.auth.redirectUri,
    );

    oauth2Client.setCredentials({
      refresh_token: accountTransport.auth.refreshToken,
      access_token: accountTransport.auth.accessToken, // Añade el accessToken actual
    });

    // Verificar la fecha de vencimiento del token antes de cada solicitud
    const expirationDate = new Date(accountTransport.auth.expiryDate);
    const currentDate = new Date();

    if (currentDate >= expirationDate) {
      // El token ha caducado, obtén uno nuevo
      const tokenResponse = await oauth2Client.getAccessToken();
      const newAccessToken = tokenResponse.token;

      // Actualiza el token en tu configuración
      accountTransport.auth.accessToken = newAccessToken;

      // Actualiza la fecha de vencimiento en tu configuración
      const newExpirationDate = new Date();
      newExpirationDate.setSeconds(
        newExpirationDate.getSeconds() + tokenResponse.res.data.expires_in,
      );
      accountTransport.auth.expiryDate = newExpirationDate.toISOString();
    }

    // Llama al callback con el transporter configurado
    callback(
      nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "glorialopezautomatico@gmail.com",
          clientId: accountTransport.auth.clientId,
          clientSecret: accountTransport.auth.clientSecret,
          refreshToken: accountTransport.auth.refreshToken,
          accessToken: accountTransport.auth.accessToken,
        },
      }),
    );
  } catch (error) {
    console.error("Error al configurar el transporte de correo:", error);
  }
}

// Correos automáticos
function sendMail(recipient, subject, content) {
  configureMailTransport(function (emailTransporter) {
    const mailOptions = {
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
    const rows = await pool.query(
      `SELECT * FROM ${mysql.escapeId(dato1)} WHERE ${mysql.escapeId(
        dato2,
      )} = ?`,
      [dato3],
    );

    // Verificar si hay resultados
    return rows.length > 0;
  } catch (error) {
    // Manejar errores
    console.error("Error en la consulta:", error);
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
