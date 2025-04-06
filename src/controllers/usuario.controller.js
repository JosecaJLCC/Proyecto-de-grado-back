import { usuarioModel } from "../models/usuario.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { JWT_TOKEN } from "../config.js";

const inicioSesion =  async(req, res)=>{
    try {
        /* Se verifica que no haya un campo vacio en los siguientes atributos */
        const {correo, clave} = req.body;
        if(!correo || !clave){
            return res.status(404).json({ok:false, msg:"Existen campos sin llenar", correo: false, clave: false})
        }
        /* Hallamos el correo del usuario para la auntenticacion */
        const usuario = await usuarioModel.correoUsuario(correo);
        /* Si usuario.length es 0 entonces no existe el usuario */
        if(usuario.length<=0){
            return res.status(404).json({ ok:false, msg:`Correo no encontrado`, correo: false, clave: true })
        }
        const isMatch = await bcrypt.compare(clave, usuario[0].clave)
        /* isMatch devuelve true si hay coincidencia y false si no lo hay */
        if(!isMatch){
            return res.status(404).json({ ok:false, msg:`¡Clave no encontrada!`, correo: true, clave: false })
        }
        /* console.log("usuario: ",usuario) */
        /* Se envia el token mas el id_rol para permisos de acceso a determinadas rutas */
        const token = jwt.sign({
            correo: usuario.correo,
            id_rol: usuario.id_rol
        }, JWT_TOKEN, {expiresIn: '1h'})

        /* const resultado = await usuarioModel.inicioSesion(correo, clave) */
        res.json({ ok:true, token:token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ok:false, msg:"error server login"})
    }
}

const registroUsuario = async(req, res)=>{
    const { nombre_usuario, correo, clave, id_personal, id_rol }= req.body;
    try {
        /* Se verifica que no haya un campo vacio en los siguientes atributos */
        if(!nombre_usuario || !correo || !clave || !id_personal || !id_rol){
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

/* Aqui el token no es necesario ya que no cualquiera va a poder registrarse al sistema */

        /* Para la generacion de token de inicio de sesion */
        /* const token = jwt.sign({
            correo: correo
        }, JWT_TOKEN, {expiresIn: '1h'}) */

        const resultado =await usuarioModel.registrarUsuario({ nombre_usuario, correo, clave: hashedPassword, id_personal, id_rol })
        res.json({ ok:true, msg: resultado/* , token: token */})
    } catch (error) {
        console.log(error)
        res.status(500).json({ok:false, msg:"error server register"})
    }
}

const perfil = async(req, res) => {
    try {
        /* Como en el middleware puse correo en el req.correo=correo entonces eso se enviara aqui como req.correo */
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