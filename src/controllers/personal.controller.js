import {staffModel} from "../models/personal.model.js";
import { fechaBolivia, fechaHoraBolivia } from "../utils/fechaBolivia.js";
const createStaff = async(req, res)=>{
    try {
        const { domicilio,
                ci, nombre, paterno, materno, nacionalidad,
                estado_civil, nro_telf, sexo, fecha_nacimiento,
                id_profesion, nombre_profesion, id_area, nombre_area, cargo, 
                nro_matricula, fecha_ingreso, id_microred} = req.body;
                console.log("body de staff: ",req.body)
        /* Verificar que los campos no esten vacios */
        if(!domicilio.departamento || !domicilio.municipio || !domicilio.zona ||
             !domicilio.av_calle || !domicilio.nro_puerta || 
            !ci || !nombre || !(paterno || materno) || !nacionalidad ||
            !estado_civil || !nro_telf || !sexo || !fecha_nacimiento ||
        !(id_profesion || nombre_profesion) || !(id_area || nombre_area) || !cargo){
            return res.status(200).json({ok:false, message:'Faltan datos del personal por llenar'})
        }
        /* Verifica si existe un personal con el mismo ci*/
        const verifyIfExistStaff = await staffModel.verifyIfExistStaff({ci});
        if(verifyIfExistStaff.length>0){
            return res.status(200).json({ok:false, message:'Ya existe un registro parecido'})
        }
        /* Verifica si existio el personal para reactivarla */
        const verifyIfExistedStaff = await staffModel.verifyIfExistedStaff({ci});
        if(verifyIfExistedStaff.length>0){
            return res.status(200).json({ok:false, message:"Personal existente pero inactivo"});
        }
        const fecha_creacion = fechaHoraBolivia();
        const result = await staffModel.createStaff({ departamento:domicilio.departamento, 
                                                    municipio:domicilio.municipio, zona:domicilio.zona, 
                                                    av_calle:domicilio.av_calle, nro_puerta:domicilio.nro_puerta,
                                                    ci, nombre, paterno, materno, nacionalidad,
                                                    estado_civil, nro_telf, sexo, fecha_nacimiento,
                                                    id_profesion, nombre_profesion, id_area, nombre_area, cargo, 
                                                    nro_matricula, fecha_ingreso, fecha_creacion, id_microred })
        res.status(201).json({ok:true, data:result ,message:"Personal agregado con exito"});
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

const showStaff = async(req, res)=>{
    const {estado_personal}=req.params
    console.log("estado personal:", estado_personal)
    try {
        const result = await staffModel.showStaff({estado_personal});
        if(result.length<=0){
            return res.status(200).json({ ok: false, data: [], message: 'No existe personal registrado' });
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

const deleteStaff = async(req, res)=>{
    const { id } = req.params;
    if (!id) {
        return res.status(200).json({ ok: false, message: 'El id del staff es obligatorio' });
    }
    try {
        /* Hace un update estado=0 si es que el personal existe*/
        const result = await staffModel.deleteStaff({id});
        if(result.affectedRows<=0){
            return res.status(200).json({ ok: false, message: 'staff no encontrado' });
        }
        res.status(200).json({ ok: true, message: 'staff eliminado correctamente' });
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

const reactivateStaff = async(req, res)=>{
    const { id } = req.params;
    if (!id) {
        return res.status(200).json({ ok: false, message: 'El id del staff es obligatorio' });
    }
    try {
        /* Hace un update estado=1*/
        const result = await staffModel.reactivateStaff({id});
        if(result.affectedRows<=0){
            return res.status(200).json({ ok: false, message: 'Personal no encontrado' });
        }
        res.status(200).json({ ok: true, message: 'Personal reactivado correctamente' });
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

const updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const { domicilio,
                ci, nombre, paterno, materno, nacionalidad,
                estado_civil, nro_telf, sexo, fecha_nacimiento,
                id_profesion, nombre_profesion, id_area, nombre_area, cargo, 
                nro_matricula, fecha_ingreso, id_microred} = req.body;  
        console.log("body de update:", req.body, req.params)     
        // Validación mínima
        if (!id) {
            return res.status(200).json({ ok: false, message: 'El id del personal es obligatorio' });
        }
        let resultStaffById = await staffModel.showStaffById({id});
        if(!resultStaffById.length){
            return res.status(200).json({ ok: false, message: 'Staff no encontrado' });
        }
        const id_direccion = resultStaffById[0].id_direccion;
        const id_persona = resultStaffById[0].id_persona;
        const result = await staffModel.updateStaff({
            id, id_direccion, id_persona,
            departamento: domicilio.departamento || null,
            municipio: domicilio.municipio || null,
            zona: domicilio.zona || null,
            av_calle: domicilio.av_calle || null,
            nro_puerta: domicilio.nro_puerta || null,
            ci: ci || null,
            nombre: nombre || null,
            paterno: paterno || null,
            materno: materno || null,
            nacionalidad: nacionalidad || null,
            estado_civil: estado_civil || null,
            nro_telf: nro_telf || null,
            sexo: sexo || null,
            fecha_nacimiento: fecha_nacimiento || null,
            id_profesion: id_profesion || null, 
            nombre_profesion: nombre_profesion || null, 
            id_area: id_area || null, 
            nombre_area: nombre_area || null, 
            cargo: cargo || null, 
            nro_matricula: nro_matricula || null,
            fecha_ingreso: fecha_ingreso || null,
            id_microred: id_microred || null
        });
        res.status(200).json({ ok: true, message: 'Staff actualizado correctamente', data: result });

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

const showProfession = async(req, res)=>{
    try {
        const result = await staffModel.showProfession();
        if(result.length<=0){
            return res.status(200).json({ ok: true, data: [], message: 'No existen profesiones registradas' });
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

const showWorkArea = async(req, res)=>{
    try {
        const result = await staffModel.showWorkArea();
        if(result.length<=0){
            return res.status(200).json({ ok: true, data: [], message: 'No existen areas de trabajo registrados' });
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

const showPosition = async(req, res)=>{
    try {
        const result = await staffModel.showPosition();
        if(result.length<=0){
            return res.status(200).json({ ok: true, data: [], message: 'No existen cargos registrados' });
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

export const staffController = {
    createStaff, 
    showStaff,
    deleteStaff,
    updateStaff,
    reactivateStaff,
    showProfession,
    showWorkArea,
    showPosition
}