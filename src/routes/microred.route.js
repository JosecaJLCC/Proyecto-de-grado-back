import { Router } from 'express';
import { microredController } from '../controllers/microred.controller.js';


 
export const rutas = Router();

rutas.post('/create', microredController.createMicroRed);
rutas.get('/show', microredController.showMicroRed);
rutas.delete('/delete/:id_microred?', microredController.deleteMicroRed);
rutas.patch('/update/:id_microred?', microredController.updateMicroRed);

export default rutas;