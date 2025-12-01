import { Router } from 'express';
import { attentionController } from '../controllers/atencion.controller.js';

import { verificarToken } from '../middlewares/jwt.middleware.js';

export const rutas = Router();

rutas.post('/create', attentionController.createAttention);
rutas.get('/show', attentionController.showAttention);
rutas.get('/show-diagnosis', attentionController.showDiagnosis);
rutas.get('/show-medication', attentionController.showMedication);
rutas.patch('/create-medical-description/:id', attentionController.createMedicalDescription);
rutas.patch('/update-medical-description/:id', attentionController.updateMedicalDescription);
rutas.get('/show-prescription/:id', attentionController.showPrescription);
rutas.get('/show-turn', attentionController.showTurn);

export default rutas;