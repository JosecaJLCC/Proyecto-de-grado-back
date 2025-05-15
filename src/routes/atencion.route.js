import { Router } from 'express';
import { atencionController } from '../controllers/atencion.controller.js';

import { verificarToken } from '../middlewares/jwt.middleware.js';

 
export const rutas = Router();

rutas.post('/create', atencionController.registrarAtencion);
rutas.get('/show', atencionController.mostrarAtencion);
rutas.get('/showall', atencionController.mostrarHistorialAtencion);

export default rutas;