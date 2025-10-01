import {establishmentModel} from "../models/establecimiento.model.js";
import { fechaBolivia, fechaHoraBolivia } from "../../hora.js";
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

        const verifyIfExistEstablishment = await establishmentModel.verifyIfExistEstablishment({nombre_establecimiento});
        if(verifyIfExistEstablishment.length>0){
            return res.status(200).json({ok:false, message:'Ya existe un registro con el codigo del establecimiento'})
        }

        const verifyIfExistedEstablishment = await establishmentModel.verifyIfExistedEstablishment({nombre_establecimiento});
        if(verifyIfExistedEstablishment.length>0){
            console.log("mi verificacion",verifyIfExistedEstablishment[0].id_establecimiento)
            await establishmentModel.reactivateEstablishment({id_establecimiento:verifyIfExistedEstablishment[0].id_establecimiento,
                                                            departamento, municipio, zona, av_calle,
                                                            nombre_establecimiento, tipo_establecimiento, id_microred
            })
            return res.status(201).json({ok:true, message:"establecimiento reestablecido con exito"});
        }
        
        const fecha_creacion = fechaHoraBolivia();
        console.log("mi fecha de creacion: ",fecha_creacion)
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
    try {
        const result = await establishmentModel.showEstablishment();
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
    const { id_establecimiento } = req.params;
    if (!id_establecimiento) {
        return res.status(200).json({ ok: false, message: 'El id de establecimiento es obligatorio' });
    }
    try {
        const result = await establishmentModel.deleteEstablishment({id_establecimiento});
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
export const updateEstablishment = async (req, res) => {
    try {
        const { id_establecimiento } = req.params;
        const { departamento, municipio, zona, av_calle, nombre_establecimiento, tipo_establecimiento, id_microred } = req.body;
        console.log("update establishment",req.body, req.params)
                                
        // Validación mínima
        if (!id_establecimiento) {
            return res.status(200).json({ ok: false, message: 'El id de establecimiento es obligatorio' });
        }
 console.log("entro")
        const result = await establishmentModel.updateEstablishment({
            id_establecimiento,
            nombre_establecimiento: nombre_establecimiento || null,
            tipo_establecimiento: tipo_establecimiento || null,
            id_microred: id_microred || null,
            departamento: departamento || null,
            municipio: municipio || null,
            zona: zona || null,
            av_calle: av_calle || null
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

export const establishmentController = {
    createEstablishment, 
    showEstablishment,
    deleteEstablishment,
    updateEstablishment
}