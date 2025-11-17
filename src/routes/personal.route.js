import { Router } from 'express';
import {staffController} from '../controllers/personal.controller.js'
import { verificarToken } from '../middlewares/jwt.middleware.js';

 
export const rutas = Router();
rutas.post('/create'/* , verificarToken */ ,staffController.createStaff)
rutas.get('/show/:estado_personal', staffController.showStaff)
rutas.patch('/update/:id?', staffController.updateStaff)
rutas.patch('/delete/:id?'/* ,verificarToken */, staffController.deleteStaff)
rutas.patch('/reactivate/:id', staffController.reactivateStaff)
rutas.get('/show-profession', staffController.showProfession)
rutas.get('/show-workarea', staffController.showWorkArea)
rutas.get('/show-position', staffController.showPosition)

export default rutas;