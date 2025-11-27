/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from "../database.js";
import { fechaHoraBolivia } from "../utils/fechaBolivia.js";
const verifyMedication = async(nombre_medicamento) =>{
    let connection;
    try {
        connection=await pool.getConnection();
        const query = {
            text:`select * 
            from medicamento
            where nombre_medicamento = ?`,
            values: [nombre_medicamento]
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

const createMedicalDescription=async()=>{
    let connection;
    let fecha_emision=fechaHoraBolivia();
    try{
        connection=await pool.getConnection();
        const query={
            text: `insert into receta(fecha_emision) values(?)`,
            values:[fecha_emision]
        }
        const [result]=await connection.query(query.text, query.values)
        return result
    }   
    catch (error) {
        error.source = 'model';
        throw error;
    } finally{
       if (connection) connection.release();
    } 
}

const createMedication=async(id_receta, receta)=>{
    let connection;
    let verifyMyMedication=""
    let id_medicamento=0;
    console.log("mi receta: ",receta)
    try {
        connection=await pool.getConnection();
       for(let item of receta){
        console.log("item: ", item)
        verifyMyMedication=await verifyMedication(item.nombre_medicamento);
        if(!verifyMyMedication.length){
            let [resultMedication]=await connection.query(
                    `insert into medicamento(nombre_medicamento) values(?)`,
                    [item.nombre_medicamento]
                    )
            id_medicamento=resultMedication.insertId;
        }
        else{
            id_medicamento=verifyMedication.id;
        }    
        let [resultMedicalDescription]=await connection.query(
                `insert into receta_detalle
                (id_medicamento, id_receta, indicacion, cantidad_recetada, cantidad_dispensada)
                    values(?, ?, ?, ?, ?)`,
                [id_medicamento, id_receta, item.indicacion, item.cantidad_recetada, item.cantidad_dispensada || null]
                )
        }
        return;
    } catch (error) {
        error.source = 'model';
        throw error;
    } finally{
       if (connection) connection.release();
    }  
}

const showMedication = async() =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
        text: `select *
            from medicamento;`,
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

export const medicationModel = {
    createMedication,
    showMedication,
    verifyMedication,
    createMedicalDescription
}