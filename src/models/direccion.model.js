/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from "../database.js";

const createDirection = async({ departamento, municipio, zona, av_calle }) => {
    let connection;
    try {
        // Obtener conexión
        connection = await pool.getConnection();

        const query = {
            text: `INSERT INTO direccion (departamento, municipio, zona, av_calle) VALUES (?, ?, ?, ?)`,
            values: [departamento, municipio, zona, av_calle]
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

const showDirection = async() =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
        text: `select * from direccion;`, 
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

export const updateDirection = async({id_direccion, departamento, municipio, zona, av_calle})=>{
    let connection;
    try {
        connection = await pool.getConnection();
         const query = {
            text: `update direccion 
                    set departamento=ifnull(?, departamento),
                    municipio=ifnull(?, municipio),
                    zona=ifnull(?, zona),
                    av_calle=ifnull(?, av_calle)
                    where id_direccion=?;`,
            values:[departamento, municipio, zona, av_calle, id_direccion]
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

export const directionModel = {
    createDirection,
    showDirection,
    updateDirection
}