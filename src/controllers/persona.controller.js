import { personaModel } from "../models/persona.model.js";

export const crearPersona = async(req, res)=>{
    try {
        const {ci, extension, 
            nombre, paterno, materno, 
            nacionalidad, estado_civil, 
            nro_telf, sexo, fecha_nacimiento}=req.body;
        if(!ci || !extension ||
            !nombre || !paterno || !materno || 
            !nacionalidad || !estado_civil || 
            !nro_telf || !sexo || !fecha_nacimiento){
                return res.status(404).json({ok:false, message:'Faltan datos por llenar en PERSONA'})
            }

        const resultado = await personaModel.crearPersona({ci, extension, 
                                                        nombre, paterno, materno, 
                                                        nacionalidad, estado_civil, 
                                                        nro_telf, sexo, fecha_nacimiento})
        /* Si resultado.affectedRows es 1 se creo la persona, pero si sale 0 quiere decir que no hay personas registradas */
        if(resultado.affectedRows<=0){
            return res.status(404).json(`No existen personas para mostrar`);
        }
        res.status(201).json({ok:true, message:"Persona agregada"});
    } catch (error) {
        console.log("Error en GET", error)
    }
}


export const verificarCI =  async(req, res)=>{
    try {
        const { ci, extension } = req.body;
        const resultado = await personaModel.verificarCI(ci, extension);
        console.log("controller", resultado.length)
        if(resultado.length<=0){
            return res.status(404).json(`No existe la persona con ci ${ci} ${extension}`)
        }
        res.status(200).json({ok:true, message:"Persona agregada"}) 
    } catch (error) {
        console.log("Error en GET id", error)
    }
}

export const personaController = {
    crearPersona,
    verificarCI
}

/* 

export const postData = async(req, res)=>{
    try {
        const {
            ci,
            extension,
            nombre,
            materno,
            paterno,
            sexo,
            fecha_nacimiento } = req.body;
    
    
        if(!ci || !extension || !nombre || !materno || !paterno || !sexo || !fecha_nacimiento){
            return res.status(400).json("datos incompletos para agregar")
        }
        const resultado = await pool.query(`insert into persona(ci, extension, nombre, paterno, materno, sexo, fecha_nacimiento) 
            values (?, ?, ?, ?, ?, ?, ?);`, [ci, extension, nombre, paterno, materno, sexo, fecha_nacimiento])
        res.status(201).json(resultado[0])
    } catch (error) {
        console.log("Error en POST", error)
    }
}

export const putDataById = async(req, res)=>{
    const { id } = req.params;
    const {
        ci,
        extension,
        nombre,
        materno,
        paterno,
        sexo,
        fecha_nacimiento } = req.body;

    let resultado = await pool.query(`update persona 
        set ci=ifnull(?, ci),
        extension=ifnull(?, extension),
        nombre=ifnull(?, nombre),
        paterno=ifnull(?, paterno),
        materno=ifnull(?, materno),
        sexo=ifnull(?, sexo), 
        fecha_nacimiento=ifnull(?, fecha_nacimiento) 
        where id_persona=?`, [ci, extension, nombre, paterno, materno, sexo, fecha_nacimiento, id])
    if(resultado[0].affectedRows<=0){
        return res.status(404).json(`No existe el usuario con el id ${id}`)
    }
    res.json(resultado[0])
}

export const deleteDataById = async(req, res)=>{
    const { id } = req.params;
    let resultado = await pool.query(`delete from persona where id_persona=?;`, [id]);
    if(resultado[0].affectedRows<=0){
        return res.status(404).json(`No existe el usuario con el id ${id}`)
    }
    res.json(resultado[0])
}
 */
