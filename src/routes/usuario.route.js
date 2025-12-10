import { Router } from 'express';
import { userController } from '../controllers/usuario.controller.js';
import { verificarToken } from '../middlewares/jwt.middleware.js';
/* Para utilizar archivos */
import multer from 'multer'

const upload = multer({dest: './src/uploads'});
 
export const rutas = Router();

rutas.post('/login', userController.login)
rutas.post('/logout', userController.logout)
rutas.post('/create', upload.single('imagenPerfil') ,userController.createUser)
rutas.get('/show/:estado_usuario', userController.showUser)
rutas.patch('/update/:id',upload.single('imagenPerfil'), userController.updateUser)
rutas.patch('/delete/:id', userController.deleteUser)
rutas.patch('/reactivate/:id', userController.reactivateUser)
rutas.get("/profile", verificarToken, userController.profile)
rutas.post("/session", userController.setSession)
rutas.get("/search/:ci", userController.searchUser)
rutas.get("/author/:id", userController.showUserAuthor)
rutas.get("/logs-show", userController.logsShow)

export default rutas;
