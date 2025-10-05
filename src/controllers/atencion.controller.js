import { attentionModel } from "../models/atencion.model.js";
import { fechaBolivia, fechaHoraBolivia } from "../utils/fechaBolivia.js";

const registrarAtencion = async(req, res)=>{
    try {
        const {id_usuario, id_persona, id_establecimiento}=req.body;
        /* Verificar que los campos no esten vacios */
        console.log("mis datos",id_usuario, id_persona, id_establecimiento)
        if(!id_usuario || !id_persona || !id_establecimiento){
            return res.status(400).json({ok:false, message:'Faltan datos por llenar en ATENCION CONTROLLER'})
        }
        const verificarAtencion = await atencionModel.verificarAtencion(id_persona)
        if(verificarAtencion.length>0){
            return res.status(409).json({ok:false, message:`El paciente ya fue registrado`});
        }
       const resultado = await atencionModel.registrarAtencion({id_usuario, id_persona, id_establecimiento})
        if(resultado.affectedRows<=0){
            return res.status(404).json({ok:false, message:`No existen establecimientos para agregrar`});
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

const showAttention = async(req, res)=>{
    try {
        const result = await attentionModel.showAttention();
        console.log("my res de show",result)
        if(result.length<=0){
            return res.status(200).json({ ok: true, data: [], message: 'No existen pacientes registrados' });
        }
        console.log("my res de show2",result)
        res.status(200).json({ok:true, data: result});

    } catch (error) {
        if (error.source === 'model') {
            console.log('Error del modelo:', error.message);
            res.status(500).json({ ok: false, message: 'Error en la base de datos: ' + error.message });
        } else {
            console.log('Error del controller:', error.message);
            res.status(500).json({ ok: false, message: 'Error del servidor: ' + error.message });
        }
    }
}

const createAttention = async(req, res)=>{
    try {
        const {id_paciente, id_usuario_rol}=req.body;
        console.log("crear atencion: ",req.body)
        if(!id_usuario_rol || !id_paciente){
            return res.status(200).json({ok:false, message:'Faltan datos por llenar'})
        }
        
        const fecha_atencion = fechaBolivia();
        
        let verifyAttention= await attentionModel.verifyAttention({id_paciente, fecha_atencion})
        console.log("verifyattention", verifyAttention)
        if(verifyAttention.length>0){
            return res.status(200).json({ok:false, message:`El paciente ya fue registrado`});
        }
        console.log("hizo la verify")
        const result = await attentionModel.createAttention({ id_usuario_rol, id_paciente, fecha_atencion })
        res.status(201).json({ok:true, data:result ,message:"Atencion agregado con exito"});

    } catch (error) {
        if (error.source === 'model') {
            console.log('Error del modelo:', error.message);
            res.status(500).json({ ok: false, message: 'Error en la base de datos: ' + error.message });
        } else {
            console.log('Error del controller:', error.message);
            res.status(500).json({ ok: false, message: 'Error del servidor: ' + error.message });
        }
    }
}

export const attentionController = {
    createAttention,
    showAttention
   /*  registrarAtencion, 
    mostrarAtencion,
    mostrarHistorialAtencion, */
    
}