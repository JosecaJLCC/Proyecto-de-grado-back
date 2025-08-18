import { Router } from 'express';
import {registrarPaciente, verificarCI, mostrarPacientes, mostrarPacienteByCi} from '../controllers/paciente.controller.js'
import { verificarToken } from '../middlewares/jwt.middleware.js';

 
export const rutas = Router();

rutas.get('/show', mostrarPacientes)

rutas.get('/show/:id', mostrarPacienteByCi)

rutas.post('/register'/* , verificarToken */ ,registrarPaciente)

rutas.post('/ci'/* ,verificarToken */, verificarCI)

/* rutas.patch('/personas/:id', putDataById)

rutas.delete('/personas/:id', deleteDataById)
 */
/* rutas.use('/',(req, res, next)=>{
    next();
}) */

export default rutas;