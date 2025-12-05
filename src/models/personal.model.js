/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from "../database.js";

const createStaff = async({ departamento, municipio, zona, av_calle, nro_puerta,
                            ci, nombre, paterno, materno, nacionalidad,
                            estado_civil, nro_telf, sexo, fecha_nacimiento, 
                            id_profesion, nombre_profesion, id_area, nombre_area, cargo,
                             nro_matricula, id_microred, fecha_ingreso, fecha_creacion}) => {
    let connection;
    try {
        // Obtener conexión
        connection = await pool.getConnection();
        // Iniciar transacción
        await connection.beginTransaction();

        const [person] = await connection.query(
        `INSERT INTO persona (ci, nombre, paterno, materno, nacionalidad, estado_civil, 
                        nro_telf, sexo, fecha_nacimiento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
        [ci, nombre, paterno, materno, nacionalidad,
                        estado_civil, nro_telf, sexo, fecha_nacimiento])
        let id_persona = person.insertId;

        const [direction] = await connection.query(
            `INSERT INTO direccion (departamento, municipio, zona, av_calle) VALUES (?, ?, ?, ?)`, 
            [departamento, municipio, zona, av_calle])
        let id = direction.insertId;

        const [residence] = await connection.query(
            `INSERT INTO domicilio (id, nro_puerta, id_persona) VALUES (?, ?, ?)`, 
            [id, nro_puerta, id_persona])
        if(!id_profesion){
            const [profession] = await connection.query(
                `insert into profesion (nombre_profesion) values(?)`,
                [nombre_profesion]
            )
            id_profesion=profession.insertId;
        }
        if(!id_area){
            const [workArea] = await connection.query(
                `insert into area_trabajo (nombre_area) values(?)`,
                [nombre_area]
            )
            id_area=workArea.insertId;
        }
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

const showStaff = async({estado_personal}) =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
        text: `select xpl.id,
                xpe.ci,
                concat(xpe.paterno," ",xpe.materno," ",xpe.nombre) as nombres,
                xpe.nacionalidad, 
                DATE_FORMAT(xpe.fecha_nacimiento, '%Y-%m-%d %H:%i:%s') AS fecha_nacimiento,
                xpe.sexo, xpe.estado_civil, xpe.nro_telf,
                xdi.departamento, xdi.municipio, xdi.zona, xdi.av_calle, xdo.nro_puerta,
                xpl.cargo, 
                DATE_FORMAT(xpl.fecha_creacion, '%Y-%m-%d %H:%i:%s') AS fecha_creacion,
                DATE_FORMAT(xpl.fecha_ingreso, '%Y-%m-%d %H:%i:%s') AS fecha_ingreso,
                xpl.nro_matricula, 
                xar.nombre_area, xpr.nombre_profesion
            from personal xpl, persona xpe, domicilio xdo, direccion xdi, area_trabajo xar, profesion xpr
            where xpl.id_persona=xpe.id and xpl.id_area=xar.id and 
            xpl.id_profesion=xpr.id and xpe.id = xdo.id_persona and 
            xdo.id = xdi.id and xpl.estado_personal=?
            order by nombres asc;`,
            values:[estado_personal]
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

const showWorkArea = async() =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
        text: `select *
            from area_trabajo`,
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

const showProfession = async() =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
        text: `select *
            from profesion`,
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

const showPosition = async() =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
        text: `select distinct cargo
            from personal
            where estado_personal=1`,
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

const showStaffById = async({ id }) =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
            text: `select xdo.id as id_direccion, xpe.id as id_persona
                from personal xpl, persona xpe, domicilio xdo
                where xpl.id=? and xpl.id_persona = xpe.id and 
                xpe.id = xdo.id_persona and xpl.estado_personal=1;`,
            values: [id]
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

const verifyIfExistStaff = async({ci}) =>{
    let connection;
    try {
        connection = await pool.getConnection()
        const query = {
            text: `select *
                from personal xpl, persona xpe
                where xpe.ci=? and 
                xpl.id_persona=xpe.id and xpl.estado_personal=1;`,
            values: [ci]
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

const verifyIfExistedStaff = async({ci}) =>{
    let connection;
    try {
        connection = await pool.getConnection()
        const query = {
            text: `select *
                from personal xpl, persona xpe, domicilio xdo
                where xpe.ci=? and 
                xpl.id_persona=xpe.id and 
                xpe.id=xdo.id_persona and xpl.estado_personal=0;`,
            values: [ci]
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

export const deleteStaff = async({id}) =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
            text: 'update personal set estado_personal = 0 where id = ?',
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

export const updateStaff = async({id, id_persona, id_direccion, id_microred, 
                                    departamento, municipio, 
                                    zona, av_calle, nro_puerta, ci, nombre, paterno, 
                                    materno, nacionalidad, estado_civil, nro_telf, sexo, 
                                    fecha_nacimiento, cargo, id_area, nombre_area, id_profesion, 
                                    nombre_profesion, nro_matricula, fecha_ingreso})=>{
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
                    where id=?;`,
                    [departamento, municipio, zona, av_calle, id_direccion]);

        let [resultResidence] = await connection.query(`update domicilio 
                    set nro_puerta=ifnull(?, nro_puerta)
                    where id=?;`,
                    [nro_puerta, id_direccion]);            

        let [resultPerson] = await connection.query(`update persona 
                    set ci=ifnull(?, ci),
                    nombre=ifnull(?, nombre),
                    paterno = ifnull(?, paterno),
                    materno = ifnull(?, materno),
                    nacionalidad = ifnull(?, nacionalidad),
                    estado_civil = ifnull(?, estado_civil),
                    nro_telf = ifnull(?, nro_telf),
                    sexo = ifnull(?, sexo),
                    fecha_nacimiento = ifnull(?, fecha_nacimiento)
                    where id=?`,
                    [ci, nombre, paterno, materno, nacionalidad,
                            estado_civil, nro_telf, sexo, fecha_nacimiento, id_persona])
        if(!id_profesion && nombre_profesion){
            const [profession] = await connection.query(
                `insert into profesion (nombre_profesion) values(?)`,
                [nombre_profesion]
            )
            id_profesion=profession.insertId;
        }

        if(!id_area && nombre_area){
            const [workArea] = await connection.query(
                `insert into area_trabajo (nombre_area) values(?)`,
                [nombre_area]
            )
            id_area=workArea.insertId;
        }

        let [resultStaff] = await connection.query(`update personal 
                    set cargo=ifnull(?, cargo),
                    id_area=ifnull(?, id_area),
                    id_profesion=ifnull(?, id_profesion),
                    id_microred=ifnull(?, id_microred),
                    nro_matricula=ifnull(?, nro_matricula),
                    fecha_ingreso=ifnull(?, fecha_ingreso)
                    where id=? and estado_personal=1;`,
                    [cargo, id_area, id_profesion, id_microred, nro_matricula, fecha_ingreso, id])
        
        await connection.commit();
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

export const reactivateStaff = async({id})=>{
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        let [resultStaff] = await connection.query(`update personal 
                    set estado_personal=1
                    where id=?;`,
                    [id])
        await connection.commit();
        return {resultStaff};
    } catch (error) {
        if (connection) await connection.rollback(); // Revierte todo si algo falla
        error.source = 'model';
        throw error;
    } finally{
        if (connection) connection.release();
    } 
}

export const staffModel = {
    createStaff,
    showStaff,
    updateStaff,
    deleteStaff,
    reactivateStaff,
    verifyIfExistStaff,
    verifyIfExistedStaff,
    showWorkArea,
    showProfession,
    showPosition,
    showStaffById
}