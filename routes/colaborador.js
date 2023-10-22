const express = require('express');
const router = express.Router();
const { connectToDatabase} = require('../views/database');
const keys = require('../views/keys');
const consultas = require('../scripts/consultas')
const util = require('../scripts/util/util')



router.get('/all', async (req, res) => {
    const connection = await connectToDatabase();
    try{
        const result = await connection.execute(consultas.EMPLEADOS);
        res.json(result.rows);
    }catch (err) {
        console.error('Error al ejecutar la consulta:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error al cerrar la conexión:', err);
            }
        }
    }
});

router.get('/empleado', async (req, res) => {
    const { id } = req.body;
    const connection = await connectToDatabase();
    try{
      const result = await connection.execute(consultas.EMPLEADO, [id]);
      res.json(result.rows);
    } catch (err) {
        console.error('Error al ejecutar la consulta:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error al cerrar la conexión:', err);
        }
      }
    }
  });

module.exports = router;