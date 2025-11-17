/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from "../database.js";

const createEstablishment = async({ departamento, municipio, zona, av_calle, 
                                nombre_establecimiento, tipo_establecimiento, 
                                fecha_creacion, id_microred }) => {
    let connection;
    console.log("mi fecha de creacion model_: ", fecha_creacion)
    try {
        // Obtener conexión
        connection = await pool.getConnection();
        // Iniciar transacción
        await connection.beginTransaction();
        //Empezamos a crear a la dirección
        const [direction] = await connection.query(
            `INSERT INTO direccion (departamento, municipio, zona, av_calle) VALUES (?, ?, ?, ?)`, 
            [departamento, municipio, zona, av_calle])

        let id = direction.insertId;

        const [establishment] = await connection.query(
            `INSERT INTO establecimiento 
            (id, nombre_establecimiento, tipo_establecimiento, fecha_creacion, id_microred) 
            VALUES (?, ?, ?, ?, ?)`, 
            [id, nombre_establecimiento, tipo_establecimiento, fecha_creacion, id_microred])

        // Confirmar si todo salió bien
        await connection.commit();

        return [direction, establishment];

    } catch (error) {
        if (connection) await connection.rollback(); // Revierte todo si algo falla
        error.source = 'model';
        throw error;
    } finally {
        // Liberar conexión si fue obtenida
        if (connection) connection.release();
    }
};

const showEstablishment = async({estado_establecimiento}) =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
        text: `select xe.id, 
                xm.nombre_microred, 
                xm.red, 
                xe.nombre_establecimiento, 
                xe.tipo_establecimiento, 
                DATE_FORMAT(xe.fecha_creacion, '%Y-%m-%d %H:%i:%s') AS fecha_creacion,
                xd.departamento, xd.municipio, xd.zona, xd.av_calle, xd.id
                from microred xm, establecimiento xe, direccion xd
                where xe.id_microred = xm.codigo and xe.id = xd.id 
                and xe.estado_establecimiento=? and xm.estado_microred=1;`,
                values:[estado_establecimiento]
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

const verifyIfExistEstablishment = async({nombre_establecimiento}) =>{
    let connection;
    try {
        connection = await pool.getConnection()
        const query = {
            text: `select * from establecimiento 
                where nombre_establecimiento=? and estado_establecimiento=1;`,
            values: [nombre_establecimiento]
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

const verifyIfExistedEstablishment = async({nombre_establecimiento}) =>{
    let connection;
    try {
        connection = await pool.getConnection()
        const query = {
            text: `select * from establecimiento 
                where nombre_establecimiento=? and estado_establecimiento=0;`,
            values: [nombre_establecimiento]
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

export const deleteEstablishment = async({id}) =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
            text: `update establecimiento 
            set estado_establecimiento = 0 
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

export const updateEstablishment = async({departamento, municipio, zona, av_calle, 
                                nombre_establecimiento, tipo_establecimiento, 
                                id_microred, id})=>{
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        let [resultDirection] = await connection.query(`update direccion 
                    set departamento=ifnull(?, departamento),
                    municipio=ifnull(?, municipio),
                    zona=ifnull(?, zona),
                    av_calle=ifnull(?, av_calle)
                    where id=?;`,
                    [departamento, municipio, zona, av_calle, id]);
        let [resultEstablishment] = await connection.query(`update establecimiento 
                    set nombre_establecimiento=ifnull(?, nombre_establecimiento),
                    tipo_establecimiento=ifnull(?, tipo_establecimiento),
                    id_microred = ifnull(?, id_microred)
                    where id=? and estado_establecimiento=1;`,
                    [nombre_establecimiento, tipo_establecimiento, id_microred, id ])
        await connection.commit();
        return {resultEstablishment, resultDirection};
    }catch (error) {
        if (connection) await connection.rollback(); // Revierte todo si algo falla
        error.source = 'model';
        throw error;
    } finally {
        if (connection) connection.release();
    } 
}

export const reactivateEstablishment = async({id})=>{
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();                   
        let [resultEstablishment] = await connection.query( `update establecimiento 
                    set estado_establecimiento=1
                    where id=?;`, 
                    [id]);
        await connection.commit(); 
        return {resultEstablishment};
    } catch (error) {
        if (connection) await connection.rollback();
        error.source = 'model';
        throw error;
    } finally{
        if (connection) connection.release();
    } 
}

export const establishmentModel = {
    createEstablishment,
    verifyIfExistEstablishment,
    showEstablishment,
    updateEstablishment,
    deleteEstablishment,
    verifyIfExistedEstablishment,
    reactivateEstablishment
}