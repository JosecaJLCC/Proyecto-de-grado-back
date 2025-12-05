/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from "../database.js";

const createUser = async({ nombre_usuario, clave, perfil, fecha_creacion, id_personal, id_rol }) => {
    let connection;
    try {
        // Obtener conexión
        connection = await pool.getConnection();
        // Iniciar transacción
        await connection.beginTransaction();

        const [user] = await connection.query(
        `INSERT INTO usuario (nombre_usuario, clave, perfil, fecha_creacion, id_personal) 
                    VALUES (?, ?, ?, ?, ?)`, 
        [nombre_usuario, clave, perfil, fecha_creacion, id_personal])

        let id_usuario=user.insertId;
        const [rol_user] = await connection.query(
        `INSERT INTO usuario_rol (id_rol, id_usuario, fecha_creacion) 
                    VALUES (?, ?, ?)`, 
        [id_rol, id_usuario, fecha_creacion])
        // Confirmar si todo salió bien
        await connection.commit();
        return {user, rol_user};

    } catch (error) {
        if (connection) await connection.rollback(); // Revierte todo si algo falla
        error.source = 'model';
        throw error;
    } finally {
        // Liberar conexión si fue obtenida
        if (connection) connection.release();
    }
};

const showUser = async({estado_usuario}) =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
            text: `select xu.id, xu.perfil, xu.nombre_usuario, 
                DATE_FORMAT(xu.fecha_creacion, '%Y-%m-%d %H:%i:%s') AS fecha_creacion,
                xpe.ci, concat(xpe.paterno, " ", xpe.materno, " ", xpe.nombre) as nombres
                from usuario xu, persona xpe, personal xpl
                where xpl.id=xu.id_personal and xpe.id=xpl.id_persona
                and xu.estado_usuario=? and xpl.estado_personal=1
                order by nombres asc;`,
            values:[estado_usuario]
        }
        const [result] = await connection.query(query.text, query.values);
        return result;
    } catch (error) {
        error.source = 'model';
        throw error;
    } finally{
       if (connection) connection.release();
    }  
}

const showUserAuthor=async({id})=>{
    let connection;
    try {
        connection = await pool.getConnection()
        const query = {
            text: `SELECT 
                    (
                    SELECT CONCAT(xpe.nombre, ' ', xpe.paterno)
                    FROM persona xpe
                    JOIN personal xpl ON xpl.id_persona = xpe.id
                    JOIN usuario xu ON xu.id_personal = xpl.id
                    WHERE xu.id = atencion.id_usuario_rol_diagnostico
                    ) AS usuario_diagnostico,

                    (
                    SELECT CONCAT(xpe.nombre, ' ', xpe.paterno)
                    FROM persona xpe
                    JOIN personal xpl ON xpl.id_persona = xpe.id
                    JOIN usuario xu ON xu.id_personal = xpl.id
                    WHERE xu.id = atencion.id_usuario_rol_farmacia
                    ) AS usuario_farmacia

                    FROM atencion
                    WHERE atencion.id = ?;`,
            values: [id]
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

const verifyIfExistUser = async({ ci }) =>{
    let connection;
    try {
        connection = await pool.getConnection()
        const query = {
            text: `select xu.id, xpe.id as id_persona, xpl.id as id_personal  
                    from usuario xu, persona xpe, personal xpl
                    where xpe.ci = ? and xpl.id_persona=xpe.id and
                    xpl.id=xu.id_personal and estado_usuario=1;`,
            values: [ci]
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

const verifyIfExistedUser = async({ ci }) =>{
    let connection;
    try {
        connection = await pool.getConnection()
        const query = {
            text: `select xu.id, xpe.id as id_persona, xpl.id as id_personal  
                    from usuario xu, persona xpe, personal xpl
                    where xpe.ci = ? and xpl.id_persona=xpe.id and
                    xpl.id=xu.id_personal and estado_usuario=0;`,
            values: [ci]
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

export const deleteUser = async({id}) =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
            text: `update usuario 
                set estado_usuario = 0 
                where id = ?`,
            values:[id]
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

export const updateUser = async({clave, perfil, id})=>{
    let connection;
    try {
        connection = await pool.getConnection();
        // Iniciar transacción
        await connection.beginTransaction();
        let [resultUser] = await connection.query(`update usuario
                    set 
                    clave=ifnull(?, clave),
                    perfil=ifnull(?, perfil)
                    where id=?;`,
                    [clave, perfil, id]);
        await connection.commit();
        return {resultUser};
    }catch (error) {
        if (connection) await connection.rollback(); // Revierte todo si algo falla
        error.source = 'model';
        throw error;
    } finally {
        // Liberar conexión si fue obtenida
        if (connection) connection.release();
    } 
}

export const reactivateUser = async({id})=>{
    let connection;
    try {
        connection = await pool.getConnection();
         const query = {
            text: `update usuario 
                    set estado_usuario=1
                    where id=?;`,
            values:[id]
        }
        let [result] = await connection.query(query.text, query.values)
        
        return result;
    } catch (error) {
        error.source = 'model';
        throw error;
    } finally{
        if (connection) connection.release();
    } 
}

const login = async({nombre_usuario}) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
            text: `SELECT xu.id, xu.nombre_usuario, xu.clave, xu.perfil,
            xpl.id as id_personal, xur.id as id_usuario_rol, xr.nombre_rol, xr.id as id_rol
        FROM usuario xu, personal xpl, usuario_rol xur, rol xr 
        WHERE xu.nombre_usuario = ? and xpl.id=xu.id_personal
        AND xu.id=xur.id_usuario and xr.id=xur.id_rol and xu.estado_usuario = 1`,
            values: [nombre_usuario]
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

const setSession = async({id, id_establecimiento, fecha_log}) => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        const [resultSession] = await connection.query(
            `update usuario_rol
            set id_establecimiento=ifnull(?, id_establecimiento)
            where id=? and estado_usuario_rol=1;`, 
        [id_establecimiento, id])
        /* Se haran registro de los logs de los usuarios para casos de auditoria */
        const [resultLog] = await connection.query(
            `insert into registro_log(id_usuario_rol, fecha_log) 
            values(?, ?);`, 
        [id, fecha_log])

        await connection.commit();
        return {resultSession, resultLog};
    }
    catch (error) {
        error.source = 'model';
        throw error;
    } finally{
        if (connection) connection.release();
    }
}

const showUserByCi = async({ci}) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
            text: `select xpe.id as id_persona, xpl.id as id_personal,
                concat(xpe.nombre," ", xpe.paterno, " ", xpe.materno) as nombres  
                from persona xpe, personal xpl
                where xpe.ci = ? and xpe.id=xpl.id_persona and xpl.estado_personal=1;`,
            values: [ci]
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

export const userModel = {
    createUser,
    showUser,
    updateUser,
    deleteUser,
    reactivateUser,
    verifyIfExistUser,
    verifyIfExistedUser,
    setSession,
    login,
    showUserByCi,
    showUserAuthor
}