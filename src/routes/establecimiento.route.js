import { Router } from 'express';
import { establecimientoController } from '../controllers/establecimiento.controller.js';
import { verificarToken } from '../middlewares/jwt.middleware.js';

 
export const rutas = Router();

rutas.post('/create', establecimientoController.crearEstablecimiento);
rutas.get('/show', establecimientoController.mostrarEstablecimiento);

export default rutas;