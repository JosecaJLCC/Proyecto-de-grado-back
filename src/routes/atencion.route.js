import { Router } from 'express';
import { attentionController } from '../controllers/atencion.controller.js';

import { verificarToken } from '../middlewares/jwt.middleware.js';

 
export const rutas = Router();

rutas.post('/create', attentionController.createAttention);
rutas.get('/show', attentionController.showAttention);
/* rutas.get('/showall', attentionController.mostrarHistorialAtencion); */

export default rutas;