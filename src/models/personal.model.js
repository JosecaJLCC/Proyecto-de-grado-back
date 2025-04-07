import { pool } from "../database.js";

/* Es todo lo mismo que un registro en Persona */
const crearPersonal = async({perfil, profesion, area_trabajo, fecha_ingreso, id_persona}) =>{
    const query = {
        text: `insert into personal(perfil, profesion, area_trabajo, fecha_ingreso, id_persona)
                values(?, ?, ?, ?, ?) `,
        values: [perfil, profesion, area_trabajo, fecha_ingreso, id_persona]    
    }
    const resultado =await pool.query(query.text, query.values)
    console.log(resultado)
    /* Devuelve un array de respuestas desde mysql */
    return resultado[0];
}

export const personalModel = {
    crearPersonal
}
