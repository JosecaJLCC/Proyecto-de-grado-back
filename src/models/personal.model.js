import { pool } from "../database.js";

const crearPersonal = async({perfil, profesion, area_trabajo, fecha_ingreso, id_persona}) =>{
    const query = {
        text: `insert into personal(perfil, profesion, area_trabajo, fecha_ingreso, id_persona)
                values(?, ?, ?, ?, ?) `,
        values: [perfil, profesion, area_trabajo, fecha_ingreso, id_persona]    
    }
    const resultado =await pool.query(query.text, query.values)
    console.log(resultado)
    return resultado[0];
}

export const personalModel = {
    crearPersonal
}
