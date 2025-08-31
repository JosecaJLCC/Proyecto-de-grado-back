/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from "../database.js";

const createMicroRed = async({ nombre_microred, red, fecha_creacion, id_director }) => {
    let connection;
    try {
        // Obtener conexión
        connection = await pool.getConnection();

        const query = {
            text: `INSERT INTO microred (nombre_microred, red, fecha_creacion, id_director) VALUES (?, ?, ?, ?)`,
            values: [nombre_microred, red, fecha_creacion, id_director]
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
        text: `select * from microred where estado_microred = 1;`, 
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

const verifyIfExistMicroRed = async({nombre_microred}) =>{
    let connection;
    try {
        connection = await pool.getConnection()
        const query = {
            text: `select * 
                from microred 
                where nombre_microred=? and estado_microred = 1;`,
            values: [nombre_microred]
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

const verifyIfExistedMicroRed = async({nombre_microred}) =>{
    let connection;
    try {
        connection = await pool.getConnection()
        const query = {
            text: `select * 
                from microred 
                where nombre_microred=? and estado_microred=0;`,
            values: [nombre_microred]
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
            text: 'update microred set estado_microred = 0 where id_microred = ?',
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

export const updateMicroRed = async({id_microred, nombre_microred, red})=>{
    let connection;
    try {
        connection = await pool.getConnection();
         const query = {
            text: `update microred 
                    set nombre_microred=ifnull(?, nombre_microred),
                    red=ifnull(?, red)
                    where id_microred=? and estado_microred=1;`,
            values:[nombre_microred, red, id_microred]
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

export const reactivateMicroRed = async({id_microred})=>{
    let connection;
    try {
        connection = await pool.getConnection();
         const query = {
            text: `update microred 
                    set estado_microred=1
                    where id_microred=?;`,
            values:[id_microred]
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

export const microredModel = {
    createMicroRed,
    verifyIfExistMicroRed,
    showMicroRed,
    updateMicroRed,
    deleteMicroRed,
    verifyIfExistedMicroRed,
    reactivateMicroRed
}