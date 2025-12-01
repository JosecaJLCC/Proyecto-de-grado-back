import { attentionModel } from "../models/atencion.model.js";
import { medicationModel } from "../models/medicamento.model.js";
import {diagnosisModel} from '../models/diagnostico.model.js'
import { fechaHoraBolivia } from "../utils/fechaBolivia.js";
import { obtenerTurnoPorHora} from '../utils/ObtenerTurno.js'

const showAttention = async(req, res)=>{
    try {
        const result = await attentionModel.showAttention();
        console.log("my res de show",result)
        if(result.length<=0){
            return res.status(200).json({ ok: false, data: [], message: 'No existen pacientes registrados' });
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

const showTurn= async(req, res)=>{
    try {
        let fecha_bolivia=fechaHoraBolivia();
        let turno=obtenerTurnoPorHora(fecha_bolivia)
        let result=""
        if(turno!=null){
            if(turno=="MAÑANA"){
            result = await attentionModel.verifyTurnMorning({turno, fecha_bolivia})
            }
            else if(turno=='TARDE'){
                result = await attentionModel.verifyTurnAfternoon({turno, fecha_bolivia})
            }  
        }
         
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
        const {id_usuario_rol_atencion, id_paciente, id_area, estado_atencion, turno}=req.body;
        console.log("crear atencion: ",req.body)
        if(!id_usuario_rol_atencion || !id_paciente || !id_area || !estado_atencion || !turno){
            return res.status(200).json({ok:false, message:'Faltan datos por llenar'})
        }   
        const fecha_atencion = fechaHoraBolivia();   
        let verifyAttention= await attentionModel.verifyAttention({id_paciente, id_area, fecha_atencion})
        console.log("verifyattention", verifyAttention)
        if(verifyAttention.length>0){
            return res.status(200).json({ok:false, message:`El paciente fue atendido`});
        }
        console.log("hizo la verify")
        const result = await attentionModel.createAttention({ id_usuario_rol_atencion, id_paciente, id_area, estado_atencion, fecha_atencion, turno })
        res.status(201).json({ok:true, data:result ,message:"Atención agregada con éxito"});
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

const showDiagnosis = async(req, res)=>{
    try {
        const result = await diagnosisModel.showDiagnosis();
        console.log("my res de diagnostico: ",result)
        if(result.length<=0){
            return res.status(200).json({ ok: false, data: [], message: 'No existen diagnosticos registrados' });
        }
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

const showMedication = async(req, res)=>{
    try {
        const result = await medicationModel.showMedication();
        console.log("my res de medicamento",result)
        if(result.length<=0){
            return res.status(200).json({ ok: false, data: [], message: 'No existen medicamentos registrados' });
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

const showPrescription = async(req, res)=>{
        const {id}=req.params;
    try {
        const result = await attentionModel.showMedicalDescription({id});
        console.log("my res de medicamento",result)
        if(result.length<=0){
            return res.status(200).json({ ok: false, data: [], message: 'No existen medicamentos registrados' });
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

const createMedicalDescription = async (req, res) => {
    try {
        const { id } = req.params;
        const { receta, diagnostico, estado_atencion, id_usuario_rol_diagnostico } = req.body;  
        console.log("body de update:", req.body, req.params)
        /*Creacion de la receta medica*/
        let fecha_emision=fechaHoraBolivia();
        let resultMedicalDescription= await medicationModel.createPrescription({fecha_emision});
        let id_receta=resultMedicalDescription.insertId;
        console.log("id receta: ", id_receta)
        /*Creacion del diagnostico si existe agarra el id, y si no, crea un nuevo diagnostico*/
        let id_diagnostico=0;
        
        let verifyDiagnosis = await diagnosisModel.verifyDiagnosis({
            nombre_diagnostico:diagnostico.nombre_diagnostico
        });
        console.log("result diagnosis: ", verifyDiagnosis)  
        let resultDiagnosis="";
        if(!verifyDiagnosis.length){
            resultDiagnosis=await diagnosisModel.createDiagnosis(diagnostico);
            id_diagnostico=resultDiagnosis.insertId;
            console.log("id diagnostico if: ", id_diagnostico)
        }
        else{
            id_diagnostico=verifyDiagnosis[0].id;
            console.log("id diagnostico else e: ", id_diagnostico)
        }
        
        /* Crea la relacion receta_detalle creando a la vez si no existen los medicamentos, y si existen agarra sus id*/
        if(receta.length){
            await medicationModel.createMedication(id_receta, receta);
        }
        console.log("estado atencion:: ",estado_atencion)
        const result = await attentionModel.updateAttention({
            id, 
            id_receta: id_receta || null, 
            id_diagnostico: id_diagnostico || null,
            estado_atencion,
            id_usuario_rol_diagnostico
        }); 
        res.status(200).json({ ok: true, message: 'Atencion actualizada correctamente'/* , data: result  */});

    } catch (error) {
        if (error.source === 'model') {
            console.log('Error del modelo:', error.message);
            res.status(500).json({ ok: false, message: 'Error en la base de datos: ' + error.message });
        } else {
            console.log('Error del controller:', error.message);
            res.status(500).json({ ok: false, message: 'Error del servidor: ' + error.message });
        }
    }
};

const updateMedicalDescription = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado_atencion, resultPrescription, id_usuario_rol_farmacia } = req.body;  
        console.log("body de updated:", resultPrescription)
        /*Creacion de la receta medica*/
        let updateAttention=await attentionModel.updateAttention({id, id_usuario_rol_farmacia, estado_atencion});

        let resultUpdateMedication= await medicationModel.updateMedication(resultPrescription);
        
        res.status(200).json({ ok: true, message: 'Atencion actualizada correctamente'/* , data: result  */});

    } catch (error) {
        if (error.source === 'model') {
            console.log('Error del modelo:', error.message);
            res.status(500).json({ ok: false, message: 'Error en la base de datos: ' + error.message });
        } else {
            console.log('Error del controller:', error.message);
            res.status(500).json({ ok: false, message: 'Error del servidor: ' + error.message });
        }
    }
};

export const attentionController = {
    createAttention,
    showAttention,
    showMedication,
    showDiagnosis,
    createMedicalDescription,
    updateMedicalDescription,
    showPrescription,
    showTurn
}