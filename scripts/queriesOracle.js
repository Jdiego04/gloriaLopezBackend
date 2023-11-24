const queriesOracle = {
    typeDocument: {
        newTypeDocument: "INSERT INTO tbl_tipos_documentos (tipo_documento) VALUES (?)"
    },
    stateAppointment: {
        newStateAppointment: "INSERT INTO tbl_estados_citas (estado_cita) VALUES (?)",
        UpdateState: "UPDATE tbl_estados_citas \
        SET activo = CASE  \
            WHEN activo = 'N' THEN 'S' \
            WHEN activo = 'S' THEN 'N' \
        END \
        WHERE id_estadocita = ?",
        allStateAppointment: `SELECT id_estadocita, estado_cita FROM tbl_estados_citas WHERE activo = 'S'`
    },
    module: {
        newModule: "INSERT INTO tbl_modulos (Nombre_Modulo) VALUES (?)",
        UpdateState: "UPDATE tbl_modulos \
        SET activo = CASE  \
            WHEN activo = 'N' THEN 'S' \
            WHEN activo = 'S' THEN 'N' \
        END \
        WHERE id_modulo = ?"
    },
    charges: {
        newCharges: "INSERT INTO tbl_cargos (Cargo) VALUES (?) ",
        UpdateState: "UPDATE tbl_cargos \
        SET activo = CASE  \
            WHEN activo = 'N' THEN 'S' \
            WHEN activo = 'S' THEN 'N' \
        END \
        WHERE id_cargo = ?"
    },
    category: {
        newCategory: "INSERT INTO tbl_categorias (Categoria) VALUES (?)",
        UpdateState: "UPDATE tbl_categorias \
        SET activo = CASE  \
            WHEN activo = 'N' THEN 'S' \
            WHEN activo = 'S' THEN 'N' \
        END \
        WHERE id_categoria = ?",
        allCategoria: `Select id_Categoria, categoria From tbl_Categorias where Activo = 'S' `
    },
    service: {
        newService: "INSERT INTO tbl_servicios (id_categoria,nombre_servicio,valor_servicio,descripcion_servicio, \
            duracion_servicio) VALUES (?,?,?,?,?)",
        UpdateState: "UPDATE tbl_servicios \
        SET activo = CASE  \
            WHEN activo = 'N' THEN 'S' \
            WHEN activo = 'S' THEN 'N' \
        END \
        WHERE id_servicio = ?",
        ServiceByCategoria: `SELECT s.id_servicio, s.nombre_servicio, s.valor_servicio, s.duracion_servicio
        FROM tbl_servicios s 
        LEFT JOIN tbl_Categorias c ON c.id_categoria = :param1 AND s.activo = 'S'`
    },
    chargesByModule: {
        newChargesByModule: "INSERT INTO tbl_modulos_cargos (id_modulo,id_cargo,crear,modificar,leer) \
        VALUES (?,?,?,?,?);"
    },
    provider: {
        newProvider: "INSERT INTO tbl_Proveedores  (Nombre,Numero_contacto,Direccion) VALUES (?,?,?) ",
        UpdateState: "UPDATE tbl_servicios \
        SET activo = CASE  \
            WHEN activo = 'N' THEN 'S' \
            WHEN activo = 'S' THEN 'N' \
        END \
        WHERE id_servicio = ?"
    },
    providerByService: {
        newProviderByService: "INSERT INTO tbl_servicios_proveedores (id_servicio, id_proveedor) VALUES (?,?)"
    },
    client: {
        newClient: "INSERT INTO tbl_clientes (Nombres,Primer_Apellido,segundo_apellido,id_tipoDocumento, \
            numero_documentocliente,numero_Contacto,correo_electronico,contrasennia,fecha_nacimiento,) \
            VALUES (?,?,?,?,?,?,?,TO_DATE(?, 'YYYY-MM-DD'))",
        UpdateState: "UPDATE tbl_colaboradores \
            SET activo = CASE  \
            WHEN activo = 'N' THEN 'S' \
            WHEN activo = 'S' THEN 'N' \
            END \
            WHERE tbl_colaboradores = ?",
        allClient: `SELECT id_tipodocumento,numero_documentocliente, 
        Nombres || ' ' || Primer_apellido || ' ' || Segundo_apellido AS nombre_Cliente FROM tbl_clientes where Activo = 'S'`
    },
    collaborator: {
        newCollaborator: "INSERT INTO tbl_colaboradores (Nombres,Primer_Apellido,Segundo_Apellido,id_TipoDocumento, \
                Numero_DocumentoColaborador, id_Cargo, numero_contacto,correo_electronico, contrasennia,fecha_ingreso, \
                fecha_nacimiento) VALUES (?,?,?,?,?,?,?,?,?,TO_DATE(?, 'YYYY-MM-DD'),TO_DATE(?, 'YYYY-MM-DD'))",
        UpdateState: "UPDATE tbl_colaboradores \
                SET activo = CASE  \
                WHEN activo = 'N' THEN 'S' \
                WHEN activo = 'S' THEN 'N' \
                END \
                WHERE tbl_colaboradores = ?",
        CollaboratorByCategory: `SELECT col.id_tipodocumento, col.numero_documentocolaborador, 
        col.Nombres || ' ' || col.Primer_apellido || ' ' || col.Segundo_apellido AS nombre_Colaborador
        FROM tbl_colaboradores col LEFT JOIN tbl_Categorias c  ON c.id_categoria = :param1 and col.activo='S'`,
    },
    appointment: {
        newAppointment: "INSERT INTO tbl_citas (id_estadocita,id_tipodocumentocliente,numero_documentocliente, \
                    id_tipodocumentocolaborador,numero_documentocolaborador,annio_cita, mes_cita,dia_cita, hora_cita, \
                    minutos_cita, valor_cita) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
        allAppointment: `
        SELECT  
        c.id_cita,
        col.Nombres || ' ' || col.Primer_apellido || ' ' || col.Segundo_apellido AS nombre_Colaborador,
        cli.Nombres || ' ' || cli.Primer_apellido || ' ' || cli.Segundo_apellido AS nombre_Cliente,
        TO_CHAR(
            TO_TIMESTAMP_TZ(
                c.annio_cita || '-' || c.mes_cita || '-' || c.dia_cita || ' ' || c.hora_cita || ':' || c.minutos_cita || ':00 UTC',
                'YYYY-MM-DD HH24:MI:SS TZR'
            ),
            'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"'
        ) AS fecha_inicio,
        TO_CHAR(c.Fecha_final, 'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') AS Fecha_final,
        c.Valor_Cita,
        cli.Numero_Contacto,
        ec.Estado_Cita, 
        cat.categoria,
        LISTAGG(s.nombre_servicio, ', ') WITHIN GROUP (ORDER BY s.id_servicio) AS servicios_asociados
    FROM 
        tbl_citas c
    LEFT JOIN 
        tbl_colaboradores col ON col.id_tipodocumento = c.id_tipodocumentocolaborador AND col.Numero_DocumentoColaborador = c.Numero_DocumentoColaborador AND col.activo = 'S'
    LEFT JOIN 
        tbl_clientes cli ON cli.id_tipodocumento = c.Id_TipoDocumentoCliente AND cli.Numero_DocumentoCliente = c.Numero_DocumentoCliente AND cli.activo = 'S'
    LEFT JOIN 
        tbl_estados_citas ec ON ec.Id_EstadoCita = c.Id_EstadoCita AND ec.activo = 'S'
    LEFT JOIN
        tbl_servicios_citas sc ON sc.id_cita = c.id_cita
    LEFT JOIN
        tbl_servicios s ON s.id_servicio = sc.id_servicio AND s.activo = 'S'
    LEFT JOIN
        tbl_categorias cat ON cat.id_categoria = s.id_categoria AND cat.activo = 'S'
    WHERE
        s.id_servicio IS NOT NULL AND cat.id_categoria IS NOT NULL
    GROUP BY
        c.id_cita,
        col.Nombres,
        col.Primer_apellido,
        col.Segundo_apellido,
        cli.Nombres,
        cli.Primer_apellido,
        cli.Segundo_apellido,
        TO_CHAR(
            TO_TIMESTAMP_TZ(
                c.annio_cita || '-' || c.mes_cita || '-' || c.dia_cita || ' ' || c.hora_cita || ':' || c.minutos_cita || ':00 UTC',
                'YYYY-MM-DD HH24:MI:SS TZR'
            ),
            'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"'
        ),
        TO_CHAR(c.Fecha_final, 'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"'),
        c.Valor_Cita,
        cli.Numero_Contacto,
        ec.Estado_Cita, 
        cat.categoria`,
        change:
            `UPDATE TBL_CITAS 
            SET 
              Id_EstadoCita = ?, 
              Valor_Cita = ? 
            WHERE Id_Cita = ?`,
    },
    servicesByAppointment: {
        newServicesByAppointment: " INSERT INTO tbl_servicios_citas (id_servicio,id_cita) VALUES (?,?)"
    }
}

module.exports = queriesOracle;
