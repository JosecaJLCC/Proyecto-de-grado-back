import { establecimientoModel } from "../models/establecimiento.model.js";
import { direccionModel } from "../models/direccion.model.js";
import { atencionModel } from "../models/atencion.model.js";

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
        console.log("Error en registrar atencion", error)
    }
}

const mostrarAtencion = async(req, res) => {
    try {
        const resultado = await atencionModel.mostrarAtencion();
        if(resultado[0].length<=0){
            return res.status(404).json(`No existen establecimientos para agregrar`);
        }
        res.status(201).json({ok:true, resultado:resultado});
    } catch (error) {
        console.log("Error en mostrar atencion", error);
    }
}

const mostrarHistorialAtencion = async(req, res) => {
    try {
        const resultado = await atencionModel.mostrarHistorialAtencion();
        if(resultado[0].length<=0){
            return res.status(404).json(`No existen establecimientos para agregrar`);
        }
        res.status(201).json({ok:true, resultado:resultado});
    } catch (error) {
        console.log("Error en mostrar el historial de atencion", error);
    }
}

export const atencionController = {
    registrarAtencion, 
    mostrarAtencion,
    mostrarHistorialAtencion,
    
}