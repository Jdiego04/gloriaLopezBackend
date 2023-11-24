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

router.get("/allOracleCategoria", async (req, res) => {
  try {
    const connection = await OracleDB.getConnection(database);
    const resultado = await connection.execute(
      queriesOracle.category.allCategoria
    );
    await finallyConexion(connection);

    const categoria = resultado.rows.map(row => {
      return {
        id_Categoria: row[0],
        categoria: row[1],
      };
    });

    res.json({ status: 200, data: categoria });
  } catch (error) {
    res.json({ status: 400, data: error });
  }
});

router.get("/allOracleServicesByCategory", async (req, res) => {
  const { idCategory } = req.query;
  const params = { param1: idCategory };
  try {
    const connection = await OracleDB.getConnection(database);
    const resultado = await connection.execute(
      queriesOracle.service.ServiceByCategoria,
      params
    );
    await finallyConexion(connection);

    const service = resultado.rows.map(row => {
      return {
        id_servicio: row[0],
        nombre_servicio: row[1],
      };
    });

    res.json({ status: 200, data: service });
  } catch (error) {
    res.json({ status: 400, data: error });
  }
});

router.get("/allOracleClientes", async (req, res) => {
  try {
    const connection = await OracleDB.getConnection(database);
    const resultado = await connection.execute(
      queriesOracle.client.allClient
    );
    await finallyConexion(connection);

    const client = resultado.rows.map(row => {
      return {
        id_tipodocumento: row[0],
        numero_documentocliente: row[1],
        nombre_Cliente: row[2],
      };
    });

    res.json({ status: 200, data: client });
  } catch (error) {
    res.json({ status: 400, data: error });
  }
});

router.get("/allOracleCollaboratorByCategory", async (req, res) => {
  const { idCategory } = req.query;
  const params = { param1: idCategory };
  try {
    const connection = await OracleDB.getConnection(database);
    const resultado = await connection.execute(
      queriesOracle.collaborator.CollaboratorByCategory,
      params
    );
    await finallyConexion(connection);

    const service = resultado.rows.map(row => {
      return {
        id_tipodocumento: row[0],
        numero_documentocolaborador: row[1],
        nombre_Colaborador: row[2],
      };
    });

    res.json({ status: 200, data: service });
  } catch (error) {
    res.json({ status: 400, data: error });
  }
});

router.get("/allOracleStateAppointment", async (req, res) => {
  try {
    const connection = await OracleDB.getConnection(database);
    const resultado = await connection.execute(
      queriesOracle.stateAppointment.allStateAppointment
    );
    await finallyConexion(connection);

    const StateAppointment = resultado.rows.map(row => {
      return {
        id_estadocita: row[0],
        estado_cita: row[1],
      };
    });

    res.json({ status: 200, data: StateAppointment });
  } catch (error) {
    res.json({ status: 400, data: error });
  }
});

router.get("/allOracleAppointment", async (req, res) => {
  try {
    const connection = await OracleDB.getConnection(database);
    const resultado = await connection.execute(
      queriesOracle.appointment.allAppointment
    );
    await finallyConexion(connection);

    const citas = resultado.rows.map(row => {
      return {
        id_cita: row[0],
        nombre_colaborador: row[1],
        nombre_cliente: row[2],
        fecha_inicio: row[3],
        fecha_final: row[4],
        valor_cita: row[5],
        numero_contacto: row[6],
        estado_cita: row[7]
      };
    });

    res.json({ status: 200, data: citas });
  } catch (error) {
    res.json({ status: 400, data: error });
  }
});


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

    const connection = await OracleDB.getConnection(database);
    const sql = `
      UPDATE TBL_CITAS
      SET
      ID_ESTADOCITA = :idState,
      Valor_Cita = :valor
      WHERE Id_Cita = :id_cita`;
    const result = await connection.execute(sql, {
      idState: idState,
      valor: valor,
      id_cita: id_cita
    }, {
      autoCommit: true 
    });

    await connection.close();

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
  const { 
    id_estado_cita,
    id_tipo_documento_cliente,
    numero_documento_cliente,
    id_tipo_documento_colaborador,
    numero_documento_colaborador,
    annio_cita,
    mes_cita,
    dia_cita,
    hora_cita,
    minutos_cita,
    services } = req.body;

  const sql =
    `INSERT INTO tbl_citas 
      (id_estadocita, id_tipodocumentocliente, numero_documentocliente, 
       id_tipodocumentocolaborador, numero_documentocolaborador, annio_cita, mes_cita, dia_cita, 
       hora_cita, minutos_cita, valor_cita) 
     VALUES 
      (:id_estado_cita, :id_tipo_documento_cliente, :numero_documento_cliente, 
       :id_tipo_documento_colaborador, :numero_documento_colaborador, :annio_cita, 
       :mes_cita, :dia_cita, :hora_cita, :minutos_cita, 0)`;

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
    services: services
  };

  const result = await connection.execute(sql, binds, { autoCommit: true });

  res.json(result.rows);
});

module.exports = router;
