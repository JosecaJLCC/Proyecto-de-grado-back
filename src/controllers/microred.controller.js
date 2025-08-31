import { microredModel } from "../models/microred.model.js";

const createMicroRed = async(req, res)=>{
    try {
        const {nombre_microred, red, id_director}=req.body;
        /* Verificar que los campos no esten vacios */
        if(!nombre_microred || !red || !id_director){
            return res.status(400).json({ok:false, message:'Faltan datos de la microred por llenar'})
        }
        const verifyIfExistMicroRed = await microredModel.verifyIfExistMicroRed({nombre_microred});
        if(verifyIfExistMicroRed.length>0){
            return res.status(400).json({ok:false, message:'Ya existe un registro con el nombre de la microred'})
        }

        const verifyIfExistedMicroRed = await microredModel.verifyIfExistedMicroRed({nombre_microred});
        
        if(verifyIfExistedMicroRed.length>0){
            console.log("mi verificacion",verifyIfExistedMicroRed[0].id_microred)
            const updateMicroRed = await microredModel.reactivateMicroRed({id_microred:verifyIfExistedMicroRed[0].id_microred})
            return res.status(201).json({ok:true, message:"microred reestablecido con exito"});
        }

        const ahora = new Date();
        const fecha_creacion = ahora.toISOString().slice(0, 19).replace('T', ' ');
        const result = await microredModel.createMicroRed({nombre_microred, red, fecha_creacion, id_director})
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
            return res.status(200).json({ ok: true, data: [], message: 'No existen microreds registrados' });
        }
        res.status(200).json({ok:true, result});

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
        return res.status(400).json({ ok: false, message: 'El id_microred es obligatorio' });
    }
    try {
        const result = await microredModel.deleteMicroRed({id_microred});
        if(result.affectedRows<=0){
            return res.status(404).json({ ok: false, message: 'Microred no encontrada' });
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
        const { nombre_microred, red } = req.body;

        // Validación mínima
        if (!id_microred) {
            return res.status(400).json({ ok: false, message: 'El id_microred es obligatorio' });
        }

        const result = await microredModel.updateMicroRed({
            id_microred,
            nombre_microred: nombre_microred || null,
            red: red || null
        });
/* no estamos validando cuando se pase un id que no existe */

        res.status(200).json({ ok: true, message: 'Microred actualizada correctamente', result });

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