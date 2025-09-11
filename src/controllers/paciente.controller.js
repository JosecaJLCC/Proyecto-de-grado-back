import {patientModel} from "../models/paciente.model.js";
import { fechaBolivia, fechaHoraBolivia } from "../../hora.js";
const createPatient = async(req, res)=>{
    try {
        const { departamento, municipio, zona, av_calle, nro_puerta,
                ci, extension, nombre, paterno, materno, nacionalidad,
                estado_civil, nro_telf, sexo, fecha_nacimiento,
                id_microred, nombre_carpeta, color} = req.body;
        /* Verificar que los campos no esten vacios */
        if(!departamento || !municipio || !zona || !av_calle || !nro_puerta || 
            !ci || !extension || !nombre || !nacionalidad || !estado_civil || 
            !nro_telf || !sexo || !fecha_nacimiento || !id_microred || !nombre_carpeta){
            return res.status(400).json({ok:false, message:'Faltan datos del paciente por llenar'})
        }
        const verifyIfExistPatient = await patientModel.verifyIfExistPatient({ci, extension});
        if(verifyIfExistPatient.length>0){
            return res.status(400).json({ok:false, message:'Ya existe un registro con el ci del paciente'})
        }
        const verifyIfExistedPatient = await patientModel.verifyIfExistedPatient({ci, extension});
        if(verifyIfExistedPatient.length>0){
            console.log("mi verificacion",verifyIfExistedPatient[0].id_persona)
            const updatePatient = await patientModel.reactivatePatient({id_paciente:verifyIfExistedPatient[0].id_paciente})
            return res.status(201).json({ok:true, message:"establecimiento reestablecido con exito"});
        }
        
        const fecha_creacion = fechaHoraBolivia();
        const result = await patientModel.createPatient({ departamento, municipio, zona, av_calle, nro_puerta,
                                                    ci, extension, nombre, paterno, materno, nacionalidad,
                                                    estado_civil, nro_telf, sexo, fecha_nacimiento, fecha_creacion,
                                                    id_microred, nombre_carpeta, color })
        res.status(201).json({ok:true, data:result ,message:"Paciente agregado con exito"});
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

const showAttention = async(req, res)=>{
    try {
        const result = await patientModel.showAttention();
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

const createAttention = async(req, res)=>{
    try {
        const {id_paciente, id_usuario}=req.body;
        const result = await patientModel.createAttention({ id_paciente, id_usuario })
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

const deletePatient = async(req, res)=>{
    const { id_paciente } = req.params;
    if (!id_paciente) {
        return res.status(400).json({ ok: false, message: 'El id de persona es obligatorio' });
    }
    try {
        const result = await patientModel.deletePatient({id_paciente});
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
        const { id_paciente } = req.params;
        const { departamento, municipio, zona, av_calle, nro_puerta,
            ci, extension, nombre, paterno, materno, nacionalidad,
            estado_civil, nro_telf, sexo, fecha_nacimiento,
            tipo_sangre, peso, estatura} = req.body;       
        // Validación mínima
        if (!id_paciente) {
            return res.status(400).json({ ok: false, message: 'El id de establecimiento es obligatorio' });
        }
        let resultPatientById = await patientModel.showPatientById({id_paciente});
        const id_direccion = resultPatientById[0].id_domicilio;
        const id_persona = resultPatientById[0].id_persona;
        const id_domicilio = resultPatientById[0].id_domicilio;
        const result = await patientModel.updatePatient({
            id_paciente, id_direccion, id_persona, id_domicilio,
            departamento: departamento || null,
            municipio: municipio || null,
            zona: zona || null,
            av_calle: av_calle || null,
            nro_puerta: nro_puerta || null,
            ci: ci || null,
            extension: extension || null,
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
            estatura: estatura || null
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
    createAttention,
    showAttention
}