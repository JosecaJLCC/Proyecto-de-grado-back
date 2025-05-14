import { Router } from 'express';
import {crearPersona, verificarCI, mostrarPersonas, mostrarPersonaByCi} from '../controllers/persona.controller.js'
import { verificarToken } from '../middlewares/jwt.middleware.js';

 
export const rutas = Router();

rutas.get('/show', mostrarPersonas)

rutas.get('/show/:id', mostrarPersonaByCi)

rutas.post('/register'/* , verificarToken */ ,crearPersona)

rutas.post('/ci'/* ,verificarToken */, verificarCI)

/* rutas.patch('/personas/:id', putDataById)

rutas.delete('/personas/:id', deleteDataById)
 */
/* rutas.use('/',(req, res, next)=>{
    next();
}) */

export default rutas;