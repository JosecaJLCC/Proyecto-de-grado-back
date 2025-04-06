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
        const {correo, id_rol} = jwt.verify(token, JWT_TOKEN);
        req.correo=correo;
        req.id_rol=id_rol;
        next()    
    } catch (error) {
        res.json({msg: 'error token'})
    }
    
}


const verifyAdmin = (req, res, next)=>{
    if(req.id_rol==1){
        return next;
    }
    res.status(404).json({ok: false, msg:'Usuario no autorizado'})
}

const verifyPrincipal = (req, res, next)=>{
    if(req.id_rol==1){
        return next;
    }
    res.status(404).json({ok: false, msg:'Usuario no autorizado'})
}