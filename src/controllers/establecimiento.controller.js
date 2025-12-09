import {establishmentModel} from "../models/establecimiento.model.js";
import { logsModel } from "../models/logs.model.js";
import {fechaHoraBolivia } from "../utils/fechaBolivia.js";
const createEstablishment = async(req, res)=>{
    try {
        const { departamento, municipio, zona, av_calle, 
            nombre_establecimiento, tipo_establecimiento, 
         id_microred, id_usuario_rol } = req.body;
        /* Verificar que los campos no esten vacios */
        if(!departamento || !municipio || !zona || !av_calle ||
            !nombre_establecimiento || !tipo_establecimiento || !id_microred){
            return res.status(200).json({ok:false, message:'Faltan datos del establecimiento por llenar'})
        }
        /* Verifica si existe un establecimiento con el mismo nombre antes de crear*/
        const verifyIfExistEstablishment = await establishmentModel.verifyIfExistEstablishment({nombre_establecimiento});
        if(verifyIfExistEstablishment.length>0){
            return res.status(200).json({ok:false, message:'Establecimiento existente'})
        }
        /* Verifica si existio el establecimiento para reactivarla */
        const verifyIfExistedEstablishment = await establishmentModel.verifyIfExistedEstablishment({nombre_establecimiento});
        if(verifyIfExistedEstablishment.length>0){
            return res.status(200).json({ok:false, message:"establecimiento existente pero inactiva"});
        }
        
        const fecha_creacion = fechaHoraBolivia();
        const result = await establishmentModel.createEstablishment({ departamento, municipio, zona, av_calle, 
                                                                    nombre_establecimiento, tipo_establecimiento, 
                                                                 fecha_creacion, id_microred })
        let tabla_id=result.insertId;

        const resultLog=await logsModel.logsUpdate({
            id_usuario_rol, 
            tabla: "ESTABLECIMIENTO",
            tabla_id,
            accion: "CREAR",
            fecha_log:fecha_creacion})
        res.status(201).json({ok:true, data:result ,message:"establecimiento agregado con exito"});
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

const showEstablishment = async(req, res)=>{
    const {estado_establecimiento}=req.params
    
    try {
        const result = await establishmentModel.showEstablishment({estado_establecimiento});
        if(result.length<=0){
            return res.status(200).json({ ok: true, data: [], message: 'No existen establecimientos registrados' });
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

const deleteEstablishment = async(req, res)=>{
    const { id } = req.params;
    const {id_usuario_rol}=req.body;
    console.log("delete body", req.body)
    let fecha_log=fechaHoraBolivia();
    try {
        /* Hace un update estado=0 si es que el estableicimiento existe*/
        const result = await establishmentModel.deleteEstablishment({id});
        if(result.affectedRows<=0){
            return res.status(200).json({ ok: false, message: 'Establecimiento no encontrado' });
        }
        const resultLog= await logsModel.logsUpdate({
            id_usuario_rol,
            tabla:"ESTABLECIMIENTO",
            tabla_id: id,
            accion: "MODIFICAR",
            fecha_log
        })
        res.status(200).json({ ok: true, message: 'Establecimiento eliminado correctamente' });
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

const reactivateEstablishment = async(req, res)=>{
    const { id } = req.params;
    const {id_usuario_rol}=req.body;
    let fecha_log=fechaHoraBolivia();
    try {
        /* Hace un update estado=1*/
        const result = await establishmentModel.reactivateEstablishment({id});
        if(result.affectedRows<=0){
            return res.status(200).json({ ok: false, message: 'Establecimiento no encontrado' });
        }
        const resultLog= await logsModel.logsUpdate({
            id_usuario_rol,
            tabla:"ESTABLECIMIENTO",
            tabla_id: id,
            accion: "MODIFICAR",
            fecha_log
        })
        res.status(200).json({ ok: true, message: 'Establecimiento reactivado correctamente' });
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

export const updateEstablishment = async (req, res) => {
    try {
        const { id } = req.params;
        const { departamento, municipio, zona, av_calle, nombre_establecimiento, tipo_establecimiento, id_microred, id_usuario_rol } = req.body;
        let fecha_log=fechaHoraBolivia();
        const result = await establishmentModel.updateEstablishment({
            id,
            nombre_establecimiento: nombre_establecimiento || null,
            tipo_establecimiento: tipo_establecimiento || null,
            id_microred: id_microred || null,
            departamento: departamento || null,
            municipio: municipio || null,
            zona: zona || null,
            av_calle: av_calle || null
        });
        const resultLog=await logsModel.logsUpdate({
            id_usuario_rol, 
            tabla: "ESTABLECIMIENTO",
            tabla_id:id,
            accion: "MODIFICAR",
            fecha_log})
        res.status(200).json({ ok: true, message: 'Establecimiento actualizado correctamente', data: result });
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

export const establishmentController = {
    createEstablishment, 
    showEstablishment,
    deleteEstablishment,
    updateEstablishment,
    reactivateEstablishment
}