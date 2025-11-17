import {patientModel} from "../models/paciente.model.js";
import { fechaBolivia, fechaHoraBolivia } from "../utils/fechaBolivia.js";
const createPatient = async(req, res)=>{
    try {
        const { domicilio,
                ci, nombre, paterno, materno, nacionalidad,
                estado_civil, nro_telf, sexo, fecha_nacimiento,
                id_microred, nombre_carpeta} = req.body;
                console.log("req body de paciente: ",req.body) 
        /* Verificar que los campos no esten vacios */
        if(!domicilio.departamento || !domicilio.municipio || !domicilio.zona 
            || !domicilio.av_calle || !domicilio.nro_puerta || 
            !ci || !nombre || !nacionalidad || !estado_civil || 
            !nro_telf || !sexo || !fecha_nacimiento || !id_microred || !nombre_carpeta){
            return res.status(200).json({ok:false, message:'Faltan datos del paciente por llenar'})
        }
        const verifyIfExistPatient = await patientModel.verifyIfExistPatient({ci});
        /* Verifica si existe el paciente */
        if(verifyIfExistPatient.length>0){
            return res.status(200).json({ok:false, message:'Ya existe un registro con el ci del paciente'})
        }
        const verifyIfExistedPatient = await patientModel.verifyIfExistedPatient({ci});
        /* Verifica si existió el paciente */
        if(verifyIfExistedPatient.length>0){
            console.log("mi verificacion",verifyIfExistedPatient[0].id)
            const id_domicilio = verifyIfExistedPatient[0].id_domicilio;
            const id_persona = verifyIfExistedPatient[0].id_persona;

             await patientModel.reactivatePatient({id:verifyIfExistedPatient[0].id,
                id_persona, id_domicilio,
                departamento:domicilio.departamento, 
                municipio:domicilio.municipio,
                zona:domicilio.zona, 
                av_calle:domicilio.av_calle, 
                nro_puerta:domicilio.nro_puerta,
                ci, nombre, paterno, materno, nacionalidad,
                estado_civil, nro_telf, sexo, fecha_nacimiento,
                id_microred, nombre_carpeta
             })
            return res.status(201).json({ok:true, message:"establecimiento reestablecido con exito"});
        }
        /* Verifica que exista la carpeta del paciente */
        const verifyIfExistFolder = await patientModel.verifyIfExistFolder({nombre_carpeta});
        let id_carpeta="";
        if(verifyIfExistFolder.length<=0){
            const createFolder=await patientModel.createFolder({nombre_carpeta});
            id_carpeta=createFolder.insertId;
        }
        id_carpeta=verifyIfExistFolder[0].id_carpeta;
        const fecha_creacion = fechaHoraBolivia();
        const result = await patientModel.createPatient({ departamento:domicilio.departamento, 
                                                    municipio:domicilio.municipio, zona:domicilio.zona, 
                                                    av_calle:domicilio.av_calle, nro_puerta:domicilio.nro_puerta,
                                                    ci, nombre, paterno, materno, nacionalidad,
                                                    estado_civil, nro_telf, sexo, fecha_nacimiento, fecha_creacion,
                                                    id_microred, id_carpeta})
        res.status(201).json({ok:true, data:result ,message:"Paciente agregado con exito"});
    } catch (error) {
        if (error.source === 'model') {
            console.log('Error del modelo:', error.message);
            res.status(500).json({ ok: false, message: 'Error en la base de datos: ' + error.message });
        } else {
            console.log('Error del controller patient:', error.message);
            res.status(500).json({ ok: false, message: 'Error del servidor: ' + error.message });
        }
    }
}

const showPatient = async(req, res)=>{
    try {
        const result = await patientModel.showPatient();
        if(result.length<=0){
            return res.status(200).json({ ok: true, data: [], message: 'No existen pacientes registrados' });
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


const showFolder = async(req, res)=>{
    try {
        const result = await patientModel.showFolder()
        if(result.length<=0){
            return res.status(200).json({ ok: true, data: [], message: 'No existen carpetas registradas' });
        }
        res.status(200).json({ok:true, data:result});

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

const deletePatient = async(req, res)=>{
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ ok: false, message: 'El id de persona es obligatorio' });
    }
    try {
        const result = await patientModel.deletePatient({id});
        if(result.affectedRows<=0){
            return res.status(404).json({ ok: false, message: 'Paciente no encontrado' });
        }
        res.status(200).json({ ok: true, message: 'Paciente eliminado correctamente' });

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
export const updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const { domicilio,
            ci, nombre, paterno, materno, nacionalidad,
            estado_civil, nro_telf, sexo, fecha_nacimiento, 
            id_microred, nombre_carpeta,
            tipo_sangre, peso, estatura} = req.body;       
        // Validación mínima
        if (!id) {
            return res.status(400).json({ ok: false, message: 'El id de establecimiento es obligatorio' });
        }

        let resultPatientById = await patientModel.showPatientById({id});
        const id_domicilio = resultPatientById[0].id_domicilio;
        const id_persona = resultPatientById[0].id_persona;
        const result = await patientModel.updatePatient({
            id, id_domicilio, id_persona,
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
            tipo_sangre: tipo_sangre || null,
            peso: peso || null,
            estatura: estatura || null,
            id_microred: id_microred || null,
            nombre_carpeta: nombre_carpeta || null
        });
        /* no estamos validando cuando se pase un id que no existe */
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

export const patientController = {
    createPatient, 
    showPatient,
    deletePatient,
    updatePatient,
    showFolder
}