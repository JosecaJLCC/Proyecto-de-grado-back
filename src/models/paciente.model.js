/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from "../database.js";

const createPatient = async({ departamento, municipio, zona, av_calle, nro_puerta,
                            ci, nombre, paterno, materno, nacionalidad,
                            estado_civil, nro_telf, sexo, fecha_nacimiento, fecha_creacion,
                            id_carpeta, id_microred}) => {
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
        let id_domicilio = direction.insertId;

        const [residence] = await connection.query(
            `INSERT INTO domicilio (id, nro_puerta, id_persona) VALUES (?, ?, ?)`, 
            [id_domicilio, nro_puerta, id_persona])

        const [patient] = await connection.query(
            `INSERT INTO paciente (id_persona, id_carpeta, id_microred, fecha_creacion) VALUES (?, ?, ?, ?)`, 
            [ id_persona, id_carpeta, id_microred, fecha_creacion ])    
        // Confirmar si todo salió bien
        await connection.commit();
        return {person, direction, residence, patient};

    } catch (error) {
        if (connection) await connection.rollback(); // Revierte todo si algo falla
        error.source = 'model';
        throw error;
    } finally {
        // Liberar conexión si fue obtenida
        if (connection) connection.release();
    }
};

const showPatient = async({estado_paciente}) =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
        text: `select xpa.id, xpe.ci,
                concat(xpe.paterno," ",xpe.materno," ",xpe.nombre) as nombres,
                xpe.fecha_nacimiento,
                xpe.sexo, xpe.estado_civil, xpe.nro_telf, xpe.nacionalidad, 
                DATE_FORMAT(xpa.fecha_creacion, '%Y-%m-%d %H:%i:%s') AS fecha_creacion, 
                xdi.departamento, xdi.municipio, xdi.zona, xdi.av_calle, xdo.nro_puerta,
                xc.id as id_carpeta, xc.nombre_carpeta
            from persona xpe, paciente xpa, direccion xdi, domicilio xdo, carpeta xc 
            where xpa.id_persona=xpe.id and xpe.id=xdo.id_persona
            and xdo.id=xdi.id  and
            xpa.id_carpeta=xc.id and xpa.estado_paciente=?
            order by nombres asc;`,
            values:[estado_paciente]
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

const showHistoryPatient = async() =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
        text: `select xat.id, xat.id_paciente, xat.id_area, xpe.ci,
                concat(xpe.paterno," ",xpe.materno," ",xpe.nombre) as nombres,
                concat(xdi.zona,", ",xdi.av_calle,", ",xdo.nro_puerta) as domicilio,
                DATE_FORMAT(xpe.fecha_nacimiento, '%Y-%m-%d %H:%i:%s') AS fecha_nacimiento, xpe.sexo,
                xar.nombre_area, xe.nombre_establecimiento, xat.estado_atencion, xat.turno,
                DATE_FORMAT(xat.fecha_atencion, '%Y-%m-%d %H:%i:%s') AS fecha_atencion
            from persona xpe, paciente xpa, atencion xat, usuario_rol xur, 
                area_trabajo xar, establecimiento xe, domicilio xdo, direccion xdi  
            where xpe.id=xdo.id_persona and xdo.id=xdi.id and 
                xpa.id_persona=xpe.id and xpa.id=xat.id_paciente and 
                xat.id_area=xar.id and xur.id=xat.id_usuario_rol_atencion and 
                xur.id_establecimiento=xe.id;`,
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

const createFolder = async({nombre_carpeta}) =>{
    const query = {
        text: `insert into carpeta(nombre_carpeta) 
                values(?)`,
        values: [nombre_carpeta]
    }

    const [result] = await pool.query(query.text, query.values);
    return result;
}

const showFolder=async()=>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
        text: `select *
            from carpeta`,
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

const verifyIfExistFolder = async({nombre_carpeta}) =>{
    let connection;
    try {
        connection = await pool.getConnection()
        const query = {
            text: `select *
                from  carpeta
                where nombre_carpeta = ?;`,
            values: [nombre_carpeta]
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


const showPatientById = async({id}) =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
            text: `select xpa.id, xpe.id as id_persona, xd.id as id_domicilio
                from paciente xpa, persona xpe, domicilio xd
                where xpa.id=? and xpa.id_persona = xpe.id_persona and 
                xpe.id_persona = xd.id_persona and xpa.estado_paciente=1;`,
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

const verifyIfExistPatient = async({ci}) =>{
    let connection;
    try {
        connection = await pool.getConnection()
        const query = {
            text: `select *
                from persona xpe, paciente xpa
                where  xpe.ci=? and 
                xpe.id = xpa.id_persona and 
                xpa.estado_paciente = 1;`,
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

const verifyIfExistedPatient = async({ci}) =>{
    let connection;
    try {
        connection = await pool.getConnection()
        const query = {
            text: `
                select *
                from paciente xpa, persona xpe
                where xpe.ci=? and 
                xpe.id=xpa.id_persona and 
                xpa.estado_paciente=0`,
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

export const deletePatient = async({id}) =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
            text: 'update paciente set estado_paciente = 0 where id = ?',
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

export const updatePatient = async({id_persona, id_domicilio, id,
                                departamento, municipio, zona, av_calle, nro_puerta, 
                            ci, nombre, paterno, materno, nacionalidad,
                            estado_civil, nro_telf, sexo, fecha_nacimiento,
                            id_microred, tipo_sangre, peso, estatura, nombre_carpeta})=>{
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
                    [departamento, municipio, zona, av_calle, id_domicilio]);

        let [resultResidence] = await connection.query(`update domicilio 
                    set nro_puerta=ifnull(?, nro_puerta)
                    where id=?;`,
                    [nro_puerta, id_domicilio]);            

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
                            estado_civil, nro_telf, sexo, fecha_nacimiento, id_persona ])     
        let id_carpeta=null;
        if(nombre_carpeta){
            const verifyFolder = await verifyIfExistFolder({nombre_carpeta});     
            if(verifyFolder.length<=0){
                const createFolder=await createFolder({nombre_carpeta});
                id_carpeta=createFolder.insertId;
            }
            else{ id_carpeta=verifyFolder[0].id; }
        }
        let [resultPatient] = await connection.query(`update paciente 
                    set 
                    tipo_sangre=ifnull(?, tipo_sangre),
                    peso=ifnull(?, peso),
                    estatura=ifnull(?, estatura),
                    id_microred=ifnull(?, id_microred),
                    id_carpeta=ifnull(?, id_carpeta)
                    where id=? and estado_paciente=1;`,
                    [tipo_sangre, peso, estatura, id_microred, id_carpeta, id ])
        
        await connection.commit();
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

export const reactivatePatient = async({id})=>{
    
    let connection;
    try {
        connection = await pool.getConnection();
        let [resultPatient] = await connection.query(`update paciente 
                    set estado_paciente=1
                    where id=?;`,
                    [id]);
        
        
        return {resultPatient};
    } catch (error) {
        if (connection){
        error.source = 'model';
        throw error;
        } 
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
    verifyIfExistFolder,
    showFolder,
    createFolder, 
    showHistoryPatient
}