/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from "../database.js";

const createAttention = async({id_usuario_rol, id_paciente, fecha_atencion}) =>{
      let connection;
    try {
        connection = await pool.getConnection();
        const query = {
                text: `insert into atencion(id_usuario_rol, id_paciente, fecha_atencion) 
                        values(?,?,?)`,
                values: [id_usuario_rol, id_paciente, fecha_atencion]
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
        text: `select xpa.id_paciente, concat(xpe.ci, " ", xpe.extension) as ci,
                concat(xpe.paterno," ",xpe.materno," ",xpe.nombre) as nombres,
                xa.fecha_atencion
            from persona xpe, paciente xpa, atencion xa 
            where xpa.id_persona=xpe.id_persona and xpa.id_paciente=xa.id_paciente and xpa.estado_paciente=1;`,
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

const mostrarAtencion = async()=>{
    const query = {
        text:   `select (select concat(xp.ci, " ", xp.extension) as cedula
                    from persona xp 
                    where xp.id_persona=xa.id_persona) as cedula, 
                    (select concat (xp.paterno," ", xp.materno, " ", xp.nombre) as nombres
                    from persona xp 
                    where xp.id_persona=xa.id_persona) as nombres,
                
                    (select xe.nombre 
                    from establecimiento xe
                    where xe.id_establecimiento = xa.id_establecimiento) as establecimiento
                from atencion xa
                where date(xa.fecha_atencion) = date(now());`,
    }

    const resultado = await pool.query(query.text);
    return resultado[0];
}

const mostrarHistorialAtencion = async()=>{
    const query = {
        text:   `select (select concat(xp.ci, " ", xp.extension) as cedula
                    from persona xp 
                    where xp.id_persona=xa.id_persona) as cedula, 
                    (select concat (xp.paterno," ", xp.materno, " ", xp.nombre) as nombres
                    from persona xp 
                    where xp.id_persona=xa.id_persona) as nombres,
                
                    (select xe.nombre 
                    from establecimiento xe
                    where xe.id_establecimiento = xa.id_establecimiento) as establecimiento,
                    
                    xa.fecha_atencion
                from atencion xa;`,
    }

    const resultado = await pool.query(query.text);
    return resultado[0];
}

const verifyAttention = async({id_paciente, fecha_atencion}) =>{
    let connection;
    try {
        connection=await pool.getConnection();
        const query = {
            text:`select * from atencion where id_paciente = ? and date(fecha_atencion) = ? `,
            values: [id_paciente, fecha_atencion]
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
export const attentionModel = {
    createAttention,
    showAttention,
    mostrarAtencion,
    mostrarHistorialAtencion,
    verifyAttention,
}