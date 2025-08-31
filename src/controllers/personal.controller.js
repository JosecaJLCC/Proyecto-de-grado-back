import {staffModel} from "../models/personal.model.js";

const createStaff = async(req, res)=>{
    try {
        const { departamento, municipio, zona, av_calle, nro_puerta,
                ci, extension, nombre, paterno, materno, nacionalidad,
                estado_civil, nro_telf, sexo, fecha_nacimiento,
                id_profesion, id_area,cargo, nro_matricula, fecha_ingreso, id_microred} = req.body;
        /* Verificar que los campos no esten vacios */
        if(!departamento || !municipio || !zona || !av_calle || !nro_puerta || 
            !ci || !extension || !nombre || !paterno || !materno || !nacionalidad ||
            !estado_civil || !nro_telf || !sexo || !fecha_nacimiento ||
        !id_profesion || !id_area || !cargo){
            return res.status(400).json({ok:false, message:'Faltan datos del staff por llenar'})
        }
        const verifyIfExistStaff = await staffModel.verifyIfExistStaff({ci, extension});
        if(verifyIfExistStaff.length>0){
            return res.status(400).json({ok:false, message:'Ya existe un registro con el ci del staff'})
        }

        const verifyIfExistedStaff = await staffModel.verifyIfExistedStaff({ci, extension});
        if(verifyIfExistedStaff.length>0){
            console.log("mi verificacion",verifyIfExistedStaff[0].id_personal)
            const updateStaff = await staffModel.reactivateStaff({id_personal:verifyIfExistedStaff[0].id_personal})
            return res.status(201).json({ok:true, message:"staff reestablecido con exito"});
        }
        const ahora = new Date();
        const fecha_creacion = ahora.toISOString().slice(0, 19).replace('T', ' ');
        const result = await staffModel.createStaff({ departamento, municipio, zona, av_calle, nro_puerta,
                                                        ci, extension, nombre, paterno, materno, nacionalidad,
                                                        estado_civil, nro_telf, sexo, fecha_nacimiento,
                                                        id_profesion, id_area,cargo, nro_matricula, fecha_ingreso, fecha_creacion, id_microred })
        res.status(201).json({ok:true, data:result ,message:"staff agregado con exito"});
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
    try {
        const result = await staffModel.showStaff();
        if(result.length<=0){
            return res.status(200).json({ ok: true, data: [], message: 'No existe staff registrado' });
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
    const { id_personal } = req.params;
    if (!id_personal) {
        return res.status(400).json({ ok: false, message: 'El id del staff es obligatorio' });
    }
    try {
        const result = await staffModel.deleteStaff({id_personal});
        if(result.affectedRows<=0){
            return res.status(404).json({ ok: false, message: 'staff no encontrado' });
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
export const updateStaff = async (req, res) => {
    try {
        const { id_personal } = req.params;
        const { departamento, municipio, zona, av_calle, nro_puerta,
            ci, extension, nombre, paterno, materno, nacionalidad,
            estado_civil, nro_telf, sexo, fecha_nacimiento,
            cargo, id_area} = req.body;       
        // Validación mínima
        if (!id_personal) {
            return res.status(400).json({ ok: false, message: 'El id del personal es obligatorio' });
        }
        let resultStaffById = await staffModel.showStaffById({id_personal});
        if(!resultStaffById.length){
            return res.status(404).json({ ok: false, message: 'Staff no encontrado' });
        }
        const id_direccion = resultStaffById[0].id_domicilio;
        const id_persona = resultStaffById[0].id_persona;
        const result = await staffModel.updateStaff({
            id_personal, id_direccion, id_persona,
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
            cargo: cargo || null,
            id_area: id_area|| null
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

export const staffController = {
    createStaff, 
    showStaff,
    deleteStaff,
    updateStaff
}