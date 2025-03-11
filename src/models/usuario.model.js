/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from '../database.js';
/*  */
const registrarUsuario = async({ nombre_usuario,correo,clave,id_persona }) =>{
    const query = {
        text: `insert into usuario(nombre_usuario, correo, clave, fecha_creacion, id_persona) 
            values (?, ?, ?, now(), ?);`,
        values: [nombre_usuario, correo, clave, id_persona]
    }
    const resultado = await pool.query(query.text, query.values);
    console.log(resultado)
    return resultado[0];
}

const inicioSesion = async(correo, clave) => {
    const query = {
        text: `select correo, clave from usuario where correo like ? and clave like ?;`,
        values: [correo, clave]
    }
    const resultado = await pool.query(query.text, query.values);
    return resultado[0];
}

const correoUsuario = async(correo) => {
    const query = {
        text: `select * from usuario where correo like ?;`,
        values: [correo]
    }
    const resultado = await pool.query(query.text, query.values);
    return resultado[0];
}


const nombreUsuario = async(nombre_usuario) => {
    const query = {
        text: `select nombre_usuario from usuario where nombre_usuario like ?;`,
        values: [nombre_usuario]
    }
    const resultado = await pool.query(query.text, query.values);
    return resultado[0];
}

export const usuarioModel = {
    registrarUsuario,
    inicioSesion,
    correoUsuario,
    nombreUsuario,
}