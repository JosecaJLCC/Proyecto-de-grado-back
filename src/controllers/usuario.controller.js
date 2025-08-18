import { usuarioModel } from "../models/usuario.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { JWT_TOKEN } from "../config.js";
import { rolModel } from "../models/rol.model.js";
/* import { establecimientoModel } from "../models/establecimiento.model.js"; */
import { logsModel } from "../models/logs.js";

import fs from 'node:fs'

const inicioSesion =  async(req, res)=>{
    try {
        /* Se verifica que no haya un campo vacio en los siguientes atributos */
        const {correo, clave, id_establecimiento} = req.body;
        if(!correo || !clave || !id_establecimiento){
            return res.status(404).json({ok:false, msg:"Existen campos sin llenar", correo: false, clave: false})
        }
        /* Para la verificacion de la existencia del establecimiento */
        const establecimiento = await establecimientoModel.verificarEstablecimiento(id_establecimiento);
        
        /* Siempre habran los CS ya que lo cargamos en el front desde el back pero no esta demas hacer esta validacion */
        if(establecimiento.length<=0){
            return res.status(404).json({ok:false, msg:"El establecimiento no existe", correo: false, clave: false})
        }
        
        /* Hallamos el correo del usuario para la auntenticacion nota: es un array de objetos [{},{},...]*/
        const usuario = await usuarioModel.correoUsuario(correo);

        /* Si usuario.length es 0 entonces no existe usuarios con ese correo, nota: es un array de objetos asi que pueden ser más */
        if(usuario.length<=0){
            return res.status(404).json({ ok:false, msg:`¡Correo no encontrado!`, correo: false, clave: true })
        }
        /* Como es un array de objetos, pero como solo puede haber un correo, igual debemos apuntar a la posicion cero usuario[0] */
        const isMatch = await bcrypt.compare(clave, usuario[0].clave)
        
        /* isMatch devuelve true si hay coincidencia y false si no lo hay */
        if(!isMatch){
            return res.status(404).json({ ok:false, msg:`¡Clave no encontrada!`, correo: true, clave: false })
        }
        
        /* Se envia como parametros en el token el correo y id_rol */
        const token = jwt.sign({
            correo: usuario[0].correo,
            
            id_rol: usuario[0].id_rol,
            id_establecimiento: establecimiento[0].id_establecimiento,
        }, JWT_TOKEN, {expiresIn: '1h'})

        /* Se haran registro de los logs de los usuarios para casos de auditoria */
        const registroLogs = await logsModel.registrarLogs({id_usuario: usuario[0].id_usuario, id_establecimiento: establecimiento[0].id_establecimiento})

        /* const resultado = await usuarioModel.inicioSesion(correo, clave) */
        res.json({ ok:true, token:token })
    } catch (error) {
        console.log("my error",error)
        res.status(500).json({ok:false, msg:"error server login"})
    }
}
/* cambiar de nombre al archivo imagen de perfil */
const guardarImagen = (archivo)=>{
    const newName = `${Date.now()}-${archivo.originalname}`
    const newPath = `./src/uploads/${newName}`;
    fs.renameSync(archivo.path, newPath);
    return newName;
}

const registroUsuario = async(req, res) =>{
    const { nombre_usuario, correo, clave, id_persona, id_rol }= req.body;
    let nombreArchivo = ""
    if(req.file){
        const perfil = req.file;
        nombreArchivo = guardarImagen(perfil);
    }
    else{
        nombreArchivo = 'usuario.png'
    } 
    try {
        /* Se verifica que no haya un campo vacio en los siguientes atributos */
        if(!nombre_usuario || !correo || !clave || !id_persona || !id_rol){
            return res.status(400).json("datos incompletos para agregar")
        }
        const usuario = await usuarioModel.correoUsuario(correo);
        /* Si no existe ningun correo devuelve [] pero esto es true, es por eso que se hace el .length>0 por si encuentra algun correo registrado */
        if(usuario.length>0){   
            return res.status(404).json({ ok:false, msg:`El correo ya existe` })
        }

        /* Para la encriptacion de contrasenias con palabras aleatorias */
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(clave, salt)

        const resultado =await usuarioModel.registrarUsuario({ nombre_usuario, correo, clave: hashedPassword, perfil:nombreArchivo, id_persona, id_rol })
        res.json({ ok:true, msg: resultado/* , token: token */})
    } catch (error) {
        console.log(error)
        res.status(500).json({ok:false, msg:"error server register"})
    }
}

const perfil = async(req, res) => {
    try {
        /* Como en el middleware jwt puse correo en el req.correo=correo entonces eso se enviara aqui como req.correo */
        const usuario = await usuarioModel.correoUsuario(req.correo);
        /* se envia el id_rol para devolver el nombre de rol */
        const rol = await rolModel.mostrarRol(req.id_rol)
        /* agregamos el rol de usuario al array de objetos usuario */
        let centro_salud = await establecimientoModel.verificarEstablecimiento(req.id_establecimiento)
        usuario[0]={...usuario[0], 
                    id_rol: usuario[0].id_rol,
                    rol: rol[0].nombre, 
                    id_establecimiento: centro_salud[0].id_establecimiento, 
                     nombre_establecimiento: centro_salud[0].nombre_establecimiento
        }
        console.log("ROL DE usuario", usuario);
        res.json({ok: true, msg: usuario })
    } catch (error) {
        console.log(error)
        res.status(500).json({ok:false, msg:"error server register"})
    }
}

export const usuarioController={
    inicioSesion,
    registroUsuario, 
    perfil
}