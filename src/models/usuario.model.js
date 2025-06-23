/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from '../database.js';
/*  */
const registrarUsuario = async({ nombre_usuario, correo, clave, perfil, id_persona, id_rol }) =>{
    const query = {
        text: `insert into usuario(nombre_usuario, correo, clave, perfil, fecha_creacion, id_persona, id_rol) 
                values (?, ?, ?, ?, now(),?, ?);`,
        values: [nombre_usuario, correo, clave, perfil, id_persona, id_rol]
    }
    const resultado = await pool.query(query.text, query.values);
    return resultado[0];
}

const inicioSesion = async(correo, clave) => {
    const query = {
        text: `select correo, clave from usuario where correo = ? and clave = ?;`,
        values: [correo, clave]
    }
    const resultado = await pool.query(query.text, query.values);
    return resultado[0];
}

const correoUsuario = async(correo) => {
    const query = {
        text: `select id_usuario, nombre_usuario, correo, clave, perfil, id_persona, id_rol  from usuario where correo = ?;`,
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