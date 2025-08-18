import { Router } from 'express';
import { establishmentController } from '../controllers/establecimiento.controller.js';
import { verificarToken } from '../middlewares/jwt.middleware.js';

 
export const rutas = Router();

rutas.post('/create', establishmentController.createEstablishment);
rutas.get('/show', establishmentController.showEstablishment);
rutas.delete('/delete/:id_establecimiento?', establishmentController.deleteEstablishment);
rutas.patch('/update/:id_establecimiento?', establishmentController.updateEstablishment);

export default rutas;