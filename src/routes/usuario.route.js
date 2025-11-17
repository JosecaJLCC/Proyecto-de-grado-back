import { Router } from 'express';
import { userController } from '../controllers/usuario.controller.js';
import { verificarToken } from '../middlewares/jwt.middleware.js';
/* Para utilizar archivos */
import multer from 'multer'

const upload = multer({dest: './src/uploads'});

 
export const rutas = Router();

rutas.post('/login', userController.login)
rutas.post('/create', upload.single('imagenPerfil') ,userController.createUser)
rutas.get('/show', userController.showUser)
rutas.get("/profile", verificarToken, userController.profile)
rutas.post("/session", userController.setSession)
rutas.get("/search/:ci", userController.searchUser)

export default rutas;