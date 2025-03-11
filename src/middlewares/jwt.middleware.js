import jwt from 'jsonwebtoken';
import {JWT_TOKEN} from '../config.js'


export const verificarToken = (req, res, next) => {
    let token = req.headers.authorization
    console.log(token)
    if(!token){
        return res.status(404).json({ok:false, msg:"Sin autorizacion por token"})
    }
    try {
        token=token.split(" ")[1];
        const {correo} = jwt.verify(token, JWT_TOKEN);
        req.correo=correo;
        next()    
    } catch (error) {
        res.json({msg: 'error token'})
    }
    
}