/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from "../database.js";

const createRolUser = async({ id_rol, id_usuario, fecha_creacion }) => {
    let connection;
    try {
        // Obtener conexión
        connection = await pool.getConnection();
        // Iniciar transacción
        await connection.beginTransaction();

        const [user] = await connection.query(
        `INSERT INTO usuario_rol (id_rol, id_usuario, fecha_creacion) 
                    VALUES (?, ?, ?)`, 
        [id_rol, id_usuario, fecha_creacion])

        // Confirmar si todo salió bien
        await connection.commit();

        return user;

    } catch (error) {
        if (connection) await connection.rollback(); // Revierte todo si algo falla
        error.source = 'model';
        throw error;
    } finally {
        // Liberar conexión si fue obtenida
        if (connection) connection.release();
    }
};

const showUser = async() =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
        text: `select *
            from usuario xu, persona xpe, personal xpl, direccion xdi, domicilio xdo 
            where xu.id_personal=xpl.id_personal and xpl.id_persona=xpe.id_persona 
            and xpe.id_persona=xdo.id_persona and xdo.id_domicilio=xdi.id_direccion 
            and xu.estado_usuario=1;`,
        }

        const [result] = await connection.query(query.text);
        return result;
    } catch (error) {
        error.source = 'model';
        throw error;
    } finally{
       if (connection) connection.release();
    }  
}

const showUserById = async({ id_usuario }) =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
            text: `select *
            from usuario xu, persona xpe, personal xpl, domicilio xdo 
            where xu.id_usuario=? and xu.id_personal=xpl.id_personal and 
            xpl.id_persona=xpe.id_persona and xpe.id_persona=xdo.id_persona
            and xu.estado_usuario=1;`,
            values: [id_usuario]
        }

        const [result] = await connection.query(query.text, query.values);
        console.log("mi result:",result)
        return result;
    } catch (error) {
        error.source = 'model';
        throw error;
    } finally{
       if (connection) connection.release();
    }  
}

const verifyIfExistUser = async({correo, nombre_usuario}) =>{
    let connection;
    try {
        connection = await pool.getConnection()
        const query = {
            text: `select *
                from usuario  
                where correo = ? and nombre_usuario = ? and estado_usuario=1;`,
            values: [correo, nombre_usuario]
        }

        const [result] = await connection.query(query.text, query.values);
        return result;

    } catch (error) {
        error.source = 'model';
        throw error;
    } finally {
        if (connection) connection.release();
    } 
}

const verifyIfExistedUser = async({correo, nombre_usuario}) =>{
    let connection;
    try {
        connection = await pool.getConnection()
        const query = {
            text: `select *
                from usuario  
                where correo = ? and nombre_usuario = ? and estado_usuario=0;`,
            values: [correo, nombre_usuario]
        }

        const [result] = await connection.query(query.text, query.values);
        return result;

    } catch (error) {
        error.source = 'model';
        throw error;

    } finally {
        if (connection) connection.release();
    } 
}

export const deleteUser = async({id_usuario}) =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
            text: 'update usuario set estado_usuario = 0 where id_usuario = ?',
            values:[id_usuario]
        }
        const [result] = await connection.query(query.text, query.values)  
        return result;
    } catch (error) {
        error.source = 'model';
        throw error;
    } finally{
       if (connection) connection.release();
    }  
}

export const updateUser = async({nombre_usuario, correo, clave, perfil, id_usuario })=>{
    let connection;
    try {
        connection = await pool.getConnection();
        // Iniciar transacción
        await connection.beginTransaction();

        let [resultDirection] = await connection.query(`update usuario
                    set nombre_usuario=ifnull(?, nombre_usuario),
                    correo=ifnull(?, correo),
                    clave=ifnull(?, clave),
                    perfil=ifnull(?, perfil)
                    where id_usuario=?;`,
                    [nombre_usuario, correo, clave, perfil, id_usuario]);

        connection.commit();
        return {resultDirection};

    }catch (error) {
        if (connection) await connection.rollback(); // Revierte todo si algo falla
        error.source = 'model';
        throw error;
    } finally {
        // Liberar conexión si fue obtenida
        if (connection) connection.release();
    } 
}

export const reactivateUser = async({id_usuario})=>{
    let connection;
    try {
        connection = await pool.getConnection();
         const query = {
            text: `update usuario 
                    set estado_usuario=1
                    where id_usuario=?;`,
            values:[id_usuario]
        }
        let [result] = await connection.query(query.text, query.values)
        console.log("hecho model", result )
        return result;
    } catch (error) {
        error.source = 'model';
        throw error;
    } finally{
        if (connection) connection.release();
    } 
}

const login = async({correo, clave}) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
            text: `select correo, clave from usuario where correo = ? and clave = ?;`,
            values: [correo, clave]
        }
        const [result] = await connection.query(query.text, query.values);
        return result;
    }
    catch (error) {
        error.source = 'model';
        throw error;
    } finally{
        if (connection) connection.release();
    }
    
}

const showUserByCorreo = async({correo}) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
            text: `select id_usuario, nombre_usuario, correo, clave, perfil, id_personal  
                from usuario 
                where correo = ?;`,
            values: [correo]
        }
        const [result] = await connection.query(query.text, query.values);
        return result;
    }
    catch (error) {
        error.source = 'model';
        throw error;
    } finally{
        if (connection) connection.release();
    }
    
}

const showUserByUsername = async({nombre_usuario}) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
            text: `select nombre_usuario 
                from usuario 
                where nombre_usuario=?;`,
            values: [nombre_usuario]
        }
        const resultado = await pool.query(query.text, query.values);
        return resultado[0];
    }
    catch (error) {
        error.source = 'model';
        throw error;
    } finally{
        if (connection) connection.release();
    }
}

export const userModel = {
    createUser,
    verifyIfExistUser,
    showUser,
    updateUser,
    deleteUser,
    verifyIfExistedUser,
    reactivateUser,
    showUserById,
    login,
    showUserByCorreo,
    showUserByUsername
}