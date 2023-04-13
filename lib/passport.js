const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//Al tener estos dos modulos podremos crear nuestras propias
//autenticaciones

passport.use('local.sigup', new LocalStrategy({
    usernameField: 'CORREO_CLIENTE',
    passwordField: 'CONTRASENA_CLIENTE',
    passReqToCallback: true
}, async(req,usernameField,passwordField,donde)=>{
console.log(req.body);
}));


//passport.serializeUser((usr.done)=>{});
