//Nos conectamos a mysql
const mysql =  require('mysql'); 
const { promisify } = require('util');

const { database } = require('./keys');


const pool = mysql.createPool(database);

pool.getConnection((err, connection)=>{
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.errorr('DATABASE CONNECTION WAS CLOSED');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TO MANY CONNECTION');
        }
        if(err.code === 'ECONNREFUSED'){
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }
    if(connection) connection.release();
    console.log('BD is Connected');
    return; 
});

//Promisify Pool Querys
//Con esto lo que se define es la promesa de que hay "algo" que retornará esa comunicación, y qué sucederá en caso de que funcione correctamente
pool.query =promisify(pool.query);

module.exports = pool; 