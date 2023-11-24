const express = require("express");
const router = express.Router();
const queries = require("../scripts/queries");

const queriesOracle = require("../scripts/queriesOracle");

const pool = require("../views/database");
const { body, validationResult } = require("express-validator");
const messages = require("../scripts/messages");
const validation = require("../scripts/util/validation");
const util = require("../scripts/util/util");



const OracleDB = require("oracledb");

const {
  finallyConexion,
  connectDataBase,
  executeQuery,
} = require("../views/database");
const { database } = require("../views/keys");



router.get("/allOracleAppointment", async (req, res) => {
  try {
    const connection = await OracleDB.getConnection(database);
    const resultado = await connection.execute(
      queriesOracle.appointment.allAppointment
    );
    await finallyConexion(connection);
    res.json({ status: 200, data: resultado.rows });
  } catch (error) {
    res.json({ status: 400, data: error });
  }
})


router.get("/allOracle", async (req, res) => {
  const { idService } = req.query;
  const params = { param1: idService };
  try {
    const connection = await OracleDB.getConnection(database);
    const resultado = await connection.execute(
      "SELECT * FROM tbl_servicios"
    );
    await finallyConexion(connection);
    res.json(resultado.rows);
  } catch (error) {
    res.json({
      status: 400,
      data: error,
    });
  }
});


router.put("/changeOracle", async (req, res) => {
  try {
    const { idState, valor, id_cita } = req.body;

    // Obtener la conexión
    const connection = await OracleDB.getConnection(database);

    // Definir la sentencia SQL con placeholders
    const sql = `
      UPDATE TBL_CITAS
      SET
      ID_ESTADOCITA = :idState,
      Valor_Cita = :valor
      WHERE Id_Cita = :id_cita`;

    // Ejecutar la sentencia SQL con los valores proporcionados
    const result = await connection.execute(sql, {
      idState: idState,
      valor: valor,
      id_cita: id_cita
    }, {
      autoCommit: true // Si quieres que se realice un commit automático
    });

    // Liberar la conexión
    await connection.close();

    // Verificar el resultado
    if (result.rowsAffected && result.rowsAffected === 1) {
      res.json({
        status: 200,
        data: messages.succesMessage.disabledSuccessfully,
      });
    } else {
      res.json({
        status: 400,
        data: messages.errorMessage.invalidAppointmentId,
      });
    }
  } catch (error) {
    res.json({
      status: 500,
      data: error.message || messages.errorMessage.internalServerError,
    });
  }
});


router.post("/insert", async (req, res) => {
  const connection = await OracleDB.getConnection(database);
  const { id_estado_cita,
    id_tipo_documento_cliente,
    numero_documento_cliente,
    id_tipo_documento_colaborador,
    numero_documento_colaborador,
    annio_cita,
    mes_cita,
    dia_cita,
    hora_cita,
    minutos_cita,
    valor_cita} = req.body;
  
  const sql =
    `INSERT INTO tbl_citas 
      (id_estadocita, id_tipodocumentocliente, numero_documentocliente, 
       id_tipodocumentocolaborador, numero_documentocolaborador, annio_cita, mes_cita, dia_cita, 
       hora_cita, minutos_cita, valor_cita) 
     VALUES 
      (:id_estado_cita, :id_tipo_documento_cliente, :numero_documento_cliente, 
       :id_tipo_documento_colaborador, :numero_documento_colaborador, :annio_cita, 
       :mes_cita, :dia_cita, :hora_cita, :minutos_cita, :valor_cita)`;
       
  const binds = {
    id_estado_cita: id_estado_cita,
    id_tipo_documento_cliente: id_tipo_documento_cliente,
    numero_documento_cliente: numero_documento_cliente,
    id_tipo_documento_colaborador: id_tipo_documento_colaborador,
    numero_documento_colaborador: numero_documento_colaborador,
    annio_cita: annio_cita,
    mes_cita: mes_cita,
    dia_cita: dia_cita,
    hora_cita: hora_cita,
    minutos_cita: minutos_cita,
    valor_cita: valor_cita
  };

  const result = await connection.execute(sql, binds, { autoCommit: true });

  res.json(result.rows);
});




module.exports = router;
