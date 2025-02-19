import { pool } from "../database.js";

export const getData = async(req, res)=>{
    try {
        const resultado = await pool.query('select * from usuario');    
        if(resultado[0]<=0){
            return res.status(404).json(`No existen usuarios para mostrar`);
        }
        res.json(resultado[0]);
    } catch (error) {
        console.log("Error en GET", error)
    }
}

export const getDataById =  async(req, res)=>{
    try {
        const { id } = req.params;
        const resultado = await pool.query(`select * from usuario where id_usuario=?`, [id])
        if(resultado[0]<=0){
            return res.status(404).json(`No existe el usuario con el id ${id}`)
        }
        res.json(resultado[0]) 
    } catch (error) {
        console.log("Error en GET id", error)
    }
}

export const postData = async(req, res)=>{
    try {
        const {
            nombre_usuario,
            correo,
            clave,
            id_persona } = req.body;
    
        if(!nombre_usuario || !correo || !clave || !id_persona){
            return res.status(400).json("datos incompletos para agregar")
        }
        const resultado = await pool.query(`insert into usuario(nombre_usuario, correo, clave, fecha_creacion, id_persona) 
            values (?, ?, ?, now(), ?);`, [nombre_usuario, correo, clave, id_persona])
        res.status(201).json(resultado[0])
    } catch (error) {
        console.log("Error en POST", error)
    }
}

export const putDataById = async(req, res)=>{
    try {
        const { id } = req.params;
        const {
            nombre_usuario,
            correo,
            clave,
            id_persona } = req.body;
    
        let resultado = await pool.query(`update usuario 
            set nombre_usuario=ifnull(?, nombre_usuario),
            correo=ifnull(?, correo),
            clave=ifnull(?, clave),
            id_persona=ifnull(?, id_persona)
            where id_usuario=?`, [nombre_usuario, correo, clave, id_persona, id])
        if(resultado[0].affectedRows<=0){
            return res.status(404).json(`No existe el usuario con el id ${id}`)
        }
        res.json(resultado[0])
    } catch (error) {
        console.log("Error en PATCH", error)
    }
}

export const deleteDataById = async(req, res)=>{
    try {
        const { id } = req.params;
        let resultado = await pool.query(`delete from usuario where id_usuario=?;`, [id]);
        if(resultado[0].affectedRows<=0){
            return res.status(404).json(`No existe el usuario con el id ${id}`)
        }
        res.json(resultado[0])
    } catch (error) {
        console.log("Error en DELETE", error)
    }
}

