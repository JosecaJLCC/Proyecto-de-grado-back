import { Router } from 'express';
import { usuarioController } from '../controllers/usuario.controller.js';
import { verificarToken } from '../middlewares/jwt.middleware.js';
/* Para utilizar archivos */
import multer from 'multer'

const upload = multer({dest: './src/uploads'});

 
export const rutas = Router();

rutas.post('/login', usuarioController.inicioSesion)

rutas.post('/register', upload.single('imagenPerfil') ,usuarioController.registroUsuario)

rutas.get("/profile", verificarToken, usuarioController.perfil)

export default rutas;