const OracleDB = require("oracledb");

const { database } = require("./keys");

async function connectDataBase() {
  try {
    const connection = await OracleDB.getConnection(database);
    console.log("coneccion creada");
    return connection;
  } catch (error) {
    console.log(error);
  }
}
async function executeQuery(connection, sql, binds, options) {
  try {
    const result = await connection.execute(sql, binds, options);
    console.log("query ejecutado");
    return result;
  } catch (error) {
    console.log(error);
  }
}

async function finallyConexion(connection) {
  try {
    await connection.close();
    console.log("fin conexion");
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  connectDataBase,
  executeQuery,
  finallyConexion,
};
