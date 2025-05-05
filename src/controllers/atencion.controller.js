import { establecimientoModel } from "../models/establecimiento.model.js";
import { direccionModel } from "../models/direccion.model.js";

const registrarAtencion = async(req, res)=>{
    try {
        const {id_usuario, id_persona, id_establecimiento}=req.body;
        /* Verificar que los campos no esten vacios */
        if(!id_usuario || !id_persona || !id_establecimiento){
            return res.status(400).json({ok:false, message:'Faltan datos por llenar en ATENCION CONTROLLER'})
        }

        const verificarEstablecimiento= await establecimientoModel.verificarEstablecimiento(nombre_establecimiento);
        if(verificarEstablecimiento.length>0){
            return res.status(400).json({ok:false, message:'Ya existe un registro con el nombre del establecimiento'})
        }

        const direccionResultado = await direccionModel.crearDireccion({departamento, municipio, zona, av_calle})

        if(direccionResultado.affectedRows<=0){
            return res.status(404).json(`No existen direccion para agregrar`);
        }

        let id_centro_salud = direccionResultado.insertId;

        const establecimientoResultado = await establecimientoModel.crearEstablecimiento({id_establecimiento: id_centro_salud, nombre: nombre_establecimiento})

        if(establecimientoResultado.affectedRows<=0){
            return res.status(404).json(`No existen establecimientos para agregrar`);
        }
        res.status(201).json({ok:true, message:"Establecimiento agregada con exito"});
    } catch (error) {
        console.log("Error en Crear Establecimiento", error)
    }
}


export const establecimientoController = {
    registrarAtencion, 
    
}