import { Router } from 'express';
import { usuarioController } from '../controllers/usuario.controller.js';
import { verificarToken } from '../middlewares/jwt.middleware.js';

 
export const rutas = Router();

rutas.post('/login', usuarioController.inicioSesion)

rutas.post('/register', usuarioController.registroUsuario)

rutas.get("/profile", verificarToken, usuarioController.perfil)

export default rutas;