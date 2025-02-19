import { pool } from "../database.js";

export const getData = async(req, res)=>{
    try {
        const resultado = await pool.query('select * from persona');    
        if(resultado[0]<=0){
            return res.status(404).json(`No existen personas para mostrar`);
        }
        res.json(resultado[0]);
    } catch (error) {
        console.log("Error en GET", error)
    }
}

export const getDataById =  async(req, res)=>{
    try {
        const { id } = req.params;
        const resultado = await pool.query(`select * from persona where id_persona=?`, [id])
        if(resultado[0]<=0){
            return res.status(404).json(`No existe la persona con el id ${id}`)
        }
        res.json(resultado[0]) 
    } catch (error) {
        console.log("Error en GET id", error)
    }
}

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

