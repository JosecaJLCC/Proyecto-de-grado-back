import express from 'express';
import morgan from 'morgan'
import { PORT } from './config.js'
/* middlewares */
import cors from 'cors'
/* rutas */
import rutasPaciente from './routes/paciente.route.js';
import rutasUsuario from './routes/usuario.route.js';
import rutasEstablecimiento from './routes/establecimiento.route.js';
import rutasAtencion from './routes/atencion.route.js';
import rutasPersonal from './routes/personal.route.js';
import rutasMicrored from './routes/microred.route.js';

const app = express();
/* middlewares */
app.disable('x-powered-by')
/* Esto es para habilitar solicitudes con cuerpo en formato json, req.body */
app.use(express.json());
/* Esto es para habilitar solicitudes de formulario */
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));

app.use(cors({
  /* origin: "http://localhost:5173" */
   origin:"*"
}));

/*Para las rutas de la carpeta donde conservo las fotos de perfil  */
app.use('/uploads', express.static('./src/uploads'));

/* rutas */
/* app.use('/api/v1/person', rutasPersona); */

app.use('/api/v1/attention', rutasAtencion);
app.use('/api/v1/microred', rutasMicrored);
app.use('/api/v1/establishment', rutasEstablecimiento);
app.use('/api/v1/patient', rutasPaciente);
app.use('/api/v1/staff', rutasPersonal);
app.use('/api/v1/user', rutasUsuario);
/* servidor corriendo */
app.listen(PORT,'0.0.0.0', () => {
   return console.log(`Servidor escuchando en el puerto ${PORT}`)
 })