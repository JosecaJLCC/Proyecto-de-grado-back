/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from "../database.js";

const createStaff = async({ departamento, municipio, zona, av_calle, nro_puerta,
                            ci, extension, nombre, paterno, materno, nacionalidad,
                            estado_civil, nro_telf, sexo, fecha_nacimiento, 
                            id_profesion, id_area, cargo, nro_matricula, id_microred,
                            fecha_ingreso, fecha_creacion}) => {
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

        const [staff] = await connection.query(
            `INSERT INTO personal (cargo, nro_matricula, fecha_ingreso, fecha_creacion, id_area, id_profesion, id_persona, id_microred) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
            [ cargo, nro_matricula || null, fecha_ingreso || null, fecha_creacion, id_area, id_profesion, id_persona, id_microred || null])    

        // Confirmar si todo salió bien
        await connection.commit();

        return {person, direction, residence, staff};

    } catch (error) {
        if (connection) await connection.rollback(); // Revierte todo si algo falla
        error.source = 'model';
        throw error;
    } finally {
        // Liberar conexión si fue obtenida
        if (connection) connection.release();
    }
};

const showStaff = async() =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
        text: `select *
            from personal xpl, persona xpe, domicilio xdo, direccion xdi
            where xpl.id_persona=xpe.id_persona and xpe.id_persona = xdo.id_persona
            and xdo.id_domicilio = xdi.id_direccion
            and xpl.estado_personal=1;`,
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

const showStaffById = async({ id_personal }) =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
            text: `select *
                from personal xpl, persona xpe, domicilio xdo
                where xpl.id_personal=? and xpl.id_persona = xpe.id_persona and 
                xpe.id_persona = xdo.id_persona and xpl.estado_personal=1;`,
            values: [id_personal]
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

const verifyIfExistStaff = async({ci, extension}) =>{
    let connection;
    try {
        connection = await pool.getConnection()
        const query = {
            text: `select *
                from personal xpl, persona xpe
                where xpe.ci=? and xpe.extension=? and 
                xpl.id_persona=xpe.id_persona and xpl.estado_personal=1;`,
            values: [ci, extension]
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

const verifyIfExistedStaff = async({ci, extension}) =>{
    let connection;
    try {
        connection = await pool.getConnection()
        const query = {
            text: `select *
                from personal xpl, persona xpe
                where xpe.ci=? and xpe.extension=? and 
                xpl.id_persona=xpe.id_persona and xpl.estado_personal=0;`,
            values: [ci, extension]
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

export const deleteStaff = async({id_personal}) =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
            text: 'update personal set estado_personal = 0 where id_personal = ?',
            values:[id_personal]
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

export const updateStaff = async({departamento, municipio, zona, av_calle,
                                    id_direccion, nro_puerta, id_persona,
                            ci, extension, nombre, paterno, materno, nacionalidad,
                            estado_civil, nro_telf, sexo, fecha_nacimiento,
                            cargo, id_area, id_personal, id_microred})=>{
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
                    [departamento, municipio, zona, av_calle, id_direccion]);

        let [resultResidence] = await connection.query(`update domicilio 
                    set nro_puerta=ifnull(?, nro_puerta)
                    where id_domicilio=?;`,
                    [nro_puerta, id_direccion]);            

        let [resultPerson] = await connection.query(`update persona 
                    set ci=ifnull(?, ci),
                    extension=ifnull(?, extension),
                    nombre=ifnull(?, nombre),
                    paterno = ifnull(?, paterno),
                    materno = ifnull(?, materno),
                    nacionalidad = ifnull(?, nacionalidad),
                    estado_civil = ifnull(?, estado_civil),
                    nro_telf = ifnull(?, nro_telf),
                    sexo = ifnull(?, sexo),
                    fecha_nacimiento = ifnull(?, fecha_nacimiento)
                    where id_persona=?`,
                    [ci, extension, nombre, paterno, materno, nacionalidad,
                            estado_civil, nro_telf, sexo, fecha_nacimiento, id_persona ])
        
        let [resultStaff] = await connection.query(`update personal 
                    set cargo=ifnull(?, cargo),
                    id_area=ifnull(?, id_area),
                    id_microred=ifnull(?, id_microred)
                    where id_personal=? and estado_personal=1;`,
                    [cargo, id_area, id_personal, id_microred ])
        
        connection.commit();
        return {resultPerson, resultDirection, resultResidence, resultStaff};
    }catch (error) {
        if (connection) await connection.rollback(); // Revierte todo si algo falla
        error.source = 'model';
        throw error;
    } finally {
        // Liberar conexión si fue obtenida
        if (connection) connection.release();
    } 
}

export const reactivateStaff = async({id_personal})=>{
    let connection;
    try {
        connection = await pool.getConnection();
         const query = {
            text: `update personal 
                    set estado_personal=1
                    where id_personal=?;`,
            values:[id_personal]
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

export const staffModel = {
    createStaff,
    verifyIfExistStaff,
    showStaff,
    updateStaff,
    deleteStaff,
    verifyIfExistedStaff,
    reactivateStaff,
    showStaffById
}