import { usuarioModel } from "../models/usuario.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { JWT_TOKEN } from "../config.js";

const inicioSesion =  async(req, res)=>{
    try {
        const {correo, clave} = req.body;
        if(!correo || !clave){
            return res.status(404).json({ok:false, msg:"Faltan datos por llenar en USUARIO"})
        }
        /* Hallamos el correo del usuario para la auntenticacion */
        const usuario = await usuarioModel.correoUsuario(correo);
        
        if(!usuario.length){
            return res.status(404).json({ ok:false, msg:`No existe el correo` })
        }
        const isMatch = await bcrypt.compare(clave, usuario[0].clave)
        
        if(!isMatch){
            return res.status(404).json({ ok:false, msg:`No existe el correo` })
        }
        const token = jwt.sign({
            correo: correo
        }, JWT_TOKEN, {expiresIn: '1h'})

        /* const resultado = await usuarioModel.inicioSesion(correo, clave) */
        res.json({ ok:true, token:token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ok:false, msg:"error server login"})
    }
}

const registroUsuario = async(req, res)=>{
    const { nombre_usuario, correo, clave, id_persona }= req.body;
    try {
        if(!nombre_usuario || !correo || !clave || !id_persona){
            return res.status(400).json("datos incompletos para agregar")
        }
        const usuario = await usuarioModel.correoUsuario(correo);

        if(usuario.length){
            return res.status(404).json({ ok:false, msg:`El correo ya existe` })
        }

        /* Para la encriptacion de contrasenias */
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(clave, salt)

        /* Para la generacion de token de inicio de sesion */
        const token = jwt.sign({
            correo: correo
        }, JWT_TOKEN, {expiresIn: '1h'})

        const resultado =await usuarioModel.registrarUsuario({ nombre_usuario, correo, clave: hashedPassword, id_persona })
        res.json({ ok:true, msg: resultado, token: token})
    } catch (error) {
        console.log(error)
        res.status(500).json({ok:false, msg:"error server register"})
    }
}

const perfil = async(req, res) => {
    try {
        const usuario = await usuarioModel.correoUsuario(req.correo);
        
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