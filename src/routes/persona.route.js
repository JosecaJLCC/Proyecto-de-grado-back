import { Router } from 'express';
import {crearPersona, verificarCI} from '../controllers/persona.controller.js'

 
export const rutas = Router();

/* rutas.get('/personas', getData)

rutas.get('/personas/:id', getDataById) */

rutas.post('/post', crearPersona)

rutas.post('/ci', verificarCI)

/* rutas.patch('/personas/:id', putDataById)

rutas.delete('/personas/:id', deleteDataById)
 */
/* rutas.use('/',(req, res, next)=>{
    next();
}) */

export default rutas;