/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from "../database.js";

const createUser = async({ correo, clave, perfil, fecha_creacion, id_personal, id_rol }) => {
    let connection;
    try {
        // Obtener conexión
        connection = await pool.getConnection();
        // Iniciar transacción
        await connection.beginTransaction();

        const [user] = await connection.query(
        `INSERT INTO usuario (correo, clave, perfil, fecha_creacion, id_personal) 
                    VALUES (?, ?, ?, ?, ?)`, 
        [correo, clave, perfil, fecha_creacion, id_personal])
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

const verifyIfExistUser = async({correo}) =>{
    let connection;
    try {
        connection = await pool.getConnection()
        const query = {
            text: `select *
                from usuario  
                where correo = ? and estado_usuario=1;`,
            values: [correo]
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

const verifyIfExistedUser = async({correo}) =>{
    let connection;
    try {
        connection = await pool.getConnection()
        const query = {
            text: `select *
                from usuario  
                where correo = ? and estado_usuario=0;`,
            values: [correo]
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

export const updateUser = async({correo, clave, perfil, id_usuario })=>{
    let connection;
    try {
        connection = await pool.getConnection();
        // Iniciar transacción
        await connection.beginTransaction();

        let [resultDirection] = await connection.query(`update usuario
                    set correo=ifnull(?, correo),
                    clave=ifnull(?, clave),
                    perfil=ifnull(?, perfil)
                    where id_usuario=?;`,
                    [correo, clave, perfil, id_usuario]);

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

export const chooseEstablishment = async({id_usuario})=>{
    let connection;
    try {
        connection = await pool.getConnection();
         const query = {
            text: `select xe.nombre_establecimiento, xe.id_establecimiento 
                    from usuario xu, personal xpl, establecimiento xe
                    where xu.id_usuario=? and xu.id_personal=xpl.id_personal;`,
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

const login = async({correo}) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
            text: `SELECT xu.id_usuario, xu.correo, xu.clave, xu.perfil,
            xpl.id_personal, xur.id_usuario_rol, xr.nombre_rol, xr.id_rol
        FROM usuario xu, personal xpl, usuario_rol xur, rol xr 

        WHERE xu.correo = ? and xu.id_personal = xpl.id_personal
        AND xu.id_usuario=xur.id_usuario and xur.id_rol=xr.id_rol and xu.estado_usuario = 1`,
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

const setSession = async({id_usuario_rol, id_establecimiento}) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
            text: `update usuario_rol
                    set id_establecimiento=ifnull(?, id_establecimiento)
                    where id_usuario_rol=? and estado_usuario=1;`,
            values: [id_establecimiento, id_usuario_rol]
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

const logLogin = async({id_usuario_rol, fecha_log}) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
            text: `insert into registro_log(id_usuario_rol, fecha_log) 
                values(?, ?);`,
            values: [id_usuario_rol, fecha_log]
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
            text: `select id_usuario, correo, clave, perfil, id_personal  
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


export const userModel = {
    createUser,
    verifyIfExistUser,
    showUser,
    updateUser,
    deleteUser,
    verifyIfExistedUser,
    reactivateUser,
    showUserById,
    setSession,
    login,
    logLogin,
    showUserByCorreo,
    chooseEstablishment

}