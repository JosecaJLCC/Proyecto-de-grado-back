import { Router } from 'express';
import {patientController} from '../controllers/paciente.controller.js'
import { verificarToken } from '../middlewares/jwt.middleware.js';

 
export const rutas = Router();
rutas.post('/create'/* , verificarToken */ ,patientController.createPatient)
rutas.get('/show', patientController.showPatient)
rutas.patch('/update/:id_paciente?', patientController.updatePatient)
rutas.delete('/delete/:id_paciente?'/* ,verificarToken */, patientController.deletePatient)

/* rutas.patdeletePatient('/personas/:id', putDataById)

rutas.delete('/personas/:id', deleteDataById)
 */
/* rutas.use('/',(req, res, next)=>{
    next();
}) */

export default rutas;