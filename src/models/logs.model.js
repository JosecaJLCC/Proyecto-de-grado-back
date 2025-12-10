/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from "../database.js";

const logsUpdate = async({id_usuario_rol, tabla, tabla_id, fecha_log, accion}) =>{
    const query = {
        text: `insert into registro_log(id_usuario_rol, tabla, tabla_id, fecha_log, accion ) 
                values(?, ?, ?, ?, ?)`,
        values: [id_usuario_rol, tabla, tabla_id, fecha_log, accion]
    }
    const [result] = await pool.query(query.text, query.values);
    return result;
}

const logsShow = async() =>{
    const query = {
        text: `select 
                    xpe.ci,
                    xrl.id_usuario_rol,
                    xrl.tabla,
                    xrl.tabla_id,
                    xrl.accion,
                    DATE_FORMAT(xrl.fecha_log, '%Y-%m-%d %H:%i:%s') AS fecha_log
                from registro_log xrl
                join usuario_rol xur      on xrl.id_usuario_rol = xur.id
                join usuario xu           on xur.id_usuario = xu.id
                join rol xr               on xur.id_rol = xr.id
                join personal xpl         on xu.id_personal = xpl.id
                join persona xpe          on xpl.id_persona = xpe.id;`
    }
    const [result] = await pool.query(query.text);
    return result;
}

export const logsModel = {
    logsUpdate,
    logsShow
}