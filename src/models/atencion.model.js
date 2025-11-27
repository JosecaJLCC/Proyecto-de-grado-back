/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from "../database.js";

const createAttention = async({id_usuario_rol_atencion, id_paciente, id_area, estado_atencion, fecha_atencion, turno}) =>{
      let connection;
    try {
        connection = await pool.getConnection();
        const query = {
                text: `insert into atencion(id_usuario_rol_atencion, id_paciente, id_area, estado_atencion, fecha_atencion, turno) 
                        values(?, ?, ?, ?, ?, ?)`,
                values: [id_usuario_rol_atencion, id_paciente, id_area, estado_atencion, fecha_atencion, turno]
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

const showAttention = async() =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
        text: `select xpa.id, xpe.ci,
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
                xur.id_establecimiento=xe.id and
                date(xat.fecha_atencion)=date(now());`,
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

const showMedicalDescription = async() =>{
    let connection;
    try {
        connection = await pool.getConnection();
        const query = {
        text: `select xpa.id, xpe.ci,
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
                xur.id_establecimiento=xe.id and 
                date(xat.fecha_atencion)=date(now());`,
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

const showUpdateAttention = async({id})=>{
    const query = {
        text:   `select diagnostico, descripcion
                    from atencion xa, diagnostico xd, receta xr, medicamento xm, receta_detalle xrd 
                    where xa.id=? and xa.id_diagnostico=xd.id and xa.id_receta = xr.id
                    and xr.id=xrd.id_receta and xrd.id_medicamento=xm.id;`,
    }
    const resultado = await pool.query(query.text);
    return resultado[0];
}

const verifyAttention = async({id_paciente, id_area, fecha_atencion}) =>{
    let connection;
    try {
        connection=await pool.getConnection();
        const query = {
            text:`select * 
            from atencion 
            where id_paciente = ? and id_area=? and date(fecha_atencion) = ?`,
            values: [id_paciente, id_area, fecha_atencion]
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

export const updateAttention = async({id, id_receta, id_diagnostico, estado_atencion, id_usuario_rol_diagnostico})=>{
    let connection;
    try {
        connection = await pool.getConnection();
        // Iniciar transacción
        await connection.beginTransaction();

        let [resultAttention] = await connection.query(`update atencion 
                    set 
                    id_receta=ifnull(?, id_receta),
                    id_diagnostico=ifnull(?, id_diagnostico),
                    estado_atencion=ifnull(?, estado_atencion),
                    id_usuario_rol_diagnostico=ifnull(?, id_usuario_rol_diagnostico)
                    where id=?`,
                    [id_receta, id_diagnostico, estado_atencion, id_usuario_rol_diagnostico, id])
        
        await connection.commit();
        return resultAttention;
    }catch (error) {
        if (connection) await connection.rollback(); // Revierte todo si algo falla
        error.source = 'model';
        throw error;
    } finally {
        // Liberar conexión si fue obtenida
        if (connection) connection.release();
    } 
}

export const attentionModel = {
    createAttention,
    showAttention,
    showUpdateAttention,
    verifyAttention,
    updateAttention
}