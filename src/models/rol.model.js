/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from '../database.js';
/*  */
const mostrarRol = async( id_rol ) =>{
    const query = {
        text: `select nombre from rol where id_rol = ?;`,
        values: [id_rol]
    }
    const resultado = await pool.query(query.text, query.values);
    return resultado[0];
}

export const rolModel = {
    mostrarRol
}