import { Router } from 'express';
import { establishmentController } from '../controllers/establecimiento.controller.js';
import { verificarToken } from '../middlewares/jwt.middleware.js';

 
export const rutas = Router();

rutas.post('/create', establishmentController.createEstablishment);
rutas.get('/show/:estado_establecimiento', establishmentController.showEstablishment);
rutas.patch('/delete/:id', establishmentController.deleteEstablishment);
rutas.patch('/update/:id', establishmentController.updateEstablishment);
rutas.patch('/reactivate/:id', establishmentController.reactivateEstablishment);
export default rutas;