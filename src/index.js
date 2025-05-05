import express from 'express';
import morgan from 'morgan'
import { PORT } from './config.js'
/* rutas */
import rutasPersona from './routes/persona.route.js';
import rutasUsuario from './routes/usuario.route.js';
import rutasEstablecimiento from './routes/establecimiento.route.js';
/* middlewares */
import cors from 'cors'

const app = express();
/* middlewares */
app.disable('x-powered-by')
/* Esto es para habilitar solicitudes con cuerpo en formato json, req.body */<
app.use(express.json());
/* Esto es para habilitar solicitudes de formulario */
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));

app.use(cors());

/* rutas */
app.use('/api/v1/people', rutasPersona);
app.use('/api/v1/users', rutasUsuario);
app.use('/api/v1/stablishment', rutasEstablecimiento);

/* servidor corriendo */
app.listen(PORT, () => {
   return console.log(`Servidor escuchando en el puerto ${PORT}`)
 })