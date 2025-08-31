import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { verificarToken } from '../middlewares/jwt.middleware.js';
/* Para utilizar archivos */
import multer from 'multer'

const upload = multer({dest: './src/uploads'});

 
export const rutas = Router();

rutas.post('/login', userController.login)
rutas.post('/create', upload.single('imagenPerfil') ,userController.createUser)
rutas.get('/show', userController.showUser)
rutas.get("/profile", verificarToken, userController.profile)
rutas.get("/choose/:id_usuario?", userController.chooseEstablishment)
rutas.post("/session", userController.setSession)

export default rutas;