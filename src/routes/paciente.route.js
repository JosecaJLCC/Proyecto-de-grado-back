import { Router } from 'express';
import {patientController} from '../controllers/paciente.controller.js'
import { verificarToken } from '../middlewares/jwt.middleware.js';

export const rutas = Router();
rutas.post('/create'/* , verificarToken */ ,patientController.createPatient)
rutas.get('/show/:estado_paciente', patientController.showPatient)
rutas.patch('/update/:id', patientController.updatePatient)
rutas.patch('/delete/:id'/* ,verificarToken */, patientController.deletePatient)
rutas.patch('/reactivate/:id'/* ,verificarToken */, patientController.reactivatePatient)
rutas.get('/showfolder', patientController.showFolder)


export default rutas;