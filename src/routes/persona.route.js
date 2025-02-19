import { Router } from 'express';
import {getData, getDataById, postData, putDataById, deleteDataById} from '../controllers/persona.controller.js'

 
export const rutas = Router();

rutas.get('/personas', getData)

rutas.get('/personas/:id', getDataById)

rutas.post('/personas', postData)

rutas.patch('/personas/:id', putDataById)

rutas.delete('/personas/:id', deleteDataById)

rutas.use('/',(req, res, next)=>{
    next();
})

export default rutas;