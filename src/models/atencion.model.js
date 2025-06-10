/* Se importa la configuracion de la conexion con la base de datos */
import { pool } from "../database.js";

const registrarAtencion = async({id_usuario, id_persona, id_establecimiento}) =>{
    const query = {
        text: `insert into atencion(id_usuario, id_persona, id_establecimiento, fecha_atencion) 
                values(?,?,?,now())`,
        values: [id_usuario, id_persona, id_establecimiento]
    }

    const resultado = await pool.query(query.text, query.values);
    return resultado[0];
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

const verificarAtencion = async(id_persona) =>{
    const query = {
        text:`select * from atencion where id_persona = ? and date(fecha_atencion) = date(now()) `,
        values: [id_persona]
    }
    const resultado = await pool.query(query.text, query.values);
    return resultado[0];
}
export const atencionModel = {
    registrarAtencion,
    mostrarAtencion,
    mostrarHistorialAtencion,
    verificarAtencion,
}