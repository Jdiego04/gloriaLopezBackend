const messages = {
  errors: {
    invalidCredentials: "Usuario o contraseña incorrectos.",
    notExist: "No existe.",
    notAvailable: "No esta disponible ese horario.",
    exist: "Este registro ya existe",
    noPermission: "No tienes permiso para realizar esa acción",
    noCreationAppointment: "Error al crear la cita",
    no: "El monto a retirar es mayor al total del servicio.",
    invalidTime:
      "La fecha final del servicio sobrepasa la hora de cierre. 7 p.m.",
    invalidTimeSaturday:
      "La fecha final del servicio sobrepasa la hora de cierre. 6 p.m.",
  },
  success: {},
  succesMessage: {
    insertedSuccessfully: "Elemento insertado correctamente.",
    disabledSuccessfully: "Elemento actualizado correctamente.",
    updatedSuccessfully: "Elemento actualizado correctamente.",
    sendSuccessfully: "Correo enviado correctamene.",
    logoutSuccessfully: "Se cerro la sesion correctamente.",
    notResult: "No se encontraron resultados.",
  },
  tables: {
    tblCategory: "TBL_CATEGORIAS",
    tblClient: "TBL_CLIENTES",
    tblCollaborator: "TBL_COLABORADORES",
    tblProvider: "TBL_PROVEEDORES",
    tblService: "TBL_SERVICIOS",
  },
};

module.exports = messages;
