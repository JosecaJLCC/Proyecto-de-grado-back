/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from "../database.js";

const crearEstablecimiento = async({id_establecimiento, nombre}) =>{
    const query = {
        text: `insert into establecimiento(id_establecimiento, nombre) 
                values(?, ?);`,
        values: [id_establecimiento, nombre]
    }

    const resultado = await pool.query(query.text, query.values);
    return resultado[0];
}

const verificarEstablecimiento = async(id_establecimiento) =>{
    const query = {
        text: `select * from establecimiento where id_establecimiento=?;`,
        values: [id_establecimiento]
    }

    const resultado = await pool.query(query.text, query.values);
    return resultado[0];
}

const mostrarEstablecimiento = async() =>{
    const query = {
        text: `select * from establecimiento;`, 
    }

    const resultado = await pool.query(query.text);
    return resultado[0];
}

export const establecimientoModel = {
    crearEstablecimiento,
    verificarEstablecimiento,
    mostrarEstablecimiento
}