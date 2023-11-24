const queries = {
  documentType: {
    allDocumentType:
      "SELECT Id_TipoDocumento, Tipo_Documento, Activo  FROM TBL_TIPO_DOCUMENTOS ",
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
    valueService:
      "SELECT Valor_Servicio FROM TBL_SERVICIOS ts WHERE Id_Servicio = ?",
    all: "SELECT ts.Id_Servicio, ts.Id_Categoria,tc.Categoria,ts.Nombre_Servicio, ts.Valor_Servicio ,ts.Descripcion_Servicio, \
        ts.Duracion_Servicio, ts.Activo  FROM  TBL_SERVICIOS ts \
      JOIN TBL_CATEGORIAS tc ON tc.Id_Categoria = ts.Id_Categoria AND tc.Activo = 'S'",
    allService:
      "SELECT ts.Id_Servicio, ts.Id_Categoria,tc.Categoria,ts.Nombre_Servicio, ts.Valor_Servicio ,ts.Descripcion_Servicio, \
        ts.Duracion_Servicio,ts.Activo   FROM  TBL_SERVICIOS ts \
      JOIN TBL_CATEGORIAS tc ON tc.Id_Categoria = ts.Id_Categoria AND tc.Activo = 'S'  \
      WHERE ts.Duracion_Servicio <> '00:00:00'",
    service:
      "SELECT ts.Id_Servicio, ts.Id_Categoria,tc.Categoria,ts.Nombre_Servicio, ts.Valor_Servicio ,ts.Descripcion_Servicio, \
        ts.Duracion_Servicio, ts.Activo FROM  TBL_SERVICIOS ts \
      JOIN TBL_CATEGORIAS tc ON tc.Id_Categoria = ts.Id_Categoria AND tc.Activo = 'S' \
      WHERE  ts.Id_Servicio = ?",
    serviceByCategory:
      "SELECT ts.Id_Servicio, ts.Id_Categoria,tc.Categoria,ts.Nombre_Servicio, ts.Valor_Servicio ,ts.Descripcion_Servicio, \
        ts.Duracion_Servicio FROM  TBL_SERVICIOS ts \
      JOIN TBL_CATEGORIAS tc ON tc.Id_Categoria = ts.Id_Categoria AND tc.Activo = 'S' \
      WHERE ts.Activo = 'S' AND tc.Id_Categoria = ?",
    serviceByAppointment:
      "SELECT ts.Id_Servicio, ts.Id_Categoria,tc.Categoria,ts.Nombre_Servicio, ts.Valor_Servicio ,ts.Descripcion_Servicio, \
        ts.Duracion_Servicio  FROM  TBL_SERVICIOS ts \
      JOIN TBL_CATEGORIAS tc ON tc.Id_Categoria = ts.Id_Categoria AND tc.Activo = 'S' \
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
      "INSERT INTO TBL_SERVICIOS_CITAS (Id_Servicio, Id_Cita,Valor_Servicio) VALUES (?, ?, ?)",
    newServiceProvider:
      "INSERT INTO TBL_SERVICIOS_PROVEEDORES (Id_Servicio, Id_Proveedor) VALUES (?, ?)",
    allServiceHistory:
      "SELECT  ths.Id_HistorialServicio, ths.Id_Servicio, ts.Nombre_Servicio, tp.Nombre AS Proveedor, \
        ths.Cantidad, ths.Tipo_Modificacion, ths.Descripcion_Servicio, ths.Fecha_HoraModificacion, \
        ths.Numero_DocumentoColaborador, ths.Id_TipoDocumento, \
        CONCAT(tc.Nombres, tc.Primer_Apellido ) AS Colaborador \
      FROM TBL_HISTORIAL_SERVICIOS ths \
      LEFT JOIN TBL_SERVICIOS ts ON ts.Id_Servicio = ths.Id_Servicio \
        AND ts.Activo ='S' \
      LEFT JOIN TBL_SERVICIOS_PROVEEDORES tsp ON tsp.Id_Servicio  = ts.Id_Servicio \
      LEFT JOIN TBL_PROVEEDORES tp ON tp.Id_Proveedor = tsp.Id_Proveedor \
        AND tp.Activo = 'S' \
      LEFT JOIN TBL_COLABORADORES tc ON tc.Id_TipoDocumento = ths.Id_TipoDocumento \
        AND tc.Numero_DocumentoColaborador = ths.Numero_DocumentoColaborador \
        AND tc.Activo = 'S'",
    serviceHistory:
      "SELECT  ths.Id_HistorialServicio, ths.Id_Servicio, ts.Nombre_Servicio, tp.Nombre AS Proveedor, \
        ths.Cantidad, ths.Tipo_Modificacion, ths.Descripcion_Servicio, ths.Fecha_HoraModificacion, \
        ths.Numero_DocumentoColaborador, ths.Id_TipoDocumento, \
        CONCAT(tc.Nombres, tc.Primer_Apellido ) AS Colaborador \
      FROM TBL_HISTORIAL_SERVICIOS ths \
      LEFT JOIN TBL_SERVICIOS ts ON ts.Id_Servicio = ths.Id_Servicio \
        AND ts.Activo ='S' \
      LEFT JOIN TBL_SERVICIOS_PROVEEDORES tsp ON tsp.Id_Servicio  = ts.Id_Servicio \
      LEFT JOIN TBL_PROVEEDORES tp ON tp.Id_Proveedor = tsp.Id_Proveedor \
        AND tp.Activo = 'S' \
      LEFT JOIN TBL_COLABORADORES tc ON tc.Id_TipoDocumento = ths.Id_TipoDocumento \
        AND tc.Numero_DocumentoColaborador = ths.Numero_DocumentoColaborador \
        AND tc.Activo = 'S' \
      WHERE ths.Id_HistorialServicio = ?",
    serviceHistoryByCollaborator:
      "SELECT  ths.Id_HistorialServicio, ths.Id_Servicio, ts.Nombre_Servicio, tp.Nombre AS Proveedor, \
        ths.Cantidad, ths.Tipo_Modificacion, ths.Descripcion_Servicio, ths.Fecha_HoraModificacion, \
        ths.Numero_DocumentoColaborador, ths.Id_TipoDocumento, \
        CONCAT(tc.Nombres, tc.Primer_Apellido ) AS Colaborador \
      FROM TBL_HISTORIAL_SERVICIOS ths \
      LEFT JOIN TBL_SERVICIOS ts ON ts.Id_Servicio = ths.Id_Servicio \
        AND ts.Activo ='S' \
      LEFT JOIN TBL_SERVICIOS_PROVEEDORES tsp ON tsp.Id_Servicio  = ts.Id_Servicio \
      LEFT JOIN TBL_PROVEEDORES tp ON tp.Id_Proveedor = tsp.Id_Proveedor \
        AND tp.Activo = 'S' \
      LEFT JOIN TBL_COLABORADORES tc ON tc.Id_TipoDocumento = ths.Id_TipoDocumento \
        AND tc.Numero_DocumentoColaborador = ths.Numero_DocumentoColaborador \
        AND tc.Activo = 'S' \
      WHERE ths.Numero_DocumentoColaborador = ? AND ths.Id_TipoDocumento = ? ",
    serviceHistoryByProvider:
      "SELECT  ths.Id_HistorialServicio, ths.Id_Servicio, ts.Nombre_Servicio, tp.Nombre AS Proveedor, \
        ths.Cantidad, ths.Tipo_Modificacion, ths.Descripcion_Servicio, ths.Fecha_HoraModificacion, \
        ths.Numero_DocumentoColaborador, ths.Id_TipoDocumento, \
        CONCAT(tc.Nombres, tc.Primer_Apellido ) AS Colaborador \
      FROM TBL_HISTORIAL_SERVICIOS ths \
      LEFT JOIN TBL_SERVICIOS ts ON ts.Id_Servicio = ths.Id_Servicio \
        AND ts.Activo ='S' \
      LEFT JOIN TBL_SERVICIOS_PROVEEDORES tsp ON tsp.Id_Servicio  = ts.Id_Servicio \
      LEFT JOIN TBL_PROVEEDORES tp ON tp.Id_Proveedor = tsp.Id_Proveedor \
        AND tp.Activo = 'S' \
      LEFT JOIN TBL_COLABORADORES tc ON tc.Id_TipoDocumento = ths.Id_TipoDocumento \
        AND tc.Numero_DocumentoColaborador = ths.Numero_DocumentoColaborador \
        AND tc.Activo = 'S' \
      WHERE tp.Id_Proveedor = ? ",
    serviceHistoryByService:
      "SELECT  ths.Id_HistorialServicio, ths.Id_Servicio, ts.Nombre_Servicio, tp.Nombre AS Proveedor, \
        ths.Cantidad, ths.Tipo_Modificacion, ths.Descripcion_Servicio, ths.Fecha_HoraModificacion, \
        ths.Numero_DocumentoColaborador, ths.Id_TipoDocumento, \
        CONCAT(tc.Nombres, tc.Primer_Apellido ) AS Colaborador \
      FROM TBL_HISTORIAL_SERVICIOS ths \
      LEFT JOIN TBL_SERVICIOS ts ON ts.Id_Servicio = ths.Id_Servicio \
        AND ts.Activo ='S' \
      LEFT JOIN TBL_SERVICIOS_PROVEEDORES tsp ON tsp.Id_Servicio  = ts.Id_Servicio \
      LEFT JOIN TBL_PROVEEDORES tp ON tp.Id_Proveedor = tsp.Id_Proveedor \
        AND tp.Activo = 'S' \
      LEFT JOIN TBL_COLABORADORES tc ON tc.Id_TipoDocumento = ths.Id_TipoDocumento \
        AND tc.Numero_DocumentoColaborador = ths.Numero_DocumentoColaborador \
        AND tc.Activo = 'S' \
      WHERE ths.Id_Servicio = ? ",
    newServiceHistory:
      "INSERT INTO TBL_HISTORIAL_SERVICIOS \
        (Id_Servicio, Cantidad, Tipo_Modificacion, Descripcion_Servicio, Numero_DocumentoColaborador, \
          Id_TipoDocumento) \
      VALUES (?, ?, ?, ?, ?, ?)",
    accountService:
      "SELECT ths.Id_Servicio, ts.Nombre_Servicio, \
        SUM(CASE WHEN Tipo_Modificacion = 'E' THEN Cantidad ELSE 0 END) - \
        SUM(CASE WHEN Tipo_Modificacion = 'S' THEN Cantidad ELSE 0 END) AS CantidadTotal \
      FROM TBL_HISTORIAL_SERVICIOS ths \
      LEFT JOIN TBL_SERVICIOS ts ON ts.Id_Servicio = ths.Id_Servicio \
      WHERE ths.Id_Servicio = ? \
      GROUP BY ths.Id_Servicio",
    accountServiceHistory:
      "SELECT ths.Id_Servicio, ts.Nombre_Servicio, \
        SUM(CASE WHEN Tipo_Modificacion = 'E' THEN Cantidad ELSE 0 END) AS Entradas, \
        SUM(CASE WHEN Tipo_Modificacion = 'S' THEN Cantidad ELSE 0 END) AS Salidas, \
        SUM(CASE WHEN Tipo_Modificacion = 'E' THEN Cantidad ELSE 0 END) - \
        SUM(CASE WHEN Tipo_Modificacion = 'S' THEN Cantidad ELSE 0 END) AS CantidadTotal \
      FROM TBL_HISTORIAL_SERVICIOS ths \
      LEFT JOIN TBL_SERVICIOS ts ON ts.Id_Servicio = ths.Id_Servicio \
      WHERE ths.Id_Servicio = ? \
      GROUP BY ths.Id_Servicio",
    accountAllServiceHistory:
      "SELECT ths.Id_Servicio, ts.Nombre_Servicio, \
        SUM(CASE WHEN Tipo_Modificacion = 'E' THEN Cantidad ELSE 0 END) AS Entradas, \
        SUM(CASE WHEN Tipo_Modificacion = 'S' THEN Cantidad ELSE 0 END) AS Salidas, \
        SUM(CASE WHEN Tipo_Modificacion = 'E' THEN Cantidad ELSE 0 END) - \
        SUM(CASE WHEN Tipo_Modificacion = 'S' THEN Cantidad ELSE 0 END) AS CantidadTotal \
      FROM TBL_HISTORIAL_SERVICIOS ths \
      LEFT JOIN TBL_SERVICIOS ts ON ts.Id_Servicio = ths.Id_Servicio \
      GROUP BY ths.Id_Servicio",
    allProduct:
      "SELECT \
        ts.Id_Servicio, \
        ts.Id_Categoria, \
        tc.Categoria, \
        ts.Nombre_Servicio, \
        ts.Valor_Servicio, \
        ts.Descripcion_Servicio, \
        ts.Duracion_Servicio, \
        tp.Id_Proveedor, \
        tp.Nombre AS nombre_Proveedor, \
        ts.Activo, \
        COALESCE(total_servicio.CantidadTotal, 0) AS CantidadTotal \
      FROM \
          TBL_SERVICIOS ts \
      JOIN TBL_CATEGORIAS tc ON tc.Id_Categoria = ts.Id_Categoria AND tc.Activo = 'S' \
      LEFT JOIN TBL_SERVICIOS_PROVEEDORES tsp ON tsp.Id_Servicio = ts.Id_Servicio \
      LEFT JOIN TBL_PROVEEDORES tp ON tp.Id_Proveedor = tsp.Id_Proveedor AND tp.Activo = 'S' \
      LEFT JOIN ( \
          SELECT \
              ths.Id_Servicio, \
              SUM(CASE WHEN Tipo_Modificacion = 'E' THEN Cantidad ELSE 0 END) - \
              SUM(CASE WHEN Tipo_Modificacion = 'S' THEN Cantidad ELSE 0 END) AS CantidadTotal \
          FROM \
              TBL_HISTORIAL_SERVICIOS ths \
          GROUP BY \
              ths.Id_Servicio \
      ) total_servicio ON total_servicio.Id_Servicio = ts.Id_Servicio \
      WHERE \
          ts.Duracion_Servicio = '00:00:00'",
    product:
      "SELECT \
      ts.Id_Servicio, \
      ts.Id_Categoria, \
      tc.Categoria, \
      ts.Nombre_Servicio, \
      ts.Valor_Servicio, \
      ts.Descripcion_Servicio, \
      ts.Duracion_Servicio, \
      tp.Id_Proveedor, \
      tp.Nombre AS nombre_Proveedor, \
      ts.Activo, \
      COALESCE(total_servicio.CantidadTotal, 0) AS CantidadTotal \
    FROM \
        TBL_SERVICIOS ts \
    JOIN TBL_CATEGORIAS tc ON tc.Id_Categoria = ts.Id_Categoria AND tc.Activo = 'S' \
    LEFT JOIN TBL_SERVICIOS_PROVEEDORES tsp ON tsp.Id_Servicio = ts.Id_Servicio \
    LEFT JOIN TBL_PROVEEDORES tp ON tp.Id_Proveedor = tsp.Id_Proveedor AND tp.Activo = 'S' \
    LEFT JOIN ( \
        SELECT \
            ths.Id_Servicio, \
            SUM(CASE WHEN Tipo_Modificacion = 'E' THEN Cantidad ELSE 0 END) - \
            SUM(CASE WHEN Tipo_Modificacion = 'S' THEN Cantidad ELSE 0 END) AS CantidadTotal \
        FROM \
            TBL_HISTORIAL_SERVICIOS ths \
        GROUP BY \
            ths.Id_Servicio \
    ) total_servicio ON total_servicio.Id_Servicio = ts.Id_Servicio \
          WHERE  ts.Duracion_Servicio = '00:00:00' AND ts.Id_Servicio = ?",
    productByProvider:
      "SELECT ts.Id_Servicio, ts.Id_Categoria,tc.Categoria,ts.Nombre_Servicio, ts.Valor_Servicio ,ts.Descripcion_Servicio, \
        ts.Duracion_Servicio, tp.Nombre AS nombre_Proveedor  FROM  TBL_SERVICIOS ts \
      JOIN TBL_CATEGORIAS tc ON tc.Id_Categoria = ts.Id_Categoria AND tc.Activo = 'S' \
      LEFT JOIN TBL_SERVICIOS_PROVEEDORES tsp ON tsp.Id_Servicio = ts.Id_Servicio \
      LEFT JOIN TBL_PROVEEDORES tp ON tp.Id_Proveedor  = tsp.Id_Proveedor AND tp.Activo = 'S' \
      WHERE ts.Activo = 'S' AND ts.Duracion_Servicio = '00:00:00' AND tp.Id_Proveedor = ?",
  },
  provider: {
    allProvider:
      "SELECT Id_Proveedor, Nombre, Numero_Contacto,	Direccion, Activo \
       FROM TBL_PROVEEDORES",
    provider:
      "SELECT Id_Proveedor, Nombre, Numero_Contacto,	Direccion \
      FROM TBL_PROVEEDORES WHERE Activo = 'S' AND Id_Proveedor = ?",
    newProvider:
      "INSERT INTO TBL_PROVEEDORES \
        (Nombre, Numero_Contacto, Direccion) \
      VALUES (?, ?, ?)",
    deactivate:
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
    deactivate:
      "UPDATE TBL_COLABORADORES \
      SET Activo = CASE \
        WHEN Activo = 'N' THEN 'S' \
        WHEN Activo = 'S' THEN 'N' \
      END \
      WHERE Numero_DocumentoColaborador = ? AND Id_TipoDocumento = ?",
    updateCollaborator:
      "UPDATE TBL_COLABORADORES \
      SET  \
        Nombres = ?, \
        Primer_Apellido = ?, \
        Segundo_Apellido = ?, \
        Numero_Contacto = ?, \
        Id_Cargo = ? \
      WHERE Numero_DocumentoColaborador = ? AND Id_TipoDocumento = ?",
    all: "SELECT Nombres, Primer_Apellido,	Segundo_Apellido,	tc.Id_TipoDocumento, ttd.Tipo_Documento, \
        Numero_DocumentoColaborador, Numero_Contacto,	Correo_Electronico,	Fecha_Ingreso,	Fecha_Nacimiento,	\
        tc.Id_Cargo,  tc2.Cargo, tc.Activo \
      FROM TBL_COLABORADORES tc \
      LEFT JOIN TBL_TIPO_DOCUMENTOS ttd ON ttd.Id_TipoDocumento = tc.Id_TipoDocumento AND ttd.Activo = 'S' \
      LEFT JOIN TBL_CARGOS tc2 ON tc2.Id_Cargo = tc.Id_Cargo AND tc2.Activo = 'S' \
      WHERE tc.Numero_DocumentoColaborador <> '123456789'",
    allActivate:
      "SELECT Nombres, Primer_Apellido,	Segundo_Apellido,	tc.Id_TipoDocumento, ttd.Tipo_Documento, \
        Numero_DocumentoColaborador, Numero_Contacto,	Correo_Electronico,	Fecha_Ingreso,	Fecha_Nacimiento,	\
        tc.Id_Cargo,  tc2.Cargo, tc.Activo \
      FROM TBL_COLABORADORES tc \
      LEFT JOIN TBL_TIPO_DOCUMENTOS ttd ON ttd.Id_TipoDocumento = tc.Id_TipoDocumento AND ttd.Activo = 'S' \
      LEFT JOIN TBL_CARGOS tc2 ON tc2.Id_Cargo = tc.Id_Cargo AND tc2.Activo = 'S' \
      WHERE tc.Numero_DocumentoColaborador <> '123456789' AND tc.Activo = 'S'",
    collaborator:
      "SELECT Nombres, Primer_Apellido,	Segundo_Apellido,	tc.Id_TipoDocumento, ttd.Tipo_Documento, \
        Numero_DocumentoColaborador, Numero_Contacto,	Correo_Electronico,	Fecha_Ingreso,	Fecha_Nacimiento,	\
        tc.Id_Cargo,  tc2.Cargo \
      FROM TBL_COLABORADORES tc \
      LEFT JOIN TBL_TIPO_DOCUMENTOS ttd ON ttd.Id_TipoDocumento = tc.Id_TipoDocumento AND ttd.Activo = 'S' \
      LEFT JOIN TBL_CARGOS tc2 ON tc2.Id_Cargo = tc.Id_Cargo AND tc2.Activo = 'S' \
      WHERE tc.Numero_DocumentoColaborador = ? AND tc.Id_TipoDocumento = ? AND tc.Activo = 'S'",
    collaboratorByEmail:
      "SELECT tc.Id_TipoDocumento,  Numero_DocumentoColaborador \
      FROM TBL_COLABORADORES tc \
      WHERE Correo_Electronico = ? AND tc.Activo = 'S'",
    newCollaboratorCategory:
      "INSERT INTO TBL_CATEGORIAS_COLABORADORES (Id_Categoria, Numero_DocumentoColaborador, Id_TipoDocumento) VALUES (?, ?, ?)",
  },
  module: {
    all: "SELECT Id_Modulo, Nombre_Modulo, Activo  from TBL_MODULOS",
    module:
      "SELECT Id_Modulo, Nombre_Modulo FROM TBL_MODULOS WHERE Activo = 'S' AND Id_Modulo = ?",
    moduleByCollaborator:
      "SELECT tm.Id_Modulo, tm.Nombre_Modulo  FROM TBL_MODULOS tm \
      LEFT JOIN TBL_MODULOS_PERMISOS tmp ON tmp.Id_Modulo = tm.Id_Modulo \
      LEFT JOIN TBL_COLABORADORES tc ON tc.Numero_DocumentoColaborador = tmp.Numero_DocumentoColaborador \
        AND tc.Id_TipoDocumento = tmp.Id_TipoDocumento \
      WHERE tm.Activo = 'S' AND tc.Numero_DocumentoColaborador = ? AND tc.Id_TipoDocumento = ?",
    deactivate:
      "UPDATE TBL_MODULOS \
      SET Activo = CASE \
        WHEN Activo = 'N' THEN 'S' \
        WHEN Activo = 'S' THEN 'N' \
      END \
      WHERE Id_Modulo = ?",
    updateModule:
      "UPDATE TBL_MODULOS SET Nombre_Modulo = ? WHERE Id_Modulo = ?",
    newModule: "INSERT INTO TBL_MODULES (Nombre_Modulo) VALUES (?)",
    newPermissionModule:
      "INSERT INTO TBL_MODULOS_PERMISOS \
      (Id_Modulo, Numero_DocumentoColaborador, Id_TipoDocumento, Id_Permiso) \
      VALUES (?, ?, ?, ?)",
    allPermissionModuleByCollaborator:
      "SELECT 	COALESCE(GROUP_CONCAT(CONCAT(tm.Nombre_Modulo, '_', tp.valor_permiso) SEPARATOR ', '), 'NULL') AS permissions \
      FROM TBL_MODULOS tm \
      LEFT JOIN TBL_MODULOS_PERMISOS tmp ON tmp.Id_Modulo = tm.Id_Modulo \
      LEFT JOIN TBL_PERMISOS tp ON tp.Id_Permiso = tmp.Id_Permiso \
      WHERE tmp.Numero_DocumentoColaborador = ? AND tmp.Id_TipoDocumento = ?",
    permissionModuleByCollaborator:
      "SELECT 	COALESCE(GROUP_CONCAT(CONCAT(tm.Nombre_Modulo, '_', tp.valor_permiso) SEPARATOR ', '), 'NULL') AS permissions \
      FROM TBL_MODULOS tm \
      LEFT JOIN TBL_MODULOS_PERMISOS tmp ON tmp.Id_Modulo = tm.Id_Modulo \
      LEFT JOIN TBL_PERMISOS tp ON tp.Id_Permiso = tmp.Id_Permiso \
      WHERE tmp.Numero_DocumentoColaborador = ? AND tmp.Id_TipoDocumento = ? AND tmp.Id_Modulo = ?",
    updatePermissionModule:
      "UPDATE TBL_MODULOS_PERMISOS SET Id_Permiso = ? WHERE Id_Modulo = ? \
      AND Numero_DocumentoColaborador = ? AND Id_TipoDocumento = ?",
    permissionModule:
      "SELECT tc.Nombres, \
      COALESCE(CONCAT(Primer_Apellido, ' ', Segundo_Apellido), Primer_Apellido) AS Apellidos, \
        tc.Id_TipoDocumento, \
        tc.Numero_DocumentoColaborador, \
        COALESCE(GROUP_CONCAT(CONCAT(tm.Nombre_Modulo, '_', tp.valor_permiso) SEPARATOR ', '), 'NULL') AS permissions, \
        COALESCE(GROUP_CONCAT(CONCAT(tm.Id_Modulo , '_', tp.Id_Permiso) SEPARATOR ', '), 'NULL') AS ids_permissions \
      FROM \
      TBL_MODULOS tm \
      LEFT JOIN TBL_MODULOS_PERMISOS tmp ON tmp.Id_Modulo = tm.Id_Modulo \
      LEFT JOIN TBL_PERMISOS tp ON tp.Id_Permiso = tmp.Id_Permiso \
      LEFT JOIN TBL_COLABORADORES tc ON tc.Id_TipoDocumento = tmp.Id_TipoDocumento \
        AND tc.Numero_DocumentoColaborador = tmp.Numero_DocumentoColaborador \
      GROUP BY \
        tc.Id_TipoDocumento, \
        tc.Numero_DocumentoColaborador",
    allPermission: "SELECT * FROM TBL_PERMISOS tp",
  },
  client: {
    all: "SELECT Nombres,	Primer_Apellido,	Segundo_Apellido,	tc.Id_TipoDocumento,	ttd.Tipo_Documento, \
        Numero_DocumentoCliente,	Numero_Contacto,	Correo_Electronico,	Fecha_Nacimiento, tc.Activo \
      FROM TBL_CLIENTES tc \
      LEFT JOIN TBL_TIPO_DOCUMENTOS ttd ON ttd.Id_TipoDocumento = tc.Id_TipoDocumento AND ttd.Activo = 'S'",
    client:
      "SELECT Nombres,	Primer_Apellido,	Segundo_Apellido,	tc.Id_TipoDocumento,	ttd.Tipo_Documento, \
        Numero_DocumentoCliente,	Numero_Contacto,	Correo_Electronico,	Fecha_Nacimiento \
      FROM TBL_CLIENTES tc \
      LEFT JOIN TBL_TIPO_DOCUMENTOS ttd ON ttd.Id_TipoDocumento = tc.Id_TipoDocumento AND ttd.Activo = 'S' \
      WHERE Numero_DocumentoCliente = ? AND tc.Id_TipoDocumento = ?",
    clientByEmail:
      "SELECT Nombres,	Primer_Apellido,	Segundo_Apellido,	tc.Id_TipoDocumento,	ttd.Tipo_Documento, \
        Numero_DocumentoCliente,	Numero_Contacto,	Correo_Electronico,	Fecha_Nacimiento \
      FROM TBL_CLIENTES tc \
      LEFT JOIN TBL_TIPO_DOCUMENTOS ttd ON ttd.Id_TipoDocumento = tc.Id_TipoDocumento AND ttd.Activo = 'S' \
      WHERE Correo_Electronico = ?",
    clientAuthentication:
      "SELECT * FROM TBL_CLIENTES tc WHERE tc.Correo_Electronico = ? AND tc.Contrasennia = ? AND ACTIVO ='S'",
    recoverPassword:
      "SELECT * FROM TBL_CLIENTES tc WHERE tc.Correo_Electronico = ?",
    updatePassword:
      "UPDATE TBL_CLIENTES SET Contrasennia = ? WHERE Correo_Electronico = ?",
    newClient:
      "INSERT INTO TBL_CLIENTES \
        (Nombres, Primer_Apellido, Segundo_Apellido, Id_TipoDocumento, Numero_DocumentoCliente, \
        Numero_Contacto, Correo_Electronico, Contrasennia, Fecha_Nacimiento) \
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    updateClient:
      "UPDATE TBL_CLIENTES \
      SET  \
        Nombres = ?, \
        Primer_Apellido = ?, \
        Segundo_Apellido = ?, \
        Numero_Contacto = ? \
      WHERE Numero_DocumentoColaborador = ? AND Id_TipoDocumento = ?",
    otp: "SELECT COUNT(*)  FROM  TBL_CLIENTE_CODIGO tcc WHERE Numero_DocumentoCliente = ? \
      AND Id_TipoDocumento = ?	AND Codigo = ?",
    deactivate:
      "UPDATE TBL_CLIENTES \
      SET Activo = CASE \
        WHEN Activo = 'N' THEN 'S' \
        WHEN Activo = 'S' THEN 'N' \
      END \
      WHERE Id_TipoDocumento = ? AND Numero_DocumentoCliente = ?",
  },
  appointment: {
    allAppointment:
      "SELECT c.Id_Cita, c.Numero_DocumentoCliente, c.Id_TipoDocumentoCliente, tc.Nombres AS Nombre_Cliente, \
        tc.Primer_Apellido AS Primer_ApellidoCliente, tc.Segundo_Apellido AS Segundo_ApeliidoCliente, \
        tc.Numero_Contacto, c.Fecha_Cita, c.Fecha_Final, c.Id_EstadoCita, tec.Estado_Cita, c.Numero_DocumentoColaborador, \
        c.Id_TipoDocumentoColaborador, tc2.Nombres AS Nombre_Colaborador, \
        tc2.Primer_Apellido AS Primer_ApellidoColaborador, tc2.Segundo_Apellido AS Segundo_ApellidoColaborador, c.Valor_Cita \
      FROM TBL_CITAS c \
      LEFT JOIN TBL_CLIENTES tc ON tc.Id_TipoDocumento = c.Id_TipoDocumentoCliente \
        AND tc.Numero_DocumentoCliente = c.Numero_DocumentoCliente \
      LEFT JOIN TBL_COLABORADORES tc2 ON tc2.Id_TipoDocumento = c.Id_TipoDocumentoCliente \
        AND tc2.Numero_DocumentoColaborador  = c.Numero_DocumentoColaborador \
      LEFT JOIN TBL_ESTADO_CITAS tec ON tec.Id_EstadoCita = c.Id_EstadoCita AND tec.Activo = 'S' \
    WHERE c.Id_EstadoCita <> 2",
    appointment:
      "SELECT c.Id_Cita, c.Numero_DocumentoCliente, c.Id_TipoDocumentoCliente, tc.Nombres AS Nombre_Cliente, \
        tc.Primer_Apellido AS Primer_ApellidoCliente, tc.Segundo_Apellido AS Segundo_ApeliidoCliente, \
        tc.Numero_Contacto,c.Fecha_Cita, c.Fecha_Final, c.Id_EstadoCita, tec.Estado_Cita, c.Numero_DocumentoColaborador, \
        c.Id_TipoDocumentoColaborador, tc2.Nombres AS Nombre_Colaborador, \
        tc2.Primer_Apellido AS Primer_ApellidoColaborador, tc2.Segundo_Apellido AS Segundo_ApellidoColaborador, c.Valor_Cita \
      FROM TBL_CITAS c \
      LEFT JOIN TBL_CLIENTES tc ON tc.Id_TipoDocumento = c.Id_TipoDocumentoCliente \
        AND tc.Numero_DocumentoCliente = c.Numero_DocumentoCliente \
      LEFT JOIN TBL_COLABORADORES tc2 ON tc2.Id_TipoDocumento = c.Id_TipoDocumentoCliente \
        AND tc2.Numero_DocumentoColaborador  = c.Numero_DocumentoColaborador \
      LEFT JOIN TBL_ESTADO_CITAS tec ON tec.Id_EstadoCita = c.Id_EstadoCita AND tec.Activo = 'S' \
      WHERE c.Id_Cita = ?",
    appointmentByCliente:
      "SELECT c.Id_Cita, c.Numero_DocumentoCliente, c.Id_TipoDocumentoCliente, tc.Nombres AS Nombre_Cliente, \
        tc.Primer_Apellido AS Primer_ApellidoCliente, tc.Segundo_Apellido AS Segundo_ApeliidoCliente, \
        tc.Numero_Contacto,,c.Fecha_Cita, c.Fecha_Final, c.Id_EstadoCita, tec.Estado_Cita, c.Numero_DocumentoColaborador, \
        c.Id_TipoDocumentoColaborador, tc2.Nombres AS Nombre_Colaborador, \
        tc2.Primer_Apellido AS Primer_ApellidoColaborador, tc2.Segundo_Apellido AS Segundo_ApellidoColaborador, c.Valor_Cita \
      FROM TBL_CITAS c \
      LEFT JOIN TBL_CLIENTES tc ON tc.Id_TipoDocumento = c.Id_TipoDocumentoCliente \
        AND tc.Numero_DocumentoCliente = c.Numero_DocumentoCliente \
      LEFT JOIN TBL_COLABORADORES tc2 ON tc2.Id_TipoDocumento = c.Id_TipoDocumentoCliente \
        AND tc2.Numero_DocumentoColaborador  = c.Numero_DocumentoColaborador \
      LEFT JOIN TBL_ESTADO_CITAS tec ON tec.Id_EstadoCita = c.Id_EstadoCita AND tec.Activo = 'S' \
      WHERE c.Numero_DocumentoCliente = ? AND c.Id_TipoDocumentoCliente = ?",
    appointmentByClientCorreo:
      "SELECT c.Id_Cita, c.Numero_DocumentoCliente, c.Id_TipoDocumentoCliente, tc.Nombres AS Nombre_Cliente,\
      tc.Primer_Apellido AS Primer_ApellidoCliente, tc.Segundo_Apellido AS Segundo_ApeliidoCliente,    \
      tc.Numero_Contacto,c.Fecha_Cita, c.Fecha_Final, c.Id_EstadoCita, tec.Estado_Cita, \
      c.Numero_DocumentoColaborador, c.Id_TipoDocumentoColaborador, tc2.Nombres AS Nombre_Colaborador,  \
      tc2.Primer_Apellido AS Primer_ApellidoColaborador, tc2.Segundo_Apellido AS Segundo_ApellidoColaborador,\
      c.Valor_Cita FROM TBL_CITAS c LEFT JOIN TBL_CLIENTES tc ON tc.Id_TipoDocumento = c.Id_TipoDocumentoCliente \
      AND tc.Numero_DocumentoCliente = c.Numero_DocumentoCliente  \
      LEFT JOIN TBL_COLABORADORES tc2 ON tc2.Id_TipoDocumento = c.Id_TipoDocumentoCliente AND \
      tc2.Numero_DocumentoColaborador  = c.Numero_DocumentoColaborador LEFT JOIN TBL_ESTADO_CITAS tec ON \
      tec.Id_EstadoCita = c.Id_EstadoCita AND tec.Activo = 'S'   \
      WHERE tc.Correo_Electronico = ? AND c.Id_EstadoCita <> 2",
    appointmentByColaborador:
      "SELECT c.Id_Cita, c.Numero_DocumentoCliente, c.Id_TipoDocumentoCliente, tc.Nombres AS Nombre_Cliente, \
        tc.Primer_Apellido AS Primer_ApellidoCliente, tc.Segundo_Apellido AS Segundo_ApeliidoCliente, \
        tc.Numero_Contacto,c.Fecha_Cita, c.Fecha_Final, c.Id_EstadoCita, tec.Estado_Cita, c.Numero_DocumentoColaborador, \
        c.Id_TipoDocumentoColaborador, tc2.Nombres AS Nombre_Colaborador, \
        tc2.Primer_Apellido AS Primer_ApellidoColaborador, tc2.Segundo_Apellido AS Segundo_ApellidoColaborador, c.Valor_Cita \
      FROM TBL_CITAS c \
      LEFT JOIN TBL_CLIENTES tc ON tc.Id_TipoDocumento = c.Id_TipoDocumentoCliente \
        AND tc.Numero_DocumentoCliente = c.Numero_DocumentoCliente \
      LEFT JOIN TBL_COLABORADORES tc2 ON tc2.Id_TipoDocumento = c.Id_TipoDocumentoCliente \
        AND tc2.Numero_DocumentoColaborador  = c.Numero_DocumentoColaborador \
      LEFT JOIN TBL_ESTADO_CITAS tec ON tec.Id_EstadoCita = c.Id_EstadoCita AND tec.Activo = 'S' \
      WHERE c.Numero_DocumentoColaborador = ? AND c.Id_TipoDocumentoColaborador = ?",
    newAppointment:
      "INSERT INTO TBL_CITAS (Numero_DocumentoCliente, Numero_DocumentoColaborador, \
        Fecha_Cita, Fecha_Final,Id_EstadoCita,Id_TipoDocumentoCliente, Id_TipoDocumentoColaborador, Valor_Cita) \
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    updateAppointment:
      "UPDATE TBL_CITAS \
      SET \
        Numero_DocumentoColaborador = ?, \
        Id_TipoDocumentoColaborador = ? \
      WHERE Id_Cita = ?",
    change:
      "UPDATE TBL_CITAS \
      SET \
        Id_EstadoCita = ?, \
        Valor_Cita = ? \
      WHERE Id_Cita = ?",
    duration:
      "SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(Duracion_Servicio))) AS DURACION FROM TBL_SERVICIOS WHERE Id_Servicio = ?",
    availability:
      "SELECT COUNT(*) AS AVAILABILITY FROM TBL_CITAS tc \
      WHERE tc.Numero_DocumentoColaborador = ? \
        AND ((tc.Fecha_Cita  BETWEEN ? AND ?) \
        OR (tc.Fecha_Final  BETWEEN ? AND ?)) \
        AND tc.Id_TipoDocumentoColaborador = ? AND tc.Id_Cita <> 2",
  },
  categoy: {
    allCategorys: "SELECT * FROM TBL_CATEGORIAS",
    category:
      "SELECT * FROM TBL_CATEGORIAS WHERE Activo = 'S' AND Id_Categoria = ?",
    deactivate:
      "UPDATE TBL_CATEGORIAS \
      SET Activo = CASE \
        WHEN Activo = 'N' THEN 'S' \
        WHEN Activo = 'S' THEN 'N' \
      END \
      WHERE Id_Categoria = ?",
    update:
      "UPDATE TBL_CATEGORIAS \
      SET Categoria = ? \
      WHERE Id_Categoria = ?",
    newCategory: "INSERT INTO TBL_CATEGORIAS (Categoria) VALUES (?)",
    newCategoryCollaborator:
      "INSERT INTO TBL_CATEGORIAS_COLABORADORES (Id_Categoria,	Numero_DocumentoColaborador,	Id_TipoDocumento) \
      VALUES(?,?,?)",
  },
  position: {
    all: "SELECT * FROM TBL_CARGOS",
    position: "SELECT * FROM TBL_CARGOS WHERE Activo = 'S' AND Id_Cargo = ?",
    newPosition: "INSERT INTO TBL_CARGOS (Cargo) VALUES (?)",
    deactivate:
      "UPDATE TBL_CARGOS \
      SET Activo = CASE \
        WHEN Activo = 'N' THEN 'S' \
        WHEN Activo = 'S' THEN 'N' \
      END \
      WHERE Id_Cargo = ?",
    update:
      "UPDATE TBL_CARGOS \
      SET Cargo = ? \
      WHERE Id_Cargo = ?",
  },
  otp: {
    newOtp:
      "INSERT TBL_CLIENTE_CODIGO (Numero_DocumentoCliente,	Id_TipoDocumento,	Codigo) VALUES (?, ?, ?)",
  },
  state: {
    all: "SELECT * FROM TBL_ESTADO_CITAS tec",
    state: "SELECT * FROM TBL_ESTADO_CITAS tec WHERE Id_EstadoCita = ?",
  },
  report: {
    appointmentByState:
      "SELECT \
        ROW_NUMBER() OVER ( \
          ORDER BY \
        c.Numero_DocumentoCliente) AS ID, \
        c.Numero_DocumentoCliente, \
        ttd.Tipo_Documento AS Tipo_DocumentoCliente, \
        tc.Nombres AS Nombre_Cliente, \
        tc.Primer_Apellido AS Primer_ApellidoCliente, \
        tc.Segundo_Apellido AS Segundo_ApeliidoCliente, \
        tc.Numero_Contacto, \
        c.Fecha_Cita, \
        c.Fecha_Final, \
        tec.Estado_Cita, \
        c.Numero_DocumentoColaborador, \
        ttd2.Tipo_Documento AS Tipo_DocumentoColaborado, \
        tc2.Nombres AS Nombre_Colaborador, \
        tc2.Primer_Apellido AS Primer_ApellidoColaborador, \
        tc2.Segundo_Apellido AS Segundo_ApellidoColaborador, \
        GROUP_CONCAT(ts.Nombre_Servicio SEPARATOR ', ') AS servicios \
      FROM \
        TBL_CITAS c \
      LEFT JOIN TBL_CLIENTES tc ON \
        tc.Id_TipoDocumento = c.Id_TipoDocumentoCliente \
        AND tc.Numero_DocumentoCliente = c.Numero_DocumentoCliente \
      LEFT JOIN TBL_COLABORADORES tc2 ON \
        tc2.Id_TipoDocumento = c.Id_TipoDocumentoColaborador \
        AND tc2.Numero_DocumentoColaborador = c.Numero_DocumentoColaborador \
      LEFT JOIN TBL_ESTADO_CITAS tec ON \
        tec.Id_EstadoCita = c.Id_EstadoCita \
        AND tec.Activo = 'S' \
      LEFT JOIN TBL_TIPO_DOCUMENTOS ttd ON \
        ttd.Id_TipoDocumento = tc.Id_TipoDocumento \
      LEFT JOIN TBL_TIPO_DOCUMENTOS ttd2 ON \
        ttd2.Id_TipoDocumento = tc2.Id_TipoDocumento \
      LEFT JOIN TBL_SERVICIOS_CITAS tsc ON \
        tsc.Id_Cita = c.Id_Cita \
      LEFT JOIN TBL_SERVICIOS ts ON \
        ts.Id_Servicio = tsc.Id_Servicio \
      WHERE \
        c.Id_EstadoCita = ? \
        AND ((c.Fecha_Cita BETWEEN ? AND ?) \
          OR (c.Fecha_Final BETWEEN ? AND ?)) \
      ORDER BY \
        c.Numero_DocumentoCliente",
    appointmentByState:
      "SELECT \
        ROW_NUMBER() OVER ( \
          ORDER BY \
        c.Numero_DocumentoCliente) AS ID, \
        c.Numero_DocumentoCliente, \
        ttd.Tipo_Documento AS Tipo_DocumentoCliente, \
        tc.Nombres AS Nombre_Cliente, \
        tc.Primer_Apellido AS Primer_ApellidoCliente, \
        tc.Segundo_Apellido AS Segundo_ApeliidoCliente, \
        tc.Numero_Contacto, \
        c.Fecha_Cita, \
        c.Fecha_Final, \
        tec.Estado_Cita, \
        c.Numero_DocumentoColaborador, \
        ttd2.Tipo_Documento AS Tipo_DocumentoColaborado, \
        tc2.Nombres AS Nombre_Colaborador, \
        tc2.Primer_Apellido AS Primer_ApellidoColaborador, \
        tc2.Segundo_Apellido AS Segundo_ApellidoColaborador, \
        GROUP_CONCAT(ts.Nombre_Servicio SEPARATOR ', ') AS servicios \
      FROM \
        TBL_CITAS c \
      LEFT JOIN TBL_CLIENTES tc ON \
        tc.Id_TipoDocumento = c.Id_TipoDocumentoCliente \
        AND tc.Numero_DocumentoCliente = c.Numero_DocumentoCliente \
      LEFT JOIN TBL_COLABORADORES tc2 ON \
        tc2.Id_TipoDocumento = c.Id_TipoDocumentoColaborador \
        AND tc2.Numero_DocumentoColaborador = c.Numero_DocumentoColaborador \
      LEFT JOIN TBL_ESTADO_CITAS tec ON \
        tec.Id_EstadoCita = c.Id_EstadoCita \
        AND tec.Activo = 'S' \
      LEFT JOIN TBL_TIPO_DOCUMENTOS ttd ON \
        ttd.Id_TipoDocumento = tc.Id_TipoDocumento \
      LEFT JOIN TBL_TIPO_DOCUMENTOS ttd2 ON \
        ttd2.Id_TipoDocumento = tc2.Id_TipoDocumento \
      LEFT JOIN TBL_SERVICIOS_CITAS tsc ON \
        tsc.Id_Cita = c.Id_Cita \
      LEFT JOIN TBL_SERVICIOS ts ON \
        ts.Id_Servicio = tsc.Id_Servicio \
      WHERE \
        c.Id_EstadoCita = ? \
        AND ((c.Fecha_Cita BETWEEN ? AND ?) \
          OR (c.Fecha_Final BETWEEN ? AND ?)) \
      ORDER BY \
        c.Numero_DocumentoCliente",
    appointmentByState:
      "SELECT \
        ROW_NUMBER() OVER ( \
          ORDER BY \
        c.Numero_DocumentoCliente) AS ID, \
        c.Numero_DocumentoCliente, \
        ttd.Tipo_Documento AS Tipo_DocumentoCliente, \
        tc.Nombres AS Nombre_Cliente, \
        tc.Primer_Apellido AS Primer_ApellidoCliente, \
        tc.Segundo_Apellido AS Segundo_ApeliidoCliente, \
        tc.Numero_Contacto, \
        c.Fecha_Cita, \
        c.Fecha_Final, \
        tec.Estado_Cita, \
        c.Numero_DocumentoColaborador, \
        ttd2.Tipo_Documento AS Tipo_DocumentoColaborado, \
        tc2.Nombres AS Nombre_Colaborador, \
        tc2.Primer_Apellido AS Primer_ApellidoColaborador, \
        tc2.Segundo_Apellido AS Segundo_ApellidoColaborador, \
        GROUP_CONCAT(ts.Nombre_Servicio SEPARATOR ', ') AS servicios \
      FROM \
        TBL_CITAS c \
      LEFT JOIN TBL_CLIENTES tc ON \
        tc.Id_TipoDocumento = c.Id_TipoDocumentoCliente \
        AND tc.Numero_DocumentoCliente = c.Numero_DocumentoCliente \
      LEFT JOIN TBL_COLABORADORES tc2 ON \
        tc2.Id_TipoDocumento = c.Id_TipoDocumentoColaborador \
        AND tc2.Numero_DocumentoColaborador = c.Numero_DocumentoColaborador \
      LEFT JOIN TBL_ESTADO_CITAS tec ON \
        tec.Id_EstadoCita = c.Id_EstadoCita \
        AND tec.Activo = 'S' \
      LEFT JOIN TBL_TIPO_DOCUMENTOS ttd ON \
        ttd.Id_TipoDocumento = tc.Id_TipoDocumento \
      LEFT JOIN TBL_TIPO_DOCUMENTOS ttd2 ON \
        ttd2.Id_TipoDocumento = tc2.Id_TipoDocumento \
      LEFT JOIN TBL_SERVICIOS_CITAS tsc ON \
        tsc.Id_Cita = c.Id_Cita \
      LEFT JOIN TBL_SERVICIOS ts ON \
        ts.Id_Servicio = tsc.Id_Servicio \
      WHERE \
        c.Id_EstadoCita = ? \
        AND ((c.Fecha_Cita BETWEEN ? AND ?) \
          OR (c.Fecha_Final BETWEEN ? AND ?)) \
      HAVING \
        COUNT(*) > 0 \
      ORDER BY \
        c.Numero_DocumentoCliente",
    appointmentByCollaborator:
      "SELECT \
        ROW_NUMBER() OVER ( \
          ORDER BY \
        c.Numero_DocumentoCliente) AS ID, \
        c.Numero_DocumentoCliente, \
        ttd.Tipo_Documento AS Tipo_DocumentoCliente, \
        tc.Nombres AS Nombre_Cliente, \
        tc.Primer_Apellido AS Primer_ApellidoCliente, \
        tc.Segundo_Apellido AS Segundo_ApeliidoCliente, \
        tc.Numero_Contacto, \
        c.Fecha_Cita, \
        c.Fecha_Final, \
        tec.Estado_Cita, \
        c.Numero_DocumentoColaborador, \
        ttd2.Tipo_Documento AS Tipo_DocumentoColaborado, \
        tc2.Nombres AS Nombre_Colaborador, \
        tc2.Primer_Apellido AS Primer_ApellidoColaborador, \
        tc2.Segundo_Apellido AS Segundo_ApellidoColaborador, \
        GROUP_CONCAT(ts.Nombre_Servicio SEPARATOR ', ') AS servicios \
      FROM \
        TBL_CITAS c \
      LEFT JOIN TBL_CLIENTES tc ON \
        tc.Id_TipoDocumento = c.Id_TipoDocumentoCliente \
        AND tc.Numero_DocumentoCliente = c.Numero_DocumentoCliente \
      LEFT JOIN TBL_COLABORADORES tc2 ON \
        tc2.Id_TipoDocumento = c.Id_TipoDocumentoColaborador \
        AND tc2.Numero_DocumentoColaborador = c.Numero_DocumentoColaborador \
      LEFT JOIN TBL_ESTADO_CITAS tec ON \
        tec.Id_EstadoCita = c.Id_EstadoCita \
        AND tec.Activo = 'S' \
      LEFT JOIN TBL_TIPO_DOCUMENTOS ttd ON \
        ttd.Id_TipoDocumento = tc.Id_TipoDocumento \
      LEFT JOIN TBL_TIPO_DOCUMENTOS ttd2 ON \
        ttd2.Id_TipoDocumento = tc2.Id_TipoDocumento \
      LEFT JOIN TBL_SERVICIOS_CITAS tsc ON \
        tsc.Id_Cita = c.Id_Cita \
      LEFT JOIN TBL_SERVICIOS ts ON \
        ts.Id_Servicio = tsc.Id_Servicio \
      WHERE \
        (c.Numero_DocumentoColaborador = ? AND c.Id_TipoDocumentoColaborador = ?) \
        AND ((c.Fecha_Cita BETWEEN ? AND ?) \
          OR (c.Fecha_Final BETWEEN ? AND ?)) \
      HAVING \
        COUNT(*) > 0 \
      ORDER BY \
        c.Numero_DocumentoColaborador",
    appointmentByClient:
      "SELECT \
        ROW_NUMBER() OVER ( \
          ORDER BY \
        c.Numero_DocumentoCliente) AS ID, \
        c.Numero_DocumentoCliente, \
        ttd.Tipo_Documento AS Tipo_DocumentoCliente, \
        tc.Nombres AS Nombre_Cliente, \
        tc.Primer_Apellido AS Primer_ApellidoCliente, \
        tc.Segundo_Apellido AS Segundo_ApeliidoCliente, \
        tc.Numero_Contacto, \
        c.Fecha_Cita, \
        c.Fecha_Final, \
        tec.Estado_Cita, \
        c.Numero_DocumentoColaborador, \
        ttd2.Tipo_Documento AS Tipo_DocumentoColaborado, \
        tc2.Nombres AS Nombre_Colaborador, \
        tc2.Primer_Apellido AS Primer_ApellidoColaborador, \
        tc2.Segundo_Apellido AS Segundo_ApellidoColaborador, \
        GROUP_CONCAT(ts.Nombre_Servicio SEPARATOR ', ') AS servicios \
      FROM \
        TBL_CITAS c \
        LEFT JOIN TBL_CLIENTES tc ON \
          tc.Id_TipoDocumento = c.Id_TipoDocumentoCliente \
          AND tc.Numero_DocumentoCliente = c.Numero_DocumentoCliente \
        LEFT JOIN TBL_COLABORADORES tc2 ON \
          tc2.Id_TipoDocumento = c.Id_TipoDocumentoColaborador \
          AND tc2.Numero_DocumentoColaborador = c.Numero_DocumentoColaborador \
        LEFT JOIN TBL_ESTADO_CITAS tec ON \
          tec.Id_EstadoCita = c.Id_EstadoCita \
          AND tec.Activo = 'S' \
        LEFT JOIN TBL_TIPO_DOCUMENTOS ttd ON \
          ttd.Id_TipoDocumento = tc.Id_TipoDocumento \
        LEFT JOIN TBL_TIPO_DOCUMENTOS ttd2 ON \
          ttd2.Id_TipoDocumento = tc2.Id_TipoDocumento \
        LEFT JOIN TBL_SERVICIOS_CITAS tsc ON \
          tsc.Id_Cita = c.Id_Cita \
        LEFT JOIN TBL_SERVICIOS ts ON \
          ts.Id_Servicio = tsc.Id_Servicio \
        WHERE \
          (c.Numero_DocumentoCliente = ? AND c.Id_TipoDocumentoCliente = ?) \
          AND ((c.Fecha_Cita BETWEEN ? AND ?) \
            OR (c.Fecha_Final BETWEEN ? AND ?)) \
        HAVING \
          COUNT(*) > 0 \
        ORDER BY \
          c.Numero_DocumentoCliente",
    totalByCollaborator:
      "SELECT \
        tc.Nombres, \
        tc.Primer_Apellido, \
        tc.Segundo_Apellido, \
        c.Numero_DocumentoColaborador, \
        ttd.Tipo_Documento, \
        SUM(c.Valor_Cita) AS TOTAL \
      FROM \
        TBL_CITAS c \
      LEFT JOIN TBL_COLABORADORES tc ON tc.Id_TipoDocumento = c.Id_TipoDocumentoColaborador  AND \
        tc.Numero_DocumentoColaborador = c.Numero_DocumentoColaborador \
      LEFT JOIN TBL_TIPO_DOCUMENTOS ttd ON ttd.Id_TipoDocumento = c.Id_TipoDocumentoColaborador \
      WHERE \
        ((c.Fecha_Cita BETWEEN ? AND ?) \
          OR (c.Fecha_Final BETWEEN ? AND ?)) \
      GROUP BY \
        c.Numero_DocumentoColaborador",
    historyProduct:
      "SELECT \
        ROW_NUMBER() OVER (ORDER BY ths.Id_Servicio) AS ID, \
        ts.Nombre_Servicio,	\
        Cantidad,	\
        Tipo_Modificacion,\
        ths.Descripcion_Servicio,	\
        Fecha_HoraModificacion,	\
        ths.Numero_DocumentoColaborador, \
        ttd.Tipo_Documento, \
        tc.Nombres, \
        tc.Primer_Apellido, \
        tc.Segundo_Apellido  \
      FROM  TBL_HISTORIAL_SERVICIOS ths \
      LEFT JOIN TBL_SERVICIOS ts ON ts.Id_Servicio = ths.Id_Servicio \
      LEFT JOIN TBL_COLABORADORES tc ON tc.Numero_DocumentoColaborador = ths.Numero_DocumentoColaborador \
        AND tc.Id_TipoDocumento = ths.Id_TipoDocumento \
      LEFT JOIN TBL_TIPO_DOCUMENTOS ttd ON ttd.Id_TipoDocumento = ths.Id_TipoDocumento  \
      WHERE ths.Numero_DocumentoColaborador IS NOT NULL \
      ORDER BY \
        ths.Id_Servicio",
    historyProductByProduct:
      "SELECT \
        ROW_NUMBER() OVER (ORDER BY ths.Id_Servicio) AS ID, \
        ts.Nombre_Servicio,	\
        Cantidad,	\
        Tipo_Modificacion,\
        ths.Descripcion_Servicio,	\
        Fecha_HoraModificacion,	\
        ths.Numero_DocumentoColaborador, \
        ttd.Tipo_Documento, \
        tc.Nombres, \
        tc.Primer_Apellido, \
        tc.Segundo_Apellido  \
      FROM  TBL_HISTORIAL_SERVICIOS ths \
      LEFT JOIN TBL_SERVICIOS ts ON ts.Id_Servicio = ths.Id_Servicio \
      LEFT JOIN TBL_COLABORADORES tc ON tc.Numero_DocumentoColaborador = ths.Numero_DocumentoColaborador \
        AND tc.Id_TipoDocumento = ths.Id_TipoDocumento \
      LEFT JOIN TBL_TIPO_DOCUMENTOS ttd ON ttd.Id_TipoDocumento = ths.Id_TipoDocumento  \
      WHERE ths.Numero_DocumentoColaborador IS NOT NULL AND ths.Id_Servicio = ?\
      ORDER BY \
        ths.Id_Servicio",
  },
};

module.exports = queries;
