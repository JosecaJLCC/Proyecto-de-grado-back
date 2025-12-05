import { userModel } from "../models/usuario.model.js";
import { staffModel } from "../models/personal.model.js"
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { JWT_TOKEN } from "../config.js";
import { fechaHoraBolivia } from "../utils/fechaBolivia.js";
import fs from 'node:fs'

/* cambiar de nombre al archivo imagen de perfil */
const savePicture = (archivo)=>{
    const newName = `${Date.now()}-${archivo.originalname}`
    const newPath = `./src/uploads/${newName}`;
    fs.renameSync(archivo.path, newPath);
    return newName;
}

const createUser = async(req, res) =>{
    const { nombre_usuario, clave, id_personal, id_rol }= req.body;
    try {
        /* Se verifica que no haya un campo vacio en los siguientes atributos */
        if(!nombre_usuario || !clave || !id_personal || !id_rol){
            return res.status(200).json({ok:false, message:"datos incompletos para agregar"})
        }
        /* Si no existe ningun nombre_usuario devuelve [] pero esto es true, es por eso que se hace el .length>0 por si encuentra algun nombre_usuario registrado */
        const userBynombre_usuario = await userModel.verifyIfExistUser({nombre_usuario});
        if(userBynombre_usuario.length>0){   
            return res.status(200).json({ ok:false, message:`Nombre de usuario existente` })
        }
        let nombreArchivo = ""
        if(req.file){
            const perfil = req.file;
            nombreArchivo = savePicture(perfil);
        }
        else{
            nombreArchivo = 'usuario.png';
        } 
        /* Para el hash no reversible de contraseñas*/
        const saltRounds=Math.floor(Math.random() * (12 - 10 + 1)) + 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(clave, salt);

        const fecha_creacion = fechaHoraBolivia();
        const result = await userModel.createUser({ nombre_usuario, clave: hashedPassword, perfil:nombreArchivo, id_personal, id_rol, fecha_creacion })
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
        const {estado_usuario}=req.params;
        const result = await userModel.showUser({estado_usuario});
        if(result.length<=0){
            return res.status(200).json({ ok: false, data: [], message: 'No existe staff registrado' });
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

const showUserAuthor = async(req, res)=>{
    try {
        const {id}=req.params;
        const result = await userModel.showUserAuthor({id});
        if(result.length<=0){
            return res.status(200).json({ ok: false, data: [], message: 'No existe staff registrado' });
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


const updateUser = async(req, res)=>{
    try {
        const {id} = req.params;
        const {clave} = req.body;
        
        let nombreArchivo = ""
        const saltRounds=10;
        let salt="";
        let hashedPassword="";
        if(req.file){
            const perfil = req.file;
            nombreArchivo = savePicture(perfil);
        }
        if(clave){
            
            salt = await bcrypt.genSalt(saltRounds);
            hashedPassword = await bcrypt.hash(clave, salt);    
        }
        const result = await userModel.updateUser({
            id, 
            clave: hashedPassword || null, 
            perfil: nombreArchivo || null
        });
        res.status(200).json({ok:true, message:"Usuario actualizado correctamente", data: result});
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

const deleteUser = async(req, res)=>{
    try {
        const {id}=req.params;
        const result = await userModel.deleteUser({id});
        if(result.length<=0){
            return res.status(200).json({ ok: false, data: [], message: 'No existe el usuario' });
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

const reactivateUser = async(req, res)=>{
    try {
        const {id}=req.params;
        const result = await userModel.reactivateUser({id});
        if(result.length<=0){
            return res.status(200).json({ ok: false, data: [], message: 'No existe el usuario' });
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

const searchUser = async(req, res)=>{
    const {ci}=req.params;
    
    try {
        const existStaff = await staffModel.verifyIfExistStaff({ci})
        if(existStaff.length>0){
            const existUser = await userModel.verifyIfExistUser({ci});
            if(existUser.length>0){
                return res.status(200).json({ ok: false, message: 'Usuario existente' });
            }
            const existedUser = await userModel.verifyIfExistedUser({ci});
            if(existedUser.length>0){
                return res.status(200).json({ ok: false, message: 'Usuario existente pero inactivo' });
            }
            
            const [result] = await userModel.showUserByCi({ci})
            
            return res.status(200).json({ok:true, data: result});
        }
        const existedStaff = await staffModel.verifyIfExistedStaff({ci})
        if(existedStaff.length>0){
            return res.status(200).json({ ok: false, message: 'Personal existente pero inactivo' });
        }
        res.status(200).json({ok:false, message:'Personal inexistente, registre al personal' });
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
        const {nombre_usuario, clave} = req.body;
        if(!nombre_usuario || !clave){
            return res.status(200).json({ok:false, message:"Existen campos sin llenar"})
        }
        /* Hallamos la informacion implicada al nombre de usuario ingresado */
        const result = await userModel.login({nombre_usuario});       
        /* Si usuario.length es 0 entonces no existe usuarios con ese nombre_usuario*/
        if(result.length<=0){
            return res.status(200).json({ ok:false, message:"¡Nombre de usuario inexistente!"});
        }
        /*Comparacion de la clave ingresada con la clave referente al nombre de usuario*/
        const isMatch = await bcrypt.compare(clave, result[0].clave);
        /* isMatch devuelve true si hay coincidencia y false si no lo hay */
        if(!isMatch){
            return res.status(200).json({ ok:false, message:"¡Clave inexistente!"});
        }
        res.status(200).json({ ok:true, data:result});
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

const setSession = async(req, res) => {
    const fecha_log = fechaHoraBolivia();
    try {   
        const {id/*->id_usuario_rol */, id_usuario, id_personal, 
            id_rol, nombre_usuario, nombre_rol, 
            id_establecimiento, nombre_establecimiento, perfil}=req.body;
        
        const result = await userModel.setSession({id, id_establecimiento, fecha_log}) 
        /* Se envia como parametros en el token el nombre_usuario y id_rol */
        const token = jwt.sign({
            nombre_usuario: nombre_usuario,
            nombre_rol: nombre_rol,       
            id_rol: id_rol,
            id_usuario: id_usuario,
            id: id,/* id_usuario_rol */
            id_personal: id_personal,
            id_establecimiento: id_establecimiento,
            nombre_establecimiento: nombre_establecimiento,
            perfil: perfil
        }, JWT_TOKEN, {expiresIn: '4h'})

        res.status(200).json({ok: true, token: token})
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

const profile = async(req, res) => {
    
    try {
        let user={
            nombre_usuario:req.nombre_usuario,
            nombre_rol:req.nombre_rol,
            id_rol:req.id_rol,
            perfil: req.perfil,
            id_usuario: req.id_usuario,
            id: req.id,
            id_establecimiento: req.id_establecimiento,
            nombre_establecimiento: req.nombre_establecimiento
        }     
        res.json({ok: true, data: user })
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


export const userController = {
    createUser,
    showUser, 
    updateUser,
    deleteUser,
    reactivateUser,
    login,
    profile,
    setSession,
    searchUser,
    showUserAuthor
}