import { fechaHoraBolivia } from "../utils/fechaBolivia.js";
import { microredModel } from "../models/microred.model.js";

const createMicroRed = async(req, res)=>{
    try {
        const {codigo, nombre_microred, red, ci_director}=req.body;
        console.log("mi microred:", req.body)
        /* Verificar que los campos no esten vacios */
        if(!codigo || !nombre_microred || !red || !ci_director){
            return res.status(200).json({ok:false, message:'Faltan datos de la microred por llenar'})
        }
        /* Verifica si existe una microred con el mismo codigo antes de crear*/
        const verifyIfExistMicroRed = await microredModel.verifyIfExistMicroRed({codigo});
        if(verifyIfExistMicroRed.length>0){
            return res.status(200).json({ok:false, message:'Microred existente'})
        }
        /* Verifica si existe el ci del director */
        const verifyDirector = await microredModel.directorMicroRed({ci_director})
        if(verifyDirector.length<=0){
            return res.status(200).json({ok:false, message:`Personal con el ci: ${ci_director} inexistente`})
        }
        let id_director = verifyDirector[0].id;
        /* Verifica si existio la microred para reactivarla */
        const verifyIfExistedMicroRed = await microredModel.verifyIfExistedMicroRed({codigo});
        if(verifyIfExistedMicroRed.length>0){
            return res.status(200).json({ok:false, message:"Microred existente pero inactiva"});
        }
        const fecha_creacion = fechaHoraBolivia();
        const result = await microredModel.createMicroRed({codigo, nombre_microred, red, fecha_creacion, id_director})
        res.status(201).json({ok:true, data:result ,message:"microred agregada con exito"});
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

const showMicroRed = async(req, res)=>{
    const {estado_microred}=req.params
    
    try {
        const result = await microredModel.showMicroRed({estado_microred});
        if(result.length<=0){
            return res.status(200).json({ ok: false, data: [], message: 'No existen microreds registrados' });
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

const deleteMicroRed = async(req, res)=>{
    const { codigo } = req.params;
    try {
        /* Hace un update estado=0 si es que la microred existe*/
        const result = await microredModel.deleteMicroRed({codigo});
        if(result.affectedRows<=0){
            return res.status(200).json({ ok: false, message: 'Microred no encontrada' });
        }
        res.status(200).json({ ok: true, message: 'Microred eliminada correctamente' });
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

const reactivateMicroRed = async(req, res)=>{
    const { codigo } = req.params;
    try {
        /* Hace un update estado=1*/
        const result = await microredModel.reactivateMicroRed({codigo});
        if(result.affectedRows<=0){
            return res.status(200).json({ ok: false, message: 'Microred no encontrada' });
        }
        res.status(200).json({ ok: true, message: 'Microred reactivada correctamente' });
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

export const updateMicroRed = async (req, res) => {
    try {
        const { codigo } = req.params;
        const { nombre_microred, red, ci_director } = req.body;
        
        let id_director="";

        /* Verifica si existe el director */
        if(ci_director){
            const verifyDirector = await microredModel.directorMicroRed({ci_director})
            if(verifyDirector.length<=0){
                return res.status(200).json({ok:false, message:`No existe ningun personal con el ci: ${ci_director}`})
            }
            id_director = verifyDirector[0].id;
        }
        /* Se envia los parametros para hacer el update */      
        const result = await microredModel.updateMicroRed({
            codigo,
            nombre_microred: nombre_microred || null,
            red: red || null,
            id_director: id_director || null
        });
        res.status(200).json({ ok: true, message: 'Microred actualizada correctamente', data:result });
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

export const microredController = {
    createMicroRed, 
    showMicroRed,
    deleteMicroRed,
    updateMicroRed,
    reactivateMicroRed
}