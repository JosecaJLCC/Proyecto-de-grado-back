import { Router } from 'express';
import {getData, getDataById, postData, putDataById, deleteDataById} from '../controllers/usuario.controller.js'

 
export const rutas = Router();

rutas.get('/usuarios', getData)

rutas.get('/usuarios/:id', getDataById)

rutas.post('/usuarios', postData)

rutas.patch('/usuarios/:id', putDataById)

rutas.delete('/usuarios/:id', deleteDataById)

rutas.use('/',(req, res)=>{
    res.json("Url no encontrado en usuario")
})

export default rutas;