/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from "../database.js";

const logsSession = async({id_usuario_rol, fecha_log, accion}) =>{
    const query = {
        text: `insert into registro_log(id_usuario_rol, fecha_log, accion ) 
                values(?, ?, ?)`,
        values: [id_usuario_rol, fecha_log, accion]
    }
    const [result] = await pool.query(query.text, query.values);
    return result;
}

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
        text: `select * from registro_log`
    }
    const [result] = await pool.query(query.text);
    return result;
}

export const logsModel = {
    logsSession,
    logsUpdate,
    logsShow
}