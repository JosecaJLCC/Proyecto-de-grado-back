/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from "../database.js";

const registrarLogs = async({id_usuario, id_establecimiento}) =>{
    const query = {
        text: `insert into registro_log(id_usuario, id_establecimiento, fecha_log ) 
                values(?,?, now())`,
        values: [id_usuario, id_establecimiento]
    }

    const resultado = await pool.query(query.text, query.values);
    return resultado[0];
}

export const logsModel = {
    registrarLogs
}