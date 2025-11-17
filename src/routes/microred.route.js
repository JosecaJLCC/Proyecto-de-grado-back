import { Router } from 'express';
import { microredController } from '../controllers/microred.controller.js';

export const rutas = Router();

rutas.post('/create', microredController.createMicroRed);
rutas.get('/show/:estado_microred', microredController.showMicroRed);
rutas.patch('/delete/:codigo?', microredController.deleteMicroRed);
rutas.patch('/update/:codigo?', microredController.updateMicroRed);
rutas.patch('/reactivate/:codigo?', microredController.reactivateMicroRed);

export default rutas;