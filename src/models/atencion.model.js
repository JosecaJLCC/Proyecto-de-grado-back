/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from "../database.js";

const createAttention = async({id_usuario_rol_atencion, id_paciente, id_area, estado_atencion, fecha_atencion, turno}) =>{
      let connection;
    try {
        connection = await pool.getConnection();
        const query = {
                text: `insert into atencion(id_usuario_rol_atencion, id_paciente, id_area, estado_atencion, fecha_atencion, turno) 
                        values(?, ?, ?, ?, ?, ?)`,
                values: [id_usuario_rol_atencion, id_paciente, id_area, estado_atencion, fecha_atencion, turno]
            }
            const [result] = await connection.query(query.text, query.values);
            return result;
    } catch (error) {
        error.source = 'model';
        throw error;
    } finally{
       if (connection) connection.release();
    }  
}

const showAttention = async() =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
        text: `select xat.id, xat.id_paciente, xat.id_area, xpe.ci,
                concat(xpe.paterno," ",xpe.materno," ",xpe.nombre) as nombres,
                concat(xdi.zona,", ",xdi.av_calle,", ",xdo.nro_puerta) as domicilio,
                DATE_FORMAT(xpe.fecha_nacimiento, '%Y-%m-%d %H:%i:%s') AS fecha_nacimiento, xpe.sexo,
                xar.nombre_area, xe.nombre_establecimiento, xat.estado_atencion, xat.turno,
                DATE_FORMAT(xat.fecha_atencion, '%Y-%m-%d %H:%i:%s') AS fecha_atencion
            from persona xpe, paciente xpa, atencion xat, usuario_rol xur, 
                area_trabajo xar, establecimiento xe, domicilio xdo, direccion xdi  
            where xpe.id=xdo.id_persona and xdo.id=xdi.id and 
                xpa.id_persona=xpe.id and xpa.id=xat.id_paciente and 
                xat.id_area=xar.id and xur.id=xat.id_usuario_rol_atencion and 
                xur.id_establecimiento=xe.id and
                date(xat.fecha_atencion)=date(now());`,
        }
        const [result] = await connection.query(query.text);
        return result;
    } catch (error) {
        error.source = 'model';
        throw error;
    } finally{
       if (connection) connection.release();
    }  
}

const showStatus = async() =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
        text: `SELECT 
                SUM(estado_atencion = 'EN ESPERA') AS espera,
                SUM(estado_atencion = 'EN ATENCIÓN') AS atencion,
                SUM(estado_atencion = 'FINALIZADA') AS finalizada,
                SUM(estado_atencion = 'INCOMPLETA') AS incompleta
              FROM atencion
              where date(fecha_atencion)=curdate();`,
        }
        const [result] = await connection.query(query.text);
        return result;
    } catch (error) {
        error.source = 'model';
        throw error;
    } finally{
       if (connection) connection.release();
    }  
}

/* const showReport = async({fecha_inicial, fecha_final}) =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
        text: `SELECT 
                  e.nombre_establecimiento,

                  -- Turno
                  IFNULL(SUM(CASE WHEN xat.turno = 'MAÑANA' THEN 1 ELSE 0 END), 0) AS manana,
                  IFNULL(SUM(CASE WHEN xat.turno = 'TARDE' THEN 1 ELSE 0 END), 0) AS tarde,

                  -- Estados
                  IFNULL(SUM(CASE WHEN xat.estado_atencion = 'FINALIZADA' THEN 1 ELSE 0 END), 0) AS finalizadas,
                  IFNULL(SUM(CASE WHEN xat.estado_atencion = 'INCOMPLETA' THEN 1 ELSE 0 END), 0) AS incompletas,

                  -- Total general del día
                  IFNULL(COUNT(xat.id), 0) AS total

              FROM establecimiento e

              LEFT JOIN usuario_rol ur 
                  ON e.id = ur.id_establecimiento

              LEFT JOIN atencion xat 
                  ON ur.id = xat.id_usuario_rol_atencion
                  AND xat.fecha_atencion BETWEEN ? AND  ?

              GROUP BY e.id, e.nombre_establecimiento
              ORDER BY e.nombre_establecimiento;`,
          values:[fecha_inicial, fecha_final]
        }
        const [result] = await connection.query(query.text, query.values);
        return result;
    } catch (error) {
        error.source = 'model';
        throw error;
    } finally{
       if (connection) connection.release();
    }  
} */
const showReport = async({fecha_inicial, fecha_final}) =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
        text: `SELECT 
                    xat.id, 
                    
                    DATE_FORMAT(xat.fecha_atencion, '%Y-%m-%d %H:%i:%s') AS fecha_atencion,
                    xdi.nombre_diagnostico, 
                    xpe.ci, 
                    
                    DATE_FORMAT(xpe.fecha_nacimiento, '%Y-%m-%d %H:%i:%s') AS fecha_nacimiento, 
                    xpe.sexo, 
                    xpe.nro_telf, 
                    xdir.municipio,

                    -- Cálculo de la edad
                    TIMESTAMPDIFF(YEAR, xpe.fecha_nacimiento, CURDATE()) AS edad

                FROM atencion xat
                INNER JOIN diagnostico xdi ON xat.id_diagnostico = xdi.id
                INNER JOIN paciente xpa ON xat.id_paciente = xpa.id
                INNER JOIN persona xpe ON xpa.id_persona = xpe.id
                INNER JOIN domicilio xdom ON xdom.id_persona = xpe.id
                INNER JOIN direccion xdir ON xdom.id = xdir.id

                WHERE DATE(xat.fecha_atencion) BETWEEN ? AND ?;`,
          values:[fecha_inicial, fecha_final]
        }
        const [result] = await connection.query(query.text, query.values);
        return result;
    } catch (error) {
        error.source = 'model';
        throw error;
    } finally{
       if (connection) connection.release();
    }  
}

