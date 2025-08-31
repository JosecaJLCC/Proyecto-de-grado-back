import { Router } from 'express';
import {staffController} from '../controllers/personal.controller.js'
import { verificarToken } from '../middlewares/jwt.middleware.js';

 
export const rutas = Router();
rutas.post('/create'/* , verificarToken */ ,staffController.createStaff)
rutas.get('/show', staffController.showStaff)
rutas.patch('/update/:id_personal?', staffController.updateStaff)
rutas.delete('/delete/:id_personal?'/* ,verificarToken */, staffController.deleteStaff)

export default rutas;