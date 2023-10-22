//Nos conectamos a oracle
const oracledb = require('oracledb');
const { database } = require('./keys');

async function connectToDatabase() {
    try {
      const connection = await oracledb.getConnection(database);
      console.log('Conexión a la base de datos Oracle establecida.');
      return connection;
    } catch (err) {
      console.error('Error al conectar a la base de datos: ', err);
      throw err;
    }
  }
  
  async function executeQuery(connection, sql, binds = []) {
    try {
      const result = await connection.execute(sql, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT });
      return result.rows;
    } catch (err) {
      console.error('Error al ejecutar la consulta: ', err);
      throw err;
    }
  }
  
  module.exports = {
    connectToDatabase,
    executeQuery
  };

