/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from "../database.js";

/* Se crea la funcion para el registro de personas */
const crearPersona = async({ci, extension, nombre, paterno, materno, nacionalidad, estado_civil, nro_telf, sexo, fecha_nacimiento}) =>{
        console.log("aqui",ci, extension, 
            nombre, paterno, materno, 
            nacionalidad, estado_civil, nro_telf, sexo, fecha_nacimiento)
    const query = {
        text: `insert into persona(ci, extension, 
                                nombre, paterno, materno, 
                                nacionalidad, estado_civil, nro_telf, sexo, fecha_nacimiento) 
            values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        values: [ci, extension, 
            nombre, paterno, materno, 
            nacionalidad, estado_civil, nro_telf, sexo, fecha_nacimiento]
    }
    /* Se espera el resultado de la consulta un array de dos objetos [{}, {}] tomamos el primero*/
    const resultado = await pool.query(query.text, query.values);
    /* Devuelve un objeto con las siguientes caracteristicas: fieldCount, affectedRows, insertId, info, etc */
    return resultado[0];
}

/* Se creo la funcion para la verificacion de existencia de un ci extension */
const verificarCI = async(ci, extension) =>{
    const query = {
        text: `select concat(ci, ' ', extension) as cedula from persona where ci = ? and extension = ?;`,
        values: [ci, extension]
    }
    /* devuelve un array de array [[],[]] si el primero esta vacio pues hacer .length para la validacion */
    const resultado = await pool.query(query.text, query.values);
    /* Se envia el primer array donde se mandan los valores ci, extension si fueron encontrados y si no, envia un array vacio */
    return resultado[0];
}

/* Modelo para mostrar las personas registradas como nuevo paciente */
const mostrarPersonas = async() =>{
    const query = {
        text: `select id_persona, concat(ci, ' ', extension) as cedula, paterno, materno, nombre from persona;`,
    }
    /* devuelve un array de array [[],[]] si el primero esta vacio pues hacer .length para la validacion */
    const resultado = await pool.query(query.text);
    /* Se envia el primer array donde se mandan los valores ci, extension si fueron encontrados y si no, envia un array vacio */
    return resultado[0];
}

const mostrarPersonaByCi= async(ci) => {
    const query = {
        text: `select * from persona where concat(ci, " ", extension)=?;`,
        values: [ci]
    }
    /* devuelve un array de array de objetos [[{}],[{}]] si el primero esta vacio pues hacer .length para la validacion */
    const resultado = await pool.query(query.text, query.values);
    /* Se envia el primer array donde se mandan los valores ci, extension si fueron encontrados y si no, envia un array vacio */
    return resultado[0];
}

export const personaModel = {
    crearPersona,
    verificarCI,
    mostrarPersonas,
    mostrarPersonaByCi
}