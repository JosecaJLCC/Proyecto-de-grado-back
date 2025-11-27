/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from "../database.js";

const verifyDiagnosis = async({nombre_diagnostico}) =>{
    let connection;
    try {
        connection=await pool.getConnection();
        const query = {
            text:`select * 
            from diagnostico
            where nombre_diagnostico = ?`,
            values: [nombre_diagnostico]
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

const createDiagnosis=async(diagnostico)=>{
    let connection;
    const {nombre_diagnostico, descripcion} = diagnostico;
    try {
        connection=await pool.getConnection();
        const query = {
            text:`insert into diagnostico(nombre_diagnostico, descripcion) 
                    values(?, ?)`,
            values: [nombre_diagnostico, descripcion]
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

const showDiagnosis = async() =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
        text: `select *
            from diagnostico;`,
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


export const diagnosisModel = {
    createDiagnosis,
    showDiagnosis,
    verifyDiagnosis,
}