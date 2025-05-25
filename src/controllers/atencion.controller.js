
import { atencionModel } from "../models/atencion.model.js";

const registrarAtencion = async(req, res)=>{
    try {
        const {id_usuario, id_persona, id_establecimiento}=req.body;
        /* Verificar que los campos no esten vacios */
        console.log("mis datos",id_usuario, id_persona, id_establecimiento)
        if(!id_usuario || !id_persona || !id_establecimiento){
            return res.status(400).json({ok:false, message:'Faltan datos por llenar en ATENCION CONTROLLER'})
        }
       const resultado = await atencionModel.registrarAtencion({id_usuario, id_persona, id_establecimiento})
        if(resultado.affectedRows<=0){
            return res.status(404).json(`No existen establecimientos para agregrar`);
        }
        res.status(201).json({ok:true, message:"¡Registro de atención exitosa!"});
    } catch (error) {
        console.log("Error en registrar atencion", error)
    }
}

const mostrarAtencion = async(req, res) => {
    try {
        const resultado = await atencionModel.mostrarAtencion();
        console.log("my res attention", resultado.length)
        if(resultado.length<=0){
            return res.status(404).json(`No existen atenciones para mostrar`);
        }
        res.status(201).json({ok:true, resultado:resultado});
    } catch (error) {
        console.log("Error en mostrar atencion", error);
    }
}

const mostrarHistorialAtencion = async(req, res) => {
    try {
        const resultado = await atencionModel.mostrarHistorialAtencion();
        if(resultado.length<=0){
            return res.status(404).json(`No existen atenciones para mostrar`);
        }
        res.status(201).json({ok:true, resultado:resultado});
    } catch (error) {
        console.log("Error en mostrar el historial de atencion", error);
    }
}

export const atencionController = {
    registrarAtencion, 
    mostrarAtencion,
    mostrarHistorialAtencion,
    
}