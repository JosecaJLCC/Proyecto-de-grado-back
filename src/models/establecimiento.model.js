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

        let id_establecimiento = direction.insertId;

        const [establishment] = await connection.query(
            `INSERT INTO establecimiento 
            (id_establecimiento, nombre_establecimiento, tipo_establecimiento, fecha_creacion, id_microred) 
            VALUES (?, ?, ?, ?, ?)`, 
            [id_establecimiento, nombre_establecimiento, tipo_establecimiento, fecha_creacion, id_microred])

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

const showEstablishment = async() =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
        text: `select xm.nombre_microred, xm.red, xe.id_establecimiento,
                xe.nombre_establecimiento, xe.tipo_establecimiento, 
                DATE_FORMAT(xe.fecha_creacion, '%Y-%m-%d %H:%i:%s') AS fecha_creacion,
                xd.departamento, xd.municipio, xd.zona, xd.av_calle, xd.id_direccion
                from microred xm, establecimiento xe, direccion xd
                where xe.id_microred = xm.id_microred and xe.id_establecimiento = xd.id_direccion and xe.estado_establecimiento=1;`
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

export const deleteEstablishment = async({id_establecimiento}) =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
            text: `update establecimiento 
            set estado_establecimiento = 0 
            where id_establecimiento = ?`,
            values:[id_establecimiento]
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
                                nombre_establecimiento, tipo_establecimiento, id_microred, id_establecimiento})=>{
    let connection;
    try {
        connection = await pool.getConnection();
        // Iniciar transacción
        await connection.beginTransaction();
        let [resultDirection] = await connection.query(`update direccion 
                    set departamento=ifnull(?, departamento),
                    municipio=ifnull(?, municipio),
                    zona=ifnull(?, zona),
                    av_calle=ifnull(?, av_calle)
                    where id_direccion=?;`,
                    [departamento, municipio, zona, av_calle, id_establecimiento]);

        let [resultEstablishment] = await connection.query(`update establecimiento 
                    set nombre_establecimiento=ifnull(?, nombre_establecimiento),
                    tipo_establecimiento=ifnull(?, tipo_establecimiento),
                    id_microred = ifnull(?, id_microred)
                    where id_establecimiento=? and estado_establecimiento=1;`,
                    [nombre_establecimiento, tipo_establecimiento, id_microred, id_establecimiento ])
        
        connection.commit();
        return {resultEstablishment, resultDirection};
    }catch (error) {
        if (connection) await connection.rollback(); // Revierte todo si algo falla
        error.source = 'model';
        throw error;
    } finally {
        // Liberar conexión si fue obtenida
        if (connection) connection.release();
    } 
}

export const reactivateEstablishment = async({ departamento, municipio, zona, av_calle,
    nombre_establecimiento, tipo_establecimiento, id_microred, id_establecimiento})=>{
    let connection;
    try {
        connection = await pool.getConnection();
        
        let [resultEstablishment] = await connection.query( `update establecimiento 
                    set estado_establecimiento=1,
                    nombre_establecimiento=ifnull(?, nombre_establecimiento),
                    tipo_establecimiento=ifnull(?, tipo_establecimiento),
                    id_microred=ifnull(?, id_microred)
                    where id_establecimiento=?;`, 
                    [nombre_establecimiento, tipo_establecimiento, id_microred, id_establecimiento]);

         let [resultDirection] = await connection.query(`update direccion 
                    set departamento=ifnull(?, departamento),
                    municipio=ifnull(?, municipio),
                    zona=ifnull(?, zona),
                    av_calle=ifnull(?, av_calle)
                    where id_direccion=?;`,
                    [departamento, municipio, zona, av_calle, id_establecimiento]);                    
        return {resultEstablishment, resultDirection};
    } catch (error) {
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