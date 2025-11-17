import jwt from 'jsonwebtoken';
import {JWT_TOKEN} from '../config.js'


export const verificarToken = (req, res, next) => {
    try {
        /* Se envia el token en la cabecera  */
        let token = req.headers.authorization
        console.log("mytoken-backend",token)
        
        if(!token){
            return res.status(401).json({ok:false, msg:"Sin autorizacion por token"})
        }
        /* el token viene en este formato: bearer tu_token */
        /* Por eso dividimos la parte del nuestro token que es lo que nos importa */
        token=token.split(" ")[1];
        const {nombre_usuario, nombre_rol, id_rol, 
            id_usuario, id/* es id_usuario_rol */, id_personal, 
            id_establecimiento,nombre_establecimiento, perfil} = jwt.verify(token, JWT_TOKEN);

        req.nombre_usuario= nombre_usuario,
        req.nombre_rol= nombre_rol,       
        req.id_rol= id_rol,
        req.id_usuario= id_usuario,
        req.id= id,
        req.id_personal= id_personal,
        req.id_establecimiento= id_establecimiento,
        req.nombre_establecimiento=nombre_establecimiento,
        req.perfil= perfil,

        next()    
    } catch (error) {
        console.log("mi error: ",error)
        return res.status(401).json({ ok: false, msg: "Token inválido o expirado", error });
    }
}

const verifyPrincipal = (req, res, next)=>{
    if(req.id_rol==1){
        return next();
    }
    res.status(403).json({ok: false, msg:'Usuario no autorizado'})
}

const verifyMedicalStaff = (req, res, next)=>{
    if(req.id_rol==2){
        return next();
    }
    res.status(403).json({ok: false, msg:'Usuario no autorizado'})
}

const verifyOperationalStaff = (req, res, next)=>{
    if(req.id_rol==3){
        return next();
    }
    res.status(403).json({ok: false, msg:'Usuario no autorizado'})
}