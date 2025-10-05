import { fechaHoraBolivia } from "../utils/fechaBolivia.js";
import { microredModel } from "../models/microred.model.js";

const createMicroRed = async(req, res)=>{
    try {
        const {id_microred, nombre_microred, red, ci_director}=req.body;
        console.log("mi microred:", req.body)
        /* Verificar que los campos no esten vacios */
        if(!id_microred || !nombre_microred || !red || !ci_director){
            return res.status(200).json({ok:false, message:'Faltan datos de la microred por llenar'})
        }
        /* Verifica si existe una microred con el mismo id antes de crear*/
        const verifyIfExistMicroRed = await microredModel.verifyIfExistMicroRed({id_microred});
        if(verifyIfExistMicroRed.length>0){
            return res.status(200).json({ok:false, message:'Ya existe un registro con el nombre de la microred'})
        }
        /* Verifica si existe el ci del director */
        const verifyDirector = await microredModel.directorMicroRed({ci_director})
        if(verifyDirector.length<=0){
            return res.status(200).json({ok:false, message:`No existe ningun personal con el ci: ${ci_director}`})
        }
        let id_director = verifyDirector[0].id_personal;
        /* Verifica si existio la microred para reactivarla si existio */
        const verifyIfExistedMicroRed = await microredModel.verifyIfExistedMicroRed({id_microred});
        if(verifyIfExistedMicroRed.length>0){
            console.log("mi verificacion",verifyIfExistedMicroRed[0].id_microred)
            await microredModel.reactivateMicroRed({id_microred:verifyIfExistedMicroRed[0].id_microred, nombre_microred, red, id_director})
            return res.status(201).json({ok:true, message:"microred reestablecido con exito"});
        }
        const fecha_creacion = fechaHoraBolivia();
        const result = await microredModel.createMicroRed({id_microred, nombre_microred, red, fecha_creacion, id_director})
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
    try {
        const result = await microredModel.showMicroRed();
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
    const { id_microred } = req.params;
    if (!id_microred) {
        return res.status(200).json({ ok: false, message: 'El id_microred es obligatorio' });
    }
    try {
        const result = await microredModel.deleteMicroRed({id_microred});
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
export const updateMicroRed = async (req, res) => {
    try {
        const { id_microred } = req.params;
        const { nombre_microred, red, ci_director } = req.body;
        let id_director="";
        // Validación mínima
        if (!id_microred) {
            return res.status(200).json({ ok: false, message: 'El id_microred es obligatorio' });
        }

        if(ci_director){
            const verifyDirector = await microredModel.directorMicroRed({ci_director})
            if(verifyDirector.length<=0){
                return res.status(200).json({ok:false, message:`No existe ningun personal con el ci: ${ci_director}`})
            }
            id_director = verifyDirector[0].id_personal;
        }
        
        const result = await microredModel.updateMicroRed({
            id_microred,
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
    updateMicroRed
    /* mostrarmicrored,
    actualizarmicrored,
    eliminarmicrored */
}