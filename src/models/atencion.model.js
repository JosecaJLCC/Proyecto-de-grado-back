/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from "../database.js";

const registrarAtencion = async({id_usuario, id_persona, id_establecimiento}) =>{
    const query = {
        text: `insert into atencion(id_usuario, id_persona, id_establecimiento, fecha_atencion) 
                values(?,?,?,now())`,
        values: [id_usuario, id_persona, id_establecimiento]
    }

    const resultado = await pool.query(query.text, query.values);
    return resultado[0];
}

const mostrarAtencion = async()=>{
    const query = {
        text: `select * from atencion`,
    }

    const resultado = await pool.query(query.text);
    return resultado[0];
}
export const atencionModel = {
    registrarAtencion
}