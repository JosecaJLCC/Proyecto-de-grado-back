import { attentionModel } from "../models/atencion.model.js";
import { medicationModel } from "../models/medicamento.model.js";
import {diagnosisModel} from '../models/diagnostico.model.js'
import { fechaBolivia, fechaHoraBolivia } from "../utils/fechaBolivia.js";
import { obtenerTurnoPorHora} from '../utils/ObtenerTurno.js'

const showAttention = async(req, res)=>{
    try {
        const result = await attentionModel.showAttention();
        if(result.length<=0){
            return res.status(200).json({ ok: false, data: [], message: 'No existen atenciones registradas' });
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

const showStatus = async(req, res)=>{
    try {
        const result = await attentionModel.showStatus();
        if(result.length<=0){
            return res.status(200).json({ ok: false, data: [], message: 'No existen atenciones' });
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


const showTurn = async (req, res) => {
  try {
    const fecha_bolivia = fechaHoraBolivia();
    const hora = new Date(fecha_bolivia).getHours();
    const minuto=new Date(fecha_bolivia).getMinutes();
    let result = null;
    console.log("mi turno es:",hora)
    if (hora==12 && minuto==1) {
        console.log("aaa"); 
        result = await attentionModel.verifyTurn({ turno:"MAÑANA" });
    } 
    else if (hora==16 && minuto==1) {
        console.log("aaa");
      result = await attentionModel.verifyTurn({ turno:"TARDE" });
    }
    else {
      return res.status(200).json({
        ok: false,
        message: "Aún no corresponde cerrar ningún turno"
      });
    }
    res.status(200).json({ ok: true, data:result, message: "Cambios hechos"});

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message
    });
  }
};

const showReport= async (req, res) => {
    const {fecha_inicial, fecha_final}=req.body;
    console.log("fechas: ",fecha_inicial, fecha_final)
    let result=""
    try {
        if (fecha_inicial<=fecha_final) {
            result = await attentionModel.showReport({ fecha_inicial, fecha_final });
        }
        else{
            return res.status(200).json({ ok: false, message:"Incompatibilidad de fechas" });
        }
        res.status(200).json({ ok: true, data:result });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: error.message
        });
    }
};

const createAttention = async(req, res)=>{
    try {
        const {id_usuario_rol_atencion, id_paciente, id_area, estado_atencion, turno}=req.body;
        
        if(!id_usuario_rol_atencion || !id_paciente || !id_area || !estado_atencion || !turno){
            return res.status(200).json({ok:false, message:'Faltan datos por llenar'})
        }   
        const fecha_atencion = fechaBolivia();   
        let verifyAttention= await attentionModel.verifyAttention({id_paciente, id_area, fecha_atencion})
        if(verifyAttention.length>0){
            console.log("si fue atendido");
            return res.status(200).json({ok:false, message:`El paciente fue atendido`});
        }
            console.log("no fue atendido");
        
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
        
        if(result.length<=0){
            return res.status(200).json({ ok: false, data: [], message: 'No existen medicamentos registrados' });
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

const showPrescription = async(req, res)=>{
        const {id}=req.params;
    try {
        const result = await attentionModel.showMedicalDescription({id});
        
        if(result.length<=0){
            return res.status(200).json({ ok: false, data: [], message: 'No existen medicamentos registrados' });
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

const createMedicalDescription = async (req, res) => {
    try {
        const { id } = req.params;
        const { receta, diagnostico, estado_atencion, id_usuario_rol_diagnostico } = req.body;  
        
        /*Creacion de la receta medica*/
        let fecha_emision=fechaHoraBolivia();
        let resultMedicalDescription= await medicationModel.createPrescription({fecha_emision});
        let id_receta=resultMedicalDescription.insertId;
        
        /*Creacion del diagnostico si existe agarra el id, y si no, crea un nuevo diagnostico*/
        let id_diagnostico=0;
        
        let verifyDiagnosis = await diagnosisModel.verifyDiagnosis({
            nombre_diagnostico:diagnostico.nombre_diagnostico
        });
          
        let resultDiagnosis="";
        if(!verifyDiagnosis.length){
            resultDiagnosis=await diagnosisModel.createDiagnosis(diagnostico);
            id_diagnostico=resultDiagnosis.insertId;
            
        }
        else{
            id_diagnostico=verifyDiagnosis[0].id;
        }
        
        /* Crea la relacion receta_detalle creando a la vez si no existen los medicamentos, y si existen agarra sus id*/
        if(receta.length){
            await medicationModel.createMedication(id_receta, receta);
        }
        
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
    showTurn,
    showStatus,
    showReport
}