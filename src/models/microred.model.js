/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from "../database.js";

const createMicroRed = async({id_microred, nombre_microred, red, fecha_creacion, id_director }) => {
    let connection;
    try {
        // Obtener conexión
        connection = await pool.getConnection();

        const query = {
            text: `INSERT INTO microred (id_microred, nombre_microred, red, fecha_creacion, id_director) 
                    VALUES (?, ?, ?, ?, ?)`,
            values: [id_microred, nombre_microred, red, fecha_creacion, id_director]
        };

        const [result] = await connection.query(query.text, query.values);

        return result;

    } catch (error) {
        error.source = 'model';
        throw error;
    } finally {
        // Liberar conexión si fue obtenida
        if (connection) connection.release();
    }
};

const showMicroRed = async() =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
            /* text: `select * from microred where estado_microred=1`, */
        text: `select xm.id_microred, xm.nombre_microred, xm.red, xm.id_director,
            DATE_FORMAT(xm.fecha_creacion, '%Y-%m-%d %H:%i:%s') AS fecha_creacion, 
            concat(xpe.paterno, " ", xpe.materno, " ", xpe.nombre) as nombres, 
            xpe.ci, xpe.extension 
            from microred xm, personal xpl, persona xpe 
            where estado_microred = 1 and xm.id_director=xpl.id_personal and xpl.id_persona=xpe.id_persona;`,
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

const verifyIfExistMicroRed = async({id_microred}) =>{
    let connection;
    try {
        connection = await pool.getConnection()
        const query = {
            text: `select * 
                from microred 
                where id_microred=? and estado_microred = 1;`,
            values: [id_microred]
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

const verifyIfExistedMicroRed = async({id_microred}) =>{
    let connection;
    try {
        connection = await pool.getConnection()
        const query = {
            text: `select * 
                from microred 
                where id_microred=? and estado_microred=0;`,
            values: [id_microred]
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

export const deleteMicroRed = async({id_microred}) =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
            text: `update microred 
            set estado_microred = 0
             where id_microred = ?`,
            values:[id_microred]
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

export const updateMicroRed = async({id_microred, nombre_microred, red, id_director})=>{
    let connection;
    try {
        connection = await pool.getConnection();
         const query = {
            text: `update microred 
                    set nombre_microred=ifnull(?, nombre_microred),
                    red=ifnull(?, red),
                    id_director=ifnull(?, id_director)
                    where id_microred=? and estado_microred=1;`,
            values:[nombre_microred, red, id_director, id_microred]
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

export const reactivateMicroRed = async({id_microred, nombre_microred, red, id_director})=>{
    let connection;
    try {
        connection = await pool.getConnection();
         const query = {
            text: `update microred 
                    set estado_microred=1,
                    nombre_microred=ifnull(?, nombre_microred),
                    red=ifnull(?, red),
                    id_director=ifnull(?, id_director)
                    where id_microred=?;`,
            values:[nombre_microred, red, id_director, id_microred]
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
export const directorMicroRed = async({ci_director})=>{
    let connection;
    try {
        connection = await pool.getConnection();
         const query = {
            text: `select xpl.id_personal
                from persona xpe, personal xpl
                where xpe.ci=? and xpe.id_persona=xpl.id_persona and xpl.estado_personal=1 `,
            values:[ci_director]
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

export const microredModel = {
    createMicroRed,
    verifyIfExistMicroRed,
    showMicroRed,
    updateMicroRed,
    deleteMicroRed,
    verifyIfExistedMicroRed,
    reactivateMicroRed,
    directorMicroRed
}