/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from "../database.js";

/* Se crea la funcion para el registro de pacientes */
const registrarPaciente = async({id_persona}) =>{
    const query = {
        text: `insert into paciente(id_persona) 
            values (?);`,
        values: [id_persona]
    }
    /* Se espera el resultado de la consulta un array de dos objetos [{}, {}] tomamos el primero*/
    const resultado = await pool.query(query.text, query.values);
    /* Devuelve un objeto con las siguientes caracteristicas: fieldCount, affectedRows, insertId, info, etc */
    return resultado[0];
}


/* Modelo para mostrar las personas registradas como nuevo paciente */
const mostrarPacientes = async() =>{
    const query = {
        text: `select (select concat(xpe.ci, " ", xpe.extension)
                        from persona xpe
                        where xpa.id_persona=xpe.id_persona) as ci,
                        
                        (select xpe.nombre
                        from persona xpe
                        where xpa.id_persona=xpe.id_persona) as nombre,
                        
                        (select xpe.nombre
                        from persona xpe
                        where xpa.id_persona=xpe.id_persona) as paterno,

                        (select xpe.nombre
                        from persona xpe
                        where xpa.id_persona=xpe.id_persona) as materno, 
                        xpa.id_persona
                from paciente xpa;`,
    }
    /* devuelve un array de array [[],[]] si el primero esta vacio pues hacer .length para la validacion */
    const resultado = await pool.query(query.text);
    /* Se envia el primer array donde se mandan los valores ci, extension si fueron encontrados y si no, envia un array vacio */
    return resultado[0];
}

const mostrarPacienteById= async(ci) => {
    const query = {
        text: `select * from persona where concat(ci, " ", extension)=?;`,
        values: [ci]
    }
    /* devuelve un array de array de objetos [[{}],[{}]] si el primero esta vacio pues hacer .length para la validacion */
    const resultado = await pool.query(query.text, query.values);
    /* Se envia el primer array donde se mandan los valores ci, extension si fueron encontrados y si no, envia un array vacio */
    return resultado[0];
}

export const pacienteModel = {
    registrarPaciente,
    mostrarPacientes,
    mostrarPacienteById
}