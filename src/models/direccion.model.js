/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from "../database.js";

const crearDireccion = async({departamento, municipio, zona, av_calle}) =>{
    const query = {
        text: `insert into direccion(departamento, municipio, zona, av_calle) 
                values(?,?,?,?)`,
        values: [departamento, municipio, zona, av_calle]
    }

    const resultado = await pool.query(query.text, query.values);
    return resultado[0];
}

export const direccionModel = {
    crearDireccion
}