const queries = {
  documentType: {
    allDocumentType:
      "SELECT Id_TipoDocumento, Tipo_Documento  FROM TBL_TIPO_DOCUMENTOS WHERE Activo = 'S'",
    documentType:
      "SELECT Id_TipoDocumento, Tipo_Documento  FROM TBL_TIPO_DOCUMENTOS WHERE Activo = 'S' AND Id_TipoDocumento = ?",
    newDocumentType:
      "INSERT INTO TBL_TIPO_DOCUMENTOS (Tipo_Documento) VALUES (?)",
    deactivate:
      "UPDATE TBL_TIPO_DOCUMENTOS \
      SET Activo = CASE \
        WHEN Activo = 'N' THEN 'S' \
        WHEN Activo = 'S' THEN 'N' \
      END \
      WHERE Id_TipoDocumento = ?",
  },
  service: {
    allService:
      "SELECT ts.Id_Servicio, ts.Id_Categoria,tc.Categoria,ts.Nombre_Servicio, ts.Valor_Servicio ,ts.Descripcion_Servicio, \
        ts.Duracion_Servicio, tp.Nombre AS nombre_Proveedor  FROM  TBL_SERVICIOS ts \
      JOIN TBL_CATEGORIAS tc ON tc.Id_Categoria = ts.Id_Categoria AND tc.Activo = 'S' \
      LEFT JOIN TBL_SERVICIOS_PROVEEDORES tsp ON tsp.Id_Servicio = ts.Id_Servicio \
      LEFT JOIN TBL_PROVEEDORES tp ON tp.Id_Proveedor  = tsp.Id_Proveedor AND tp.Activo = 'S' \
      WHERE ts.Activo = 'S'",
    service:
      "SELECT ts.Id_Servicio, ts.Id_Categoria,tc.Categoria,ts.Nombre_Servicio, ts.Valor_Servicio ,ts.Descripcion_Servicio, \
        ts.Duracion_Servicio, tp.Nombre AS nombre_Proveedor  FROM  TBL_SERVICIOS ts \
      JOIN TBL_CATEGORIAS tc ON tc.Id_Categoria = ts.Id_Categoria AND tc.Activo = 'S' \
      LEFT JOIN TBL_SERVICIOS_PROVEEDORES tsp ON tsp.Id_Servicio = ts.Id_Servicio \
      LEFT JOIN TBL_PROVEEDORES tp ON tp.Id_Proveedor  = tsp.Id_Proveedor AND tp.Activo = 'S' \
      WHERE ts.Activo = 'S' AND ts.Id_Servicio = ?",
    serviceByCategory:
      "SELECT ts.Id_Servicio, ts.Id_Categoria,tc.Categoria,ts.Nombre_Servicio, ts.Valor_Servicio ,ts.Descripcion_Servicio, \
        ts.Duracion_Servicio, tp.Nombre AS nombre_Proveedor  FROM  TBL_SERVICIOS ts \
      JOIN TBL_CATEGORIAS tc ON tc.Id_Categoria = ts.Id_Categoria AND tc.Activo = 'S' \
      LEFT JOIN TBL_SERVICIOS_PROVEEDORES tsp ON tsp.Id_Servicio = ts.Id_Servicio \
      LEFT JOIN TBL_PROVEEDORES tp ON tp.Id_Proveedor  = tsp.Id_Proveedor AND tp.Activo = 'S' \
      WHERE ts.Activo = 'S' AND tc.Id_Categoria = ?",
    serviceByProvider:
      "SELECT ts.Id_Servicio, ts.Id_Categoria,tc.Categoria,ts.Nombre_Servicio, ts.Valor_Servicio ,ts.Descripcion_Servicio, \
        ts.Duracion_Servicio, tp.Nombre AS nombre_Proveedor  FROM  TBL_SERVICIOS ts \
      JOIN TBL_CATEGORIAS tc ON tc.Id_Categoria = ts.Id_Categoria AND tc.Activo = 'S' \
      LEFT JOIN TBL_SERVICIOS_PROVEEDORES tsp ON tsp.Id_Servicio = ts.Id_Servicio \
      LEFT JOIN TBL_PROVEEDORES tp ON tp.Id_Proveedor  = tsp.Id_Proveedor AND tp.Activo = 'S' \
      WHERE ts.Activo = 'S' AND tp.Id_Proveedor = ?",
    serviceByAppointment:
      "SELECT ts.Id_Servicio, ts.Id_Categoria,tc.Categoria,ts.Nombre_Servicio, ts.Valor_Servicio ,ts.Descripcion_Servicio, \
        ts.Duracion_Servicio, tp.Nombre AS nombre_Proveedor  FROM  TBL_SERVICIOS ts \
      JOIN TBL_CATEGORIAS tc ON tc.Id_Categoria = ts.Id_Categoria AND tc.Activo = 'S' \
      LEFT JOIN TBL_SERVICIOS_PROVEEDORES tsp ON tsp.Id_Servicio = ts.Id_Servicio \
      LEFT JOIN TBL_PROVEEDORES tp ON tp.Id_Proveedor  = tsp.Id_Proveedor AND tp.Activo = 'S' \
      LEFT JOIN TBL_SERVICIOS_CITAS tsc ON tsc.Id_Servicio = ts.Id_Servicio \
      LEFT JOIN TBL_CITAS tc2 ON tc2.Id_Cita = tsc.Id_Cita \
      WHERE ts.Activo = 'S' AND tc2.Id_Cita = ?",
    deactivate:
      "UPDATE TBL_SERVICIOS \
      SET Activo = CASE \
        WHEN Activo = 'N' THEN 'S' \
        WHEN Activo = 'S' THEN 'N' \
      END \
      WHERE Id_Servicio = ?",
    updateService:
      "UPDATE TBL_SERVICIOS \
      SET \
        Id_Categoria = ?, \
        Nombre_Servicio = ?, \
        Valor_Servicio = ?, \
        Descripcion_Servicio = ?, \
        Duracion_Servicio = ? \
      WHERE Id_Servicio = ?",
    newService:
      "INSERT INTO TBL_SERVICIOS \
        (Id_Categoria, Nombre_Servicio, Valor_Servicio, Descripcion_Servicio, Duracion_Servicio) \
      VALUES (?, ?, ?, ?, ?)",
    newServiceAppointment:
      "INSERT INTO TBL_SERVICIOS_CITAS (Id_Servicio, Id_Cita) VALUES (?, ?)",
    newServiceProvider:
      "INSERT INTO TBL_SERVICIOS_PROVEEDORES (Id_Servicio, Id_cita) VALUES (?, ?)",
  },
  provider: {
    allProvider:
      "SELECT Id_Proveedor, Nombre, Numero_Contacto,	Direccion \
       FROM TBL_PROVEEDORES WHERE Activo = 'S'",
    provider:
      "SELECT Id_Proveedor, Nombre, Numero_Contacto,	Direccion \
      FROM TBL_PROVEEDORES WHERE Activo = 'S' AND Id_Proveedor = ?",
    newProvider:
      "INSERT INTO TBL_PROVEEDORES \
        (Nombre, Numero_Contacto,	Direccion) \
      VALUES (?, ?, ?)",
    desactivate:
      "UPDATE TBL_PROVEEDORES \
      SET Activo = CASE \
        WHEN Activo = 'N' THEN 'S' \
        WHEN Activo = 'S' THEN 'N' \
      END \
      WHERE Id_Proveedor = ?",
    updateProvider:
      "UPDATE TBL_PROVEEDORES \
      SET \
        Nombre = ?, \
        Numero_Contacto = ?, \
        Direccion = ? \
      WHERE Id_Proveedor = ?",
  },
  collaborator: {
    collaboratorAuthentication:
      "SELECT COALESCE(GROUP_CONCAT(CONCAT(tm.Nombre_Modulo, '_', tp.valor_permiso) SEPARATOR ', '), 'NULL') AS permissions \
      FROM TBL_COLABORADORES tc \
      LEFT JOIN TBL_MODULOS_PERMISOS tmp ON tmp.Numero_DocumentoColaborador = tc.Numero_DocumentoColaborador \
          AND tmp.Id_TipoDocumento = tc.Id_TipoDocumento \
      LEFT JOIN TBL_MODULOS tm ON tm.Id_Modulo = tmp.Id_Modulo \
      LEFT JOIN TBL_PERMISOS tp ON tp.Id_Permiso = tmp.Id_Permiso \
      WHERE tc.Correo_Electronico = ? AND \
      tc.Contrasennia = ? \
      GROUP BY tc.Correo_Electronico, tc.Contrasennia ",
    recoverPassword:
      "SELECT * FROM TBL_COLABORADORES WHERE Correo_Electronico = ?",
    updatePassword:
      "UPDATE TBL_COLABORADORES SET Contrasennia = ? WHERE Correo_Electronico = ?",
    newCollaborator:
      "INSERT INTO TBL_COLABORADORES \
        (Nombres, Primer_Apellido, Segundo_Apellido, Id_TipoDocumento, Numero_DocumentoColaborador, \
        Numero_Contacto, Correo_Electronico, Contrasennia, Fecha_Ingreso, Fecha_Nacimiento, Id_Cargo) \
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  },
};

const AUTHEMP = "SELECT * FROM EMPLEADO WHERE CORREO = ? AND CONTRASENA = ?";
const RECOVERPASSWORDEMPLEADO =
  "SELECT ID_EMPLEADO, CONTRASENA FROM EMPLEADO WHERE CORREO = ?";
const UPDATEPASSWORDEMPLEADO =
  "UPDATE EMPLEADO SET CONTRASENA = ? WHERE CORREO = ?";
const RECOVERPASSWORD =
  "SELECT ID_USUARIO, CONTRASENA FROM USUARIO WHERE CORREO = ?";
const UPDATEPASSWORD = "UPDATE USUARIO SET CONTRASENA = ? WHEERE CORREO = ?";
const AUTHUSU = "SELECT * FROM USUARIO WHERE CORREO = ? AND CONTRASENA = ?";
const CITAS =
  " SELECT \
                  c.ID_CITA, \
                  c.FECHA_INICIO, \
                  c.FECHA_FIN, \
                  c.ID_SERVICIO, \
                  s.NOMBRE AS NOMBRE_SERVICIO, \
                  s.VALOR AS VALOR_ACTIVO, \
                  c.ID_USUARIO, \
                  u.NOMBRE AS NOMBRE_USUARIO, \
                  tdu.TIPO_DOCUMENTO AS TIPO_DOCUMENTO_USUARIO, \
                  u.NUMERO_DOCUMENTO AS NUMERO_DOCUMENTO_USUARIO, \
                  u.CELULAR AS CELULAR_USUARIO, \
                  c.ID_EMPLEADO, \
                  e.NOMBRE AS NOMBRE_EMPLEADO, \
                  tde.TIPO_DOCUMENTO AS TIPO_DOCUMENTO_EMPLEADO, \
                  e.NUMERO_DOCUMENTO AS NUMERO_DOCUMENTO_EMPLEADO, \
                  e.CELULAR AS CELULAR_EMPLEADO, \
                  c.ID_ESTADO, \
                  es.ESTADO_CITA \
                FROM CITA c \
                JOIN SERVICIO s ON s.ID_SERVICIO = c.ID_SERVICIO AND s.ACTIVO = 'S' \
                JOIN USUARIO u ON u.ID_USUARIO = c.ID_USUARIO \
                JOIN TIPO_DOCUMENTO tdu ON tdu.ID_TIPO_DOCUMENTO = u.ID_TIPO_DOCUMENTO \
                JOIN EMPLEADO e ON e.ID_EMPLEADO = c.ID_EMPLEADO AND e.ACTIVO = 'S' \
                JOIN TIPO_DOCUMENTO tde ON tde.ID_TIPO_DOCUMENTO = e.ID_TIPO_DOCUMENTO \
                JOIN ESTADO_CITA es ON es.ID_ESTADO_CITA = c.ID_ESTADO";
const CITA =
  "  SELECT \
                  c.ID_CITA, \
                  c.FECHA_INICIO, \
                  c.FECHA_FIN, \
                  c.ID_SERVICIO, \
                  s.NOMBRE AS NOMBRE_SERVICIO, \
                  s.VALOR AS VALOR_ACTIVO, \
                  c.ID_USUARIO, \
                  u.NOMBRE AS NOMBRE_USUARIO, \
                  tdu.TIPO_DOCUMENTO AS TIPO_DOCUMENTO_USUARIO, \
                  u.NUMERO_DOCUMENTO AS NUMERO_DOCUMENTO_USUARIO, \
                  u.CELULAR AS CELULAR_USUARIO, \
                  c.ID_EMPLEADO, \
                  e.NOMBRE AS NOMBRE_EMPLEADO, \
                  tde.TIPO_DOCUMENTO AS TIPO_DOCUMENTO_EMPLEADO, \
                  e.NUMERO_DOCUMENTO AS NUMERO_DOCUMENTO_EMPLEADO, \
                  e.CELULAR AS CELULAR_EMPLEADO, \
                  c.ID_ESTADO, \
                  es.ESTADO_CITA \
                FROM CITA c \
                JOIN SERVICIO s ON s.ID_SERVICIO = c.ID_SERVICIO AND s.ACTIVO = 'S' \
                JOIN USUARIO u ON u.ID_USUARIO = c.ID_USUARIO \
                JOIN TIPO_DOCUMENTO tdu ON tdu.ID_TIPO_DOCUMENTO = u.ID_TIPO_DOCUMENTO \
                JOIN EMPLEADO e ON e.ID_EMPLEADO = c.ID_EMPLEADO AND e.ACTIVO = 'S' \
                JOIN TIPO_DOCUMENTO tde ON tde.ID_TIPO_DOCUMENTO = e.ID_TIPO_DOCUMENTO \
                JOIN ESTADO_CITA es ON es.ID_ESTADO_CITA = c.ID_ESTADO \
                WHERE c.ID_CITA = ?";
const INSERTCITA = "INSERT INTO CITA VALUES(?, ?, ?, ?, ?, ?)";
const UPDATECITA = "UPDATE CITA SET ID_ESTADO = ? WHEERE ID_CITA = ?";
const EMPLEADOS =
  "SELECT \
                    e.ID_EMPLEADO, \
                    e.NOMBRE, \
                    e.FECHA_NACIMIENTO, \
                    e.FECHA_INGRESO, \
                    e.DIRECCION, \
                    e.ID_TIPO_DOCUMENTO, \
                    td.TIPO_DOCUMENTO, \
                    e.NUMERO_DOCUMENTO, \
                    e.CORREO, \
                    e.CELULAR, \
                    e.ID_TIPO_EMPLEADO, \
                    te.TIPO_EMPLEADO \
                  FROM EMPLEADO e  \
                  JOIN TIPO_DOCUMENTO td ON td.ID_TIPO_DOCUMENTO = e.ID_TIPO_DOCUMENTO \
                  JOIN TIPO_EMPLEADO te ON te.ID_TIPO_EMPLEADO = e.ID_TIPO_EMPLEADO AND te.ACTIVO = 'S' \
                  WHERE e.ACTIVO = 'S'";
const EMPLEADO =
  "SELECT \
                  e.ID_EMPLEADO, \
                  e.NOMBRE, \
                  e.FECHA_NACIMIENTO, \
                  e.FECHA_INGRESO, \
                  e.DIRECCION, \
                  e.ID_TIPO_DOCUMENTO, \
                  td.TIPO_DOCUMENTO, \
                  e.NUMERO_DOCUMENTO, \
                  e.CORREO, \
                  e.CELULAR, \
                  e.ID_TIPO_EMPLEADO, \
                  te.TIPO_EMPLEADO \
                FROM EMPLEADO e  \
                JOIN TIPO_DOCUMENTO td ON td.ID_TIPO_DOCUMENTO = e.ID_TIPO_DOCUMENTO \
                JOIN TIPO_EMPLEADO te ON te.TIPO_EMPLEADO = e.ID_TIPO_EMPLEADO AND te.ACTIVO = 'S' \
                WHERE e.ACTIVO = 'S' AND e.ID_EMPLEADO = ?";
const INSERTEMPLEADO =
  "insert into empleado ( \
                          nombre, \
                          fecha_nacimiento, \
                          fecha_ingreso, \
                          direccion, \
                          id_tipo_documento, \
                          numero_documento, \
                          correo, \
                          celular, \
                          contrasena, \
                          id_rol, \
                          id_tipo_empleado) \
                          values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
const ESTADOS = "SELECT ID_ESTADO_CITA, ESTADO_CITA FROM ESTADO_CITA";
const ESTADO =
  "SELECT ID_ESTADO_CITA, ESTADO_CITA FROM ESTADO_CITA WHERE ID_ESTADO_CITA = ?";
const INSERTESTADO = "INSERT INTO ESTADO_CITA (ESTADO_CITA) VALUES (?)";
const ELIMINARESTADO = "DELETE FROM ESTADO_CITA WHERE ID_ESTADO_CITA = ?";
const PRODUCTOS =
  "SELECT \
                     p.ID_PRODUCTO, \
                     p.NOMBRE_PRODUCTO, \
                     p.CANTIDAD, \
                     p.ID_TIPO_PRODUCTO, \
                     tp.TIPO_PRODUCTO, \
                     pr.ID_PROVEEDOR, \
                     pr.NOMBRE AS PROVEEDOR \
                  FROM PRODUCTO p \
                  JOIN TIPO_PRODUCTO tp ON tp.ID_TIPO_PRODUCTO = p.ID_TIPO_PRODUCTO AND TP.ACTIVO = 'S' \
                  JOIN productoproveedor pp ON pp.ID_PRODUCTO = p.ID_PRODUCTO \
                  JOIN proveedor pr ON pr.ID_PROVEEDOR = pp.ID_PROVEEDOR \
                   WHERE p.ACTIVO = 'S'";
const PRODUCTO =
  "SELECT \
                  p.ID_PRODUCTO, \
                  p.NOMBRE_PRODUCTO, \
                  p.CANTIDAD, \
                  p.ID_TIPO_PRODUCTO, \
                  tp.TIPO_PRODUCTO, \
                  pr.ID_PROVEEDOR, \
                  pr.NOMBRE AS PROVEEDOR \
                  FROM PRODUCTO p \
                  JOIN TIPO_PRODUCTO tp ON tp.ID_TIPO_PRODUCTO = p.ID_TIPO_PRODUCTO AND TP.ACTIVO = 'S' \
                  JOIN productoproveedor pp ON pp.ID_PRODUCTO = p.ID_PRODUCTO \
                  JOIN proveedor pr ON pr.ID_PROVEEDOR = pp.ID_PROVEEDOR \
                  WHERE p.ACTIVO = 'S' AND p.ID_PRODUCTO = ?";
const INSERTPRODUCTO =
  "INSERT INTO producto(NOMBRE_PRODUCTO, CANTIDAD, ID_TIPO_PRODUCTO) VALUES (?,?,?)";
const DESPRODUCTO = "UPDATE PRODUCTO SET ACTIVO = 'N' WHERE ID_PRODUCTO = ?";
const VERIFICARCORREOEMPLEADO = "SELECT * FROM EMPLEADO WHERE CORREO = ?";
const VERIFICARDOCUMENTOEMPLEADO =
  "SELECT * FROM EMPLEADO WHERE NUMERO_DOCUMENTO = ?";
const DEACTIVATEEMPLEADO = "UPDATE EMPLEADO SET ACTIVO = 'N' WHERE ID_EMPLEADO";
const UPDATEEMPLEADO =
  "UPDATE EMPLEADO \
                        SET \
                        NOMBRE = ?, \
                          FECHA_NACIMIENTO = ?, \
                          FECHA_INGRESO = ?, \
                          DIRECCION = ?, \
                          ID_TIPO_DOCUMENTO = ?, \
                          NUMERO_DOCUMENTO = ?, \
                          CORREO = ?, \
                          CELULAR = ?, \
                          CONTRASENA = ?, \
                          ID_ROL = ?, \
                          ID_TIPO_EMPLEADO = ? \
                        WHERE ID_EMPLEADO = ?";
const PROVEEDORES =
  "SELECT \
                        p.ID_PROVEEDOR, \
                        p.NOMBRE, \
                        p.CORREO, \
                        p.DIRECCION, \
                        td.TIPO_DOCUMENTO, \
                        p.NUMERO_DOCUMENTO \
                      FROM PROVEEDOR p \
                      JOIN TIPO_DOCUMENTO td ON td.ID_TIPO_DOCUMENTO = p.ID_TIPO_DOCUMENTO";
const PROVEEDOR =
  "SELECT \
                    p.ID_PROVEEDOR, \
                    p.NOMBRE, \
                    p.CORREO, \
                    p.DIRECCION, \
                    td.TIPO_DOCUMENTO, \
                    p.NUMERO_DOCUMENTO \
                  FROM PROVEDOR p \
                  JOIN TIPO_DOCUMENTO td ON td.ID_TIPO_DOCUMENTO = p.ID_TIPO_DOCUMENTO \
                  WHERE p.ACTIVO = 'S' AND p.ID_PROVEEDOR = ?";
const INSERTPROVEEDOR =
  "INSERT INTO PROVEEDOR( \
                          NOMBRE, \
                          CORREO, \
                          DIRECCION, \
                          ID_TIPO_DOCUMENTO, \
                          NUMERO_DOCUMENTO) \
                        VALUES(?, ?, ?, ?, ?)";
const DESPROVEEDOR = "UPDATE PROVEEDOR SET ACTIVO = 'N' WHERE ID_PROVEEDOR = ?";
const UPDATEPROVEEDOR =
  "UPDATE PROVEEDOR \
                          SET \
                          NOMBRE = ?, \
                          CORREO = ?, \
                          DIRECCION = ?, \
                          ID_TIPO_DOCUMENTO = ?, \
                          NUMERO_DOCUMENTO = ? \
                          WHERE ID_PROVEEDOR  = ?";
const UPDATEPRODUCTO =
  "UPDATE PRODUCTO \
                        SET \
                        NOMBRE_PRODUCTO = ?, \
                        CANTIDAD = ? \
                        WHERE ID_PRODUCTO = ?";
const ROLES = "SELECT ID_ROL, ROL FROM ROL";
const ROL = "SELECT ID_ROL, ROL FROM ROL WHERE = ?";
const INSERTROL = "INSERT INTO ROL (ROL) VALUES (?)";
const ELIMINARROL = "DELETE FROM ROL WHERE ID_ROL = ?";
const SERVICIOS = "SELECT ID_SERVICIO, NOMBRE, VALOR FROM SERVICIO";
const SERVICIO =
  "SELECT ID_SERVICIO, NOMBRE, VALOR FROM SERVICIO WHERE ACTIVO = 'S' AND ID_SERVICIO = ?";
const INSERTSERVICIO = "INSERT INTO SERVICIO (NOMBRE, VALOR) VALUES (?, ?)";
const UPDATESERVICIO =
  "UPDATE SERVICIO SET NOMBRE = ?, VALOR = ? WHERE ID_SERVICIO = ?";
const DESSERVICIO = "UPDATE SERVICIO SET ACTIVO = 'N' WHERE ID_SERVICIO = ?";

const TIPOEMPLEADOS =
  "SELECT ID_TIPO_EMPLEADO, TIPO_EMPLEADO FROM TIPO_EMPLEADO WHERE ACTIVO = 'S'";
const TIPOEMPLEADO =
  "SELECT ID_TIPO_EMPLEADO, TIPO_EMPLEADO FROM TIPO_EMPLEADO WHERE ID_TIPO_EMPLEADO = ?";
const INSERTTIPOEMPLEADO =
  "INSERT INTO TIPO_EMPLEADO (TIPO_EMPLEADO) VALUES (?)";
const DESTIPOEMPLEADOS =
  "UPDATE TIPO_EMPLEADO SET ACTIVO = 'N' WHERE ID_TIPO_EMPLEADO = ?";
const TIPOPRODUCTOS =
  "SELECT ID_TIPO_PRODUCTO, TIPO_PRODUCTO FROM TIPO_PRODUCTO WHERE ACTIVO = 'S'";
const TIPOPRODUCTO =
  "SELECT ID_TIPO_PRODUCTO, TIPO_PRODUCTO FROM TIPO_PRODUCTO WHERE ID_TIPO_PRODUCTO = ?";
const INSERTTIPOPRODUCTO =
  "INSERT INTO TIPO_PRODUCTO (TIPO_PRODUCTO) VALUES (?)";
const DESTIPOPRODUCTO =
  "UPDATE TIPO_PRODUCTO SET ACTIVO = 'N' WHERE TIPO_PRODUCTO = ?";
const USUARIOS =
  "SELECT ID_USUARIO, NOMBRE, td.TIPO_DOCUMENTO, NUMERO_DOCUMENTO, CELULAR, CORREO, CONTRASENA \
                  FROM USUARIO u \
                  JOIN TIPO_DOCUMENTO td ON td.ID_TIPO_DOCUMENTO = u.ID_TIPO_DOCUMENTO";
const USUARIO =
  "SELECT ID_USUARIO, NOMBRE, td.TIPO_DOCUMENTO, NUMERO_DOCUMENTO, CELULAR, CORREO, CONTRASENA \
                FROM USUARIO u \
                JOIN TIPO_DOCUMENTO td ON td.ID_TIPO_DOCUMENTO = u.ID_TIPO_DOCUMENTO \
                WHERE ID_USUARIO = ?";
const UPDATEUSUARIO =
  "UPDATE USUARIO \
                        SET NOMBRE = ?,\
                        ID_TIPO_DOCUMENTO = ?, \
                        NUMERO_DOCUMENTO = ?,\
                        CELULAR = ?,\
                        CORREO = ?,\
                        CONTRASENA = ?\
                        WHERE ID_USUARIO = ?";
const INSERTUSUARIO =
  "INSERT INTO USUARIO ( \
                        NOMBRE, \
                        ID_TIPO_DOCUMENTO, \
                        NUMERO_DOCUMENTO, \
                        CELULAR, \
                        CORREO, \
                        CONTRASENA) \
                        VALUES (?,?,?,?,?,?)";
const VERIFICARCORREOUSUARIO = "SELECT * FROM USUARIO WHERE CORREO = ?";
const VERIFICARDOCUMENTOUSUARIO =
  "SELECT * FROM USUARIO WHERE NUMERO_DOCUMENTO = ?";
const VERIFICARCORREOPROVEEDOR = "SELECT * FROM PROVEEDOR WHERE CORREO = ?";
const VERIFICARDOCUMENTOPROVEEDOR =
  "SELECT * FROM PROVEEDOR WHERE NUMERO_DOCUMENTO = ?";
const MAXPRODUCTO = "SELECT MAX(ID_PRODUCTO) AS max_id FROM PRODUCTO";
const INSERTPRODUCTOPROVEEDOR =
  "INSERT INTO PRODUCTOPROVEEDOR (ID_PROVEEDOR, ID_PRODUCTO) VALUES (?,?)";

module.exports = queries;
