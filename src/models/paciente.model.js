/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from "../database.js";

const createPatient = async({ departamento, municipio, zona, av_calle, nro_puerta,
                            ci, extension, nombre, paterno, materno, nacionalidad,
                            estado_civil, nro_telf, sexo, fecha_nacimiento, fecha_creacion,
                            nombre_carpeta, color, id_microred}) => {
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

        const [folder] = await connection.query(
            `INSERT INTO carpeta (nombre_carpeta, color) VALUES (?, ?)`, 
            [nombre_carpeta, color])
        
        let id_carpeta = folder.insertId;

        const [patient] = await connection.query(
            `INSERT INTO paciente (id_persona, id_carpeta, id_microred, fecha_creacion) VALUES (?, ?, ?, ?)`, 
            [ id_persona, id_carpeta, id_microred, fecha_creacion ])    

        // Confirmar si todo salió bien
        await connection.commit();

        return {person, direction, residence, patient, folder};

    } catch (error) {
        if (connection) await connection.rollback(); // Revierte todo si algo falla
        error.source = 'model';
        throw error;
    } finally {
        // Liberar conexión si fue obtenida
        if (connection) connection.release();
    }
};

const showPatient = async() =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
        text: `select xpa.id_paciente, concat(xpe.ci, " ", xpe.extension) as ci,
                concat(xpe.paterno," ",xpe.materno," ",xpe.nombre) as nombres,
                xpa.id_microred, xm.nombre_microred
            from persona xpe, paciente xpa, direccion xdi, domicilio xdo, microred xm 
            where xpa.id_persona=xpe.id_persona and xpe.id_persona=xdo.id_persona
            and xdo.id_domicilio=xdi.id_direccion and xpa.id_microred=xm.id_microred and xpa.estado_paciente=1;`,
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

const createAttention = async({id_usuario, id_paciente, id_establecimiento}) =>{
    const query = {
        text: `insert into atencion(id_usuario, id_paciente, id_establecimiento, fecha_atencion) 
                values(?,?,?,now())`,
        values: [id_usuario, id_paciente, id_establecimiento]
    }

    const resultado = await pool.query(query.text, query.values);
    return resultado[0];
}

const showAttention = async() =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
        text: `select xpa.id_paciente, concat(xpe.ci, " ", xpe.extension) as ci,
                concat(xpe.paterno," ",xpe.materno," ",xpe.nombre) as nombres,
                xpa.id_microred, xm.nombre_microred
            from persona xpe, paciente xpa, direccion xdi, domicilio xdo, microred xm 
            where xpa.id_persona=xpe.id_persona and xpe.id_persona=xdo.id_persona
            and xdo.id_domicilio=xdi.id_direccion and xpa.id_microred=xm.id_microred and xpa.estado_paciente=1;`,
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

const showPatientById = async({id_paciente}) =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
            text: `select *
                from paciente xpa, persona xpe, domicilio xd
                where xpa.id_paciente=? and xpa.id_persona = xpe.id_persona and 
                xpe.id_persona = xd.id_persona and xpa.estado_paciente=1;`,
            values: [id_paciente]
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

const verifyIfExistPatient = async({ci, extension}) =>{
    let connection;
    try {
        connection = await pool.getConnection()
        const query = {
            text: `select xpe.id_persona, xpa.id_paciente
                from persona xpe, paciente xpa
                where  xpe.ci=? and xpe.extension=? and xpe.id_persona=xpa.id_persona and xpa.estado_paciente = 1;`,
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

const verifyIfExistedPatient = async({ci, extension}) =>{
    let connection;
    try {
        connection = await pool.getConnection()
        const query = {
            text: `select xpe.id_persona, xpa.id_paciente
                from persona xpe, paciente xpa
                where  xpe.ci=? and xpe.extension=? and xpe.id_persona=xpa.id_persona and xpa.estado_paciente = 0;`,
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

export const deletePatient = async({id_paciente}) =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
            text: 'update paciente set estado_paciente = 0 where id_paciente = ?',
            values:[id_paciente]
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

export const updatePatient = async({departamento, municipio, zona, av_calle,
                                    id_direccion, nro_puerta, id_persona, id_domicilio,
                            ci, extension, nombre, paterno, materno, nacionalidad,
                            estado_civil, nro_telf, sexo, fecha_nacimiento,
                            tipo_sangre, peso, estatura, id_paciente})=>{
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
                    [nro_puerta, id_domicilio]);            

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
        
        let [resultPatient] = await connection.query(`update paciente 
                    set tipo_sangre=ifnull(?, tipo_sangre),
                    peso=ifnull(?, peso),
                    estatura=ifnull(?, estatura)
                    where id_paciente=? and estado_paciente=1;`,
                    [tipo_sangre, peso, estatura, id_paciente ])
        
        connection.commit();
        return {resultPerson, resultDirection, resultResidence, resultPatient};
    }catch (error) {
        if (connection) await connection.rollback(); // Revierte todo si algo falla
        error.source = 'model';
        throw error;
    } finally {
        // Liberar conexión si fue obtenida
        if (connection) connection.release();
    } 
}

export const reactivatePatient = async({id_paciente})=>{
    let connection;
    try {
        connection = await pool.getConnection();
         const query = {
            text: `update paciente 
                    set estado_paciente=1
                    where id_paciente=?;`,
            values:[id_paciente]
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

export const patientModel = {
    createPatient,
    verifyIfExistPatient,
    showPatient,
    updatePatient,
    deletePatient,
    verifyIfExistedPatient,
    reactivatePatient,
    showPatientById,
    createAttention,
    showAttention
}