/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from "../database.js";

const crearDomicilio = async({id_domicilio, nro_puerta, id_persona}) =>{
    const query = {
        text: `insert into domicilio(id_domicilio, nro_puerta, id_persona) 
                values(?,?,?)`,
        values: [id_domicilio, nro_puerta, id_persona]
    }

    const resultado = await pool.query(query.text, query.values);
    return resultado[0];
}

const mostrarDomicilioById = async(id_persona) =>{
    const query = {
        text: `select * from domicilio where id_persona = ?`,
        values: [id_persona]
    }
    const resultado = await pool.query(query.text, query.values);
    return resultado[0];
}

export const domicilioModel = {
    crearDomicilio,
    mostrarDomicilioById
}