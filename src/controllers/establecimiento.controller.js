import {establishmentModel} from "../models/establecimiento.model.js";
import {fechaHoraBolivia } from "../utils/fechaBolivia.js";
const createEstablishment = async(req, res)=>{
    try {
        const { departamento, municipio, zona, av_calle, 
            nombre_establecimiento, tipo_establecimiento, 
         id_microred } = req.body;
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
    console.log("estado establecimiento:", estado_establecimiento)
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
    if (!id) {
        return res.status(200).json({ ok: false, message: 'El id de establecimiento es obligatorio' });
    }
    try {
        /* Hace un update estado=0 si es que el estableicimiento existe*/
        const result = await establishmentModel.deleteEstablishment({id});
        if(result.affectedRows<=0){
            return res.status(200).json({ ok: false, message: 'Establecimiento no encontrado' });
        }
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
    if (!id) {
        return res.status(200).json({ ok: false, message: 'El id de establecimiento es obligatorio' });
    }
    try {
        /* Hace un update estado=1*/
        const result = await establishmentModel.reactivateEstablishment({id});
        if(result.affectedRows<=0){
            return res.status(200).json({ ok: false, message: 'Establecimiento no encontrado' });
        }
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
        const { departamento, municipio, zona, av_calle, nombre_establecimiento, tipo_establecimiento, id_microred } = req.body;
        console.log("update establishment",req.body, req.params)                         
        // Validación mínima
        if (!id) {
            return res.status(200).json({ ok: false, message: 'El id de establecimiento es obligatorio' });
        }
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