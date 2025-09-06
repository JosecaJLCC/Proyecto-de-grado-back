import { userModel } from "../models/usuario.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { JWT_TOKEN } from "../config.js";
/* import { rolModel } from "../models/rol_usuario.model.js"; */
/* import { establecimientoModel } from "../models/establecimiento.model.js"; */
/* import { logsModel } from "../models/logs.model.js"; */

import fs from 'node:fs'

/* cambiar de nombre al archivo imagen de perfil */
const savePicture = (archivo)=>{
    const newName = `${Date.now()}-${archivo.originalname}`
    const newPath = `./src/uploads/${newName}`;
    fs.renameSync(archivo.path, newPath);
    return newName;
}

const createUser = async(req, res) =>{
    const { correo, clave, id_personal, id_rol }= req.body;
    try {
        /* Se verifica que no haya un campo vacio en los siguientes atributos */
        if(!correo || !clave || !id_personal || !id_rol){
            return res.status(400).json("datos incompletos para agregar")
        }
        /* Si no existe ningun correo devuelve [] pero esto es true, es por eso que se hace el .length>0 por si encuentra algun correo registrado */
        const userByCorreo = await userModel.showUserByCorreo({correo});
        if(userByCorreo.length>0){   
            return res.status(400).json({ ok:false, msg:`El correo ya existe` })
        }
        let nombreArchivo = ""
        if(req.file){
            const perfil = req.file;
            nombreArchivo = savePicture(perfil);
        }
        else{
            nombreArchivo = 'usuario.png';
        } 

        /* Para la encriptacion de contrasenias con palabras aleatorias */
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(clave, salt)

        const ahora = new Date();
        const fecha_creacion = ahora.toISOString().slice(0, 19).replace('T', ' ');
        const result = await userModel.createUser({ correo, clave: hashedPassword, perfil:nombreArchivo, id_personal, id_rol, fecha_creacion })
        res.status(201).json({ok:true, data:result ,message:"Usuario agregado con exito"});
    } catch (error) {
        if (error.source === 'model') {
            console.log('Error del modelo:', error.message);
            res.status(500).json({ ok: false, message: 'Error en la base de datos: ' + error.message });
        } else {
            console.log('Error del controller:', error.message);
            res.status(500).json({ ok: false, message: 'Error del servidor: ' + error.message });
        }
    }
}

const showUser = async(req, res)=>{
    try {
        const result = await userModel.showUser();
        if(result.length<=0){
            return res.status(200).json({ ok: true, data: [], message: 'No existe staff registrado' });
        }
        res.status(200).json({ok:true, data: result});

    } catch (error) {
        if (error.source === 'model') {
            console.log('Error del modelo:', error.message);
            res.status(500).json({ ok: false, message: 'Error en la base de datos: ' + error.message });
        } else {
            console.log('Error del controller:', error.message);
            res.status(500).json({ ok: false, message: 'Error del servidor: ' + error.message });
        }
    }
}

const login =  async(req, res)=>{
    try {
        /* Se verifica que no haya un campo vacio en los siguientes atributos */
        const {correo, clave} = req.body;
        if(!correo || !clave){
            return res.status(404).json({ok:false, msg:"Existen campos sin llenar", correo: false, clave: false})
        }
        /* Hallamos el correo del usuario para la auntenticacion */
        const result = await userModel.login({correo});
        console.log("result: ", result)
        /* Si usuario.length es 0 entonces no existe usuarios con ese correo, nota: es un array de objetos asi que pueden ser más */
        if(result.length<=0){
            return res.status(400).json({ ok:false, msg:`¡Correo no encontrado!`, correo: false, clave: true })
        }
        /* Como es un array de objetos, pero como solo puede haber un correo, igual debemos apuntar a la posicion cero usuario[0] */
        const isMatch = await bcrypt.compare(clave, result[0].clave)
        console.log("ismatch",isMatch)
        /* isMatch devuelve true si hay coincidencia y false si no lo hay */
        if(!isMatch){
            return res.status(404).json({ ok:false, msg:`¡Clave no encontrada!`, correo: true, clave: false })
        }
 
        res.status(200).json({ ok:true, data:result})
        
    } catch (error) {
        if (error.source === 'model') {
            console.log('Error del modelo login:', error.message);
            res.status(500).json({ ok: false, message: 'Error en la base de datos: ' + error.message });
        } else {
            console.log('Error del controller login:', error.message);
            res.status(500).json({ ok: false, message: 'Error del servidor: ' + error.message });
        }
    }
}

const profile = async(req, res) => {
    console.log("mi perfil", req.body)
    try {
        let usuario={
            correo:req.correo,
            nombre_rol:req.nombre_rol,
            perfil: req.perfil
        }
        
        res.json({ok: true, msg: usuario })
    } catch (error) {
        if (error.source === 'model') {
            console.log('Error del modelo profile:', error.message);
            res.status(500).json({ ok: false, message: 'Error en la base de datos: ' + error.message });
        } else {
            console.log('Error del controller profile:', error.message);
            res.status(500).json({ ok: false, message: 'Error del servidor: ' + error.message });
        }
    }
}

const chooseEstablishment = async(req, res) => {
    try {
        const {id_usuario}=req.params;
        console.log(id_usuario);
        const result = await userModel.chooseEstablishment({id_usuario})
        res.status(200).json({ok: true, data:result})
    } catch (error) {
        if (error.source === 'model') {
            console.log('Error del modelo choose:', error.message);
            res.status(500).json({ ok: false, message: 'Error en la base de datos: ' + error.message });
        } else {
            console.log('Error del controller choose:', error.message);
            res.status(500).json({ ok: false, message: 'Error del servidor: ' + error.message });
        }
    }
}

const setSession = async(req, res) => {
    const ahora = new Date();
    const fecha_creacion = ahora.toISOString().slice(0, 19).replace('T', ' ');
    try {
        
        const {id_usuario_rol, id_usuario, id_personal, id_rol, correo, nombre, id_establecimiento, perfil}=req.body;
        console.log("mi set:",req.body)
        if(id_establecimiento){
            const result = await userModel.setSession({id_usuario_rol, id_establecimiento}) 
        }
        /* Se envia como parametros en el token el correo y id_rol */
        const token = jwt.sign({
            correo: correo,
            nombre_rol: nombre,       
            id_rol: id_rol,
            id_usuario: id_usuario,
            id_usuario_rol: id_usuario_rol,
            id_personal: id_personal,
            id_establecimiento: id_establecimiento,
            perfil: perfil
        }, JWT_TOKEN, {expiresIn: '1h'})

        const registroLogs = await userModel.logLogin({id_usuario_rol, fecha_log:fecha_creacion})

        /* Se haran registro de los logs de los usuarios para casos de auditoria */
        
        res.status(200).json({ok: true, token: token, perfil: perfil})
    } catch (error) {
        if (error.source === 'model') {
            console.log('Error del modelo setsession:', error.message);
            res.status(500).json({ ok: false, message: 'Error en la base de datos: ' + error.message });
        } else {
            console.log('Error del controller setsession:', error.message);
            res.status(500).json({ ok: false, message: 'Error del servidor: ' + error.message });
        }
    }
}

export const userController = {
    createUser,
    showUser, 
    login,
    profile,
    chooseEstablishment,
    setSession
}