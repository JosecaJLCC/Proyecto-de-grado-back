/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from "../database.js";

const createPerson = async({ departamento, municipio, zona, av_calle, nro_puerta,
                            ci, extension, nombre, paterno, materno, nacionalidad,
                            estado_civil, nro_telf, sexo, fecha_nacimiento}) => {
    let connection;
    try {
        // Obtener conexión
        connection = await pool.getConnection();
        // Iniciar transacción
        await connection.beginTransaction();

            const [person] = await connection.query(
            `INSERT INTO persona (ci, extension, nombre, paterno, materno, nacionalidad, estado_civil, 
                            nro_telf, sexo, fecha_nacimiento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [ci, extension, nombre, paterno, materno, nacionalidad,
                            estado_civil, nro_telf, sexo, fecha_nacimiento])
        let id_persona = person.insertId;

        const [direction] = await connection.query(
            `INSERT INTO direccion (departamento, municipio, zona, av_calle) VALUES (?, ?, ?, ?)`, 
            [departamento, municipio, zona, av_calle])
        let id_domicilio = direction.insertId;

        const [residence] = await connection.query(
            `INSERT INTO domicilio (id_domicilio, nro_puerta, id_persona) VALUES (?, ?, ?)`, 
            [id_domicilio, nro_puerta, id_persona])

        // Confirmar si todo salió bien
        await connection.commit();

        return [person, direction, residence];

    } catch (error) {
        if (connection) await connection.rollback(); // Revierte todo si algo falla
        error.source = 'model';
        throw error;
    } finally {
        // Liberar conexión si fue obtenida
        if (connection) connection.release();
    }
};

const showPerson = async() =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
        text: `select *
                from persona xp, direccion xdi, domicilio xdo
                where xp.id_persona = xdo.id_persona and xdo.id_domicilio = xdi.id_direccion;`
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

const verifyIfExistPerson = async({codigo_establecimiento}) =>{
    let connection;
    try {
        connection = await pool.getConnection()
        const query = {
            text: `select * from establecimiento where codigo_establecimiento=? and estado_establecimiento = 1;`,
            values: [codigo_establecimiento]
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

const verifyIfExistedPerson = async({codigo_establecimiento}) =>{
    let connection;
    try {
        connection = await pool.getConnection()
        const query = {
            text: `select * from establecimiento where codigo_establecimiento=? and estado_establecimiento=0;`,
            values: [codigo_establecimiento]
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

export const deletePerson = async({id_establecimiento}) =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
            text: 'update establecimiento set estado_establecimiento = 0 where id_establecimiento = ?',
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

export const updatePerson = async({departamento, municipio, zona, av_calle, 
                                nombre_establecimiento, tipo_establecimiento, 
                                codigo_establecimiento, id_microred, id_establecimiento})=>{
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

        let [resultPerson] = await connection.query(`update establecimiento 
                    set nombre_establecimiento=ifnull(?, nombre_establecimiento),
                    tipo_establecimiento=ifnull(?, tipo_establecimiento),
                    codigo_establecimiento=ifnull(?, codigo_establecimiento),
                    id_microred = ifnull(?, id_microred)
                    where id_establecimiento=? and estado_establecimiento=1;`,
                    [nombre_establecimiento, tipo_establecimiento, codigo_establecimiento, id_microred, id_establecimiento ])
        
        connection.commit();
        return {resultPerson, resultDirection};
    }catch (error) {
        if (connection) await connection.rollback(); // Revierte todo si algo falla
        error.source = 'model';
        throw error;
    } finally {
        // Liberar conexión si fue obtenida
        if (connection) connection.release();
    } 
}

export const reactivatePerson = async({id_establecimiento})=>{
    let connection;
    try {
        connection = await pool.getConnection();
         const query = {
            text: `update establecimiento 
                    set estado_establecimiento=1
                    where id_establecimiento=?;`,
            values:[id_establecimiento]
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

export const PersonModel = {
    createPerson,
    verifyIfExistPerson,
    showPerson,
    updatePerson,
    deletePerson,
    verifyIfExistedPerson,
    reactivatePerson
}