import { establecimientoModel } from "../models/establecimiento.model.js";
import { direccionModel } from "../models/direccion.model.js";

const crearEstablecimiento = async(req, res)=>{
    try {
        const {departamento, municipio, zona, av_calle,nombre_establecimiento}=req.body;
        /* Verificar que los campos no esten vacios */
        if(!departamento || !municipio || !zona || !av_calle || !nombre_establecimiento){
            return res.status(400).json({ok:false, message:'Faltan datos por llenar en ESTABLECIMIENTO CONTROLLER'})
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

const mostrarEstablecimiento = async(req, res)=>{
    try {
        const resultado = await establecimientoModel.mostrarEstablecimiento();
        if(resultado.length<=0){
            return res.status(404).json({ok:false, message:'No existen establecimientos registrados'})
        }
        res.status(200).json({ok:true, resultado});

    } catch (error) {
        console.log("Error en mostrar Establecimiento", error)
    }
}

export const establecimientoController = {
    crearEstablecimiento, 
    mostrarEstablecimiento
}