const AUTHEMP = "SELECT * FROM EMPLEADO WHERE CORREO = ? AND CONTRASENA = ?";
const AUTHUSU = "SELECT * FROM USUARIO WHERE CORREO = ? AND CONTRASENA = ?";
const CITAS = " SELECT \
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
const CITA = "  SELECT \
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
                WHERE c.ID_CITA = ?"
const INSERTCITA = "INSERT INTO CITA VALUES(?, ?, ?, ?, ?, ?)";
const UPDATECITA = "UPDATE CITA SET ID_ESTADO = ? WHEERE ID_CITA = ?"
const EMPLEADOS = "SELECT \
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
                  WHERE e.ACTIVO = 'S'"
const EMPLEADO = "SELECT \
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
const INSERTEMPLEADO = "INSERT INTO EMPLEADO ( \
                          NOMBRE, \
                          FECHA_NACIMIENTO, \
                          FECHA_INGRESO, \
                          DIRECCION, \
                          ID_TIPO_DOCUMENTO, \
                          NUMERO_DOCUMENTO, \
                          CORREO, \
                          CELULAR, \
                          CONTRASENA, \
                          ID_ROL, \
                          ID_TIPO_EMPLEADO) \
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
const ESTADOS = "SELECT * FROM ESTADO_CITA";
const ESTADO = "SELECT * FROM ESTADO_CITA WHERE ID_ESTADO_CITA = ?"
const PRODUCTOS = "SELECT \
                    p.ID_PRODUCTO, \
                    p.NOMBRE_PRODUCTO, \
                    p.CANTIDAD, \
                    p.ID_TIPO_PRODUCTO, \
                    tp.TIPO_PRODUCTO, \
                    p.ID_PROVEEDOR, \
                    pro.NOMBRE AS PROVEEDOR, \
                    td.TIPO_DOCUMENTO, \
                    pro.NUMERO_DOCUMENTO \
                  FROM PRODUCTO p \
                  JOIN TIPO_PRODUCTO tp ON tp.ID_TIPO_PRODUCTO = p.ID_TIPO_PRODUCTO AND TP.ACTIVO = 'S' \
                  JOIN PROVEEDOR pro ON pro.ID_PROVEEDOR = p.ID_PROVEEDOR AND pro.ACTIVO = 'S' \
                  JOIN TIPO_DOCUMENTO td ON td.ID_TIPO_DOCUMENTO = pro.ID_TIPO_DOCUMENTO \
                  WHERE p.ACTIVO = 'S'";
const PRODUCTO = "SELECT \
                  p.ID_PRODUCTO, \
                  p.NOMBRE_PRODUCTO, \
                  p.CANTIDAD, \
                  p.ID_TIPO_PRODUCTO, \
                  tp.TIPO_PRODUCTO, \
                  p.ID_PROVEEDOR, \
                  pro.NOMBRE AS PROVEEDOR, \
                  td.TIPO_DOCUMENTO, \
                  pro.NUMERO_DOCUMENTO \
                FROM PRODUCTO p \
                JOIN TIPO_PRODUCTO tp ON tp.ID_TIPO_PRODUCTO = p.ID_TIPO_PRODUCTO AND TP.ACTIVO = 'S' \
                JOIN PROVEEDOR pro ON pro.ID_PROVEEDOR = p.ID_PROVEEDOR AND pro.ACTIVO = 'S' \
                JOIN TIPO_DOCUMENTO td ON td.ID_TIPO_DOCUMENTO = pro.ID_TIPO_DOCUMENTO \
                WHERE p.ACTIVO = 'S' AND p.ID_PRODUCTO = ?";
const DESPRODUCTO = "UPDATE PRODUCTO SET ACTIVO = N WHERE ID_PRODUCTO = ?";
const PROVEEDORES = "";
const PROVEEDOR = "";
const INSERTPROVEEDOR = "";
const DESPROVEEDOR = "UPDATE PROVEEDOR SET ACTIVO = N WHERE ID_PROVEEDOR = ?";
const ROLES = "";
const SERVICIOS = "";
const SERVICIO = "";
const INSERTSERVICIO = "";
const DESSERVICIO = "UPDATE SERVICIO SET ACTIVO = N WHERE ID_SERVICIO = ?";
const TIPODOCUMENTOS = "";
const TIPODOCUMENTO = "";
const TIPOEMPLEADOS = "";
const TIPOEMPLEADO = "";
const INSERTTIPOEMPLEADO = "";
const DESTIPOEMPLEADOS = "";
const TIPOPRODUCTOS = "";
const TIPOPRODUCTO = "";
const INSERTTIPOPRODUCTO = "";
const DESTIPOPRODUCTO = "";
const USUARIOS = "";
const USUARIO = "";
const INSERTUSUARIO = "";
const DESUSUARIOS = "";

module.exports = {
    AUTHEMP,
    AUTHUSU,
    CITAS,
    CITA,
    INSERTCITA,
    UPDATECITA,
    EMPLEADOS,
    EMPLEADO,
    INSERTEMPLEADO,
    ESTADOS,
    ESTADO,
    PRODUCTOS,
    PRODUCTO,
    DESPRODUCTO,
    PROVEEDORES,
    PROVEEDOR,
    INSERTPROVEEDOR,
    DESPROVEEDOR,
    ROLES,
    SERVICIOS,
    SERVICIO,
    INSERTSERVICIO,
    DESSERVICIO,
    TIPODOCUMENTOS, 
    TIPODOCUMENTO, 
    TIPOEMPLEADOS, 
    TIPOEMPLEADO,
    INSERTTIPOEMPLEADO, 
    DESTIPOEMPLEADOS, 
    TIPOPRODUCTOS,
    TIPOPRODUCTO,
    INSERTTIPOPRODUCTO,
    DESTIPOPRODUCTO, 
    USUARIOS,
    USUARIO,
    INSERTUSUARIO, 
    DESUSUARIOS
  };
  
  