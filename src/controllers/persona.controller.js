import { direccionModel } from "../models/direccion.model.js";
import { personaModel } from "../models/persona.model.js";
import { domicilioModel } from '../models/domicilio.model.js'

export const crearPersona = async(req, res)=>{
    try {
        const {ci, extension, 
            nombre, paterno, materno, 
            nacionalidad, estado_civil, 
            nro_telf, sexo, fecha_nacimiento, 
            departamento, municipio, zona, av_calle, nro_puerta}=req.body;
            /* Verificar que los campos no esten vacios */
        if(!ci || !extension ||
            !nombre || !paterno || !materno || 
            !nacionalidad || !estado_civil || 
            !nro_telf || !sexo || !fecha_nacimiento ||
            !departamento || !municipio || !zona || !av_calle || !nro_puerta){
                return res.status(400).json({ok:false, message:'Faltan datos por llenar'})
            }

        /* Verificamos si el ci existe */
        const verificarCI= await personaModel.verificarCI(ci, extension);
        /* console.log("mi verificacion de ci",verificarCI.length) */
        if(verificarCI.length>0){
            return res.status(400).json({ok:false, message:`Ya existe un registro con el ci ${ci}`})
        }
        /* Mandamos a personaModel los datos a agregar de una persona */
        const personaResultado = await personaModel.crearPersona({ci, extension, nombre, paterno,
                                                         materno, nacionalidad, estado_civil,
                                                        nro_telf, sexo, fecha_nacimiento})
        /* Si resultado.affectedRows es 1 se creo la persona, pero si sale 0 quiere decir que no hay personas registradas */
        if(personaResultado.affectedRows<=0){
            return res.status(404).json(`No existen personas para agregrar`);
        }

        /* Recuperamos el id de la persona recien agregada */
        let id_persona = personaResultado.insertId;

        /* Mandamos los datos de direccion de persona persona para despues agregar datos de domicilio*/
        const direccionResultado = await direccionModel.crearDireccion({departamento, municipio, zona, av_calle})

        /* Si resultado.affectedRows es 1 se creo la persona, pero si sale 0 quiere decir que no hay personas registradas */
        if(direccionResultado.affectedRows<=0){
            return res.status(404).json(`No existen direccion para agregrar`);
        }
        /* Recuperamos el id de la direccion para pasar a domicilio como su primary key ya que es herencia de entidades */
        let id_domicilio = direccionResultado.insertId;
        const domicilioResultado = await domicilioModel.crearDomicilio({id_domicilio, nro_puerta, id_persona})
        /* Si resultado.affectedRows es 1 se creo la persona, pero si sale 0 quiere decir que no hay personas registradas */
        if(domicilioResultado.affectedRows<=0){
            return res.status(404).json(`No existen domicilio para agregrar`);
        }
        res.status(201).json({ok:true, message:"Persona con direccion y domicilio agregada con exito"});
    } catch (error) {
        console.log("Error en Crear Persona", error)
    }
}


export const verificarCI =  async(req, res)=>{
    try {
        const { ci, extension } = req.body;
        const resultado = await personaModel.verificarCI(ci, extension);
        console.log("controller", resultado)
        if(resultado.length<=0){
            return res.status(404).json(`No existe la persona con ci ${ci} ${extension}`)
        }
        res.status(200).json({ok:true, message:`El ci ${ci+" "+extension} ya se encuentra registrado`}) 
    } catch (error) {
        console.log("Error en verificar ci", error)
    }
}

export const mostrarPersonas = async(req, res) =>{
    try {
        
        const resultado = await personaModel.mostrarPersonas();
        console.log("controller", resultado)
        if(resultado.length<=0){
            return res.status(404).json(`No existen registros`)
        }
        res.status(200).json({ok:true, resultado: resultado }) 
    } catch (error) {
        console.log("Error en GET", error)
    }
}

export const mostrarPersonaByCi = async(req, res) => {
    try {
        let ci=req.params.id;
        console.log("my ci", ci)
        const resultadoPersona = await personaModel.mostrarPersonaByCi(ci);
        if(resultadoPersona.length<=0){
            return res.status(404).json(`No existen la persona con ci${ci}`)
        }
        /* obtenemos el id_persona de persona */
        let id_persona = resultadoPersona[0].id_persona;
        const resultadoDomicilio = await domicilioModel.mostrarDomicilioById(id_persona);
        if(resultadoDomicilio.length<=0){
            return res.status(404).json(`No existen el domiclio del ci${id}`)
        }
        
        /* obtenemos el id_domicilio de domicilio */
        let id_domicilio=resultadoDomicilio[0].id_domicilio;
        const resultadoDireccion = await direccionModel.mostrarDireccionById(id_domicilio);
        /* Verificamos que toda respuesta sea mayor a cero */
        if(resultadoDireccion.length<=0){
            return res.status(404).json(`No existen la direccion del domicilio ${id}`)
        }
        let resultado = { ...resultadoPersona[0], ...resultadoDireccion[0], ...resultadoDomicilio[0]};

        res.status(200).json({ok: true, resultado: resultado})
    } catch (error) {
        console.log("Error en GET id persona", error)
    }
} 


export const personaController = {
    crearPersona,
    verificarCI,
    mostrarPersonas,
    mostrarPersonaByCi,
}

/* 

export const postData = async(req, res)=>{
    try {
        const {
            ci,
            extension,
            nombre,
            materno,
            paterno,
            sexo,
            fecha_nacimiento } = req.body;
    
    
        if(!ci || !extension || !nombre || !materno || !paterno || !sexo || !fecha_nacimiento){
            return res.status(400).json("datos incompletos para agregar")
        }
        const resultado = await pool.query(`insert into persona(ci, extension, nombre, paterno, materno, sexo, fecha_nacimiento) 
            values (?, ?, ?, ?, ?, ?, ?);`, [ci, extension, nombre, paterno, materno, sexo, fecha_nacimiento])
        res.status(201).json(resultado[0])
    } catch (error) {
        console.log("Error en POST", error)
    }
}

export const putDataById = async(req, res)=>{
    const { id } = req.params;
    const {
        ci,
        extension,
        nombre,
        materno,
        paterno,
        sexo,
        fecha_nacimiento } = req.body;

    let resultado = await pool.query(`update persona 
        set ci=ifnull(?, ci),
        extension=ifnull(?, extension),
        nombre=ifnull(?, nombre),
        paterno=ifnull(?, paterno),
        materno=ifnull(?, materno),
        sexo=ifnull(?, sexo), 
        fecha_nacimiento=ifnull(?, fecha_nacimiento) 
        where id_persona=?`, [ci, extension, nombre, paterno, materno, sexo, fecha_nacimiento, id])
    if(resultado[0].affectedRows<=0){
        return res.status(404).json(`No existe el usuario con el id ${id}`)
    }
    res.json(resultado[0])
}

export const deleteDataById = async(req, res)=>{
    const { id } = req.params;
    let resultado = await pool.query(`delete from persona where id_persona=?;`, [id]);
    if(resultado[0].affectedRows<=0){
        return res.status(404).json(`No existe el usuario con el id ${id}`)
    }
    res.json(resultado[0])
}
 */