const showReport2 = async({fecha_inicial}) =>{
    let connection;
    console.log("mi fecha es: ", fecha_inicial)
    try {
        connection = await pool.getConnection();
        const query = {
        text: `SELECT 
                  e.nombre_establecimiento,

                  -- Turno
                  IFNULL(SUM(CASE WHEN xat.turno = 'MAÑANA' THEN 1 ELSE 0 END), 0) AS manana,
                  IFNULL(SUM(CASE WHEN xat.turno = 'TARDE' THEN 1 ELSE 0 END), 0) AS tarde,

                  -- Estados
                  IFNULL(SUM(CASE WHEN xat.estado_atencion = 'FINALIZADA' THEN 1 ELSE 0 END), 0) AS finalizadas,
                  IFNULL(SUM(CASE WHEN xat.estado_atencion = 'INCOMPLETA' THEN 1 ELSE 0 END), 0) AS incompletas,

                  -- Total general del día
                  IFNULL(COUNT(xat.id), 0) AS total

              FROM establecimiento e

              LEFT JOIN usuario_rol ur 
                  ON e.id = ur.id_establecimiento

              LEFT JOIN atencion xat 
                  ON ur.id = xat.id_usuario_rol_atencion
                  AND date(xat.fecha_atencion)=?

              GROUP BY e.id, e.nombre_establecimiento
              ORDER BY e.nombre_establecimiento;`,
          values:[fecha_inicial]
        }
        const [result] = await connection.query(query.text, query.values);
        return result;
    } catch (error) {
        error.source = 'model';
        throw error;
    } finally{
       if (connection) connection.release();
    }  
}


export const updateAttention = async({id, id_receta, id_diagnostico, estado_atencion, id_usuario_rol_diagnostico, id_usuario_rol_farmacia})=>{
    let connection;
    try {
        connection = await pool.getConnection();
        // Iniciar transacción
        await connection.beginTransaction();

        let [resultAttention] = await connection.query(`update atencion 
                    set 
                    id_receta=ifnull(?, id_receta),
                    id_diagnostico=ifnull(?, id_diagnostico),
                    estado_atencion=ifnull(?, estado_atencion),
                    id_usuario_rol_diagnostico=ifnull(?, id_usuario_rol_diagnostico),
                    id_usuario_rol_farmacia=ifnull(?, id_usuario_rol_farmacia)
                    where id=?`,
                    [id_receta, id_diagnostico, estado_atencion, id_usuario_rol_diagnostico, id_usuario_rol_farmacia, id])
        
        await connection.commit();
        return resultAttention;
    }catch (error) {
        if (connection) await connection.rollback(); // Revierte todo si algo falla
        error.source = 'model';
        throw error;
    } finally {
        // Liberar conexión si fue obtenida
        if (connection) connection.release();
    } 
}

const showMedicalDescription = async({id}) =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
        text: `SELECT 
            xat.id AS id_atencion,
            xat.estado_atencion,
            xat.fecha_atencion,

            xdi.id AS id_diagnostico,
            xdi.nombre_diagnostico,
            xdi.descripcion,

            xre.id AS id_receta,
            xre.fecha_emision,

            xrd.id AS id_receta_detalle,
            xrd.indicacion,
            xrd.presentacion,
            xrd.cantidad_recetada,
            xrd.cantidad_dispensada,

            xme.id AS id_medicamento,
            xme.nombre_medicamento

            FROM atencion xat
            LEFT JOIN diagnostico xdi 
            ON xat.id_diagnostico = xdi.id

            LEFT JOIN receta xre 
            ON xat.id_receta = xre.id

            LEFT JOIN receta_detalle xrd 
            ON xrd.id_receta = xre.id

            LEFT JOIN medicamento xme 
            ON xrd.id_medicamento = xme.id

            WHERE xat.id = ?;`,
                    values:[id],
        }
        const [result] = await connection.query(query.text, query.values);
        return result;
    } catch (error) {
        error.source = 'model';
        throw error;
    } finally{
       if (connection) connection.release();
    }  
}

const verifyAttention = async({id_paciente, id_area, fecha_atencion}) =>{
    let connection;
    try {
        connection=await pool.getConnection();
        const query = {
            text:`select * 
            from atencion 
            where id_paciente = ? and id_area=? and date(fecha_atencion) = ?`,
            values: [id_paciente, id_area, fecha_atencion]
        }
        const [result] = await connection.query(query.text, query.values);
        return result;
    } catch (error) {
        error.source = 'model';
        throw error;
    } finally{
       if (connection) connection.release();
    }  
}

const verifyTurn = async ({ turno }) => {
  let connection;
  try {
    connection = await pool.getConnection();

    const query = {
      text: `
        UPDATE atencion
        SET estado_atencion = 'INCOMPLETA'
        WHERE turno = ?
          AND estado_atencion != 'FINALIZADA';
      `,
      
      values: [turno]
    };

    const [result] = await connection.query(query.text, query.values);
    return result;

  } finally {
    if (connection) connection.release();
  }
};

export const attentionModel = {
    createAttention,
    showAttention,
    verifyAttention,
    updateAttention,
    showMedicalDescription,
    verifyTurn,
    showStatus,
    showReport,
    showReport2
}