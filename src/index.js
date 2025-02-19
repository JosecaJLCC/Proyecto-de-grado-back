import express from 'express';
import morgan from 'morgan'
import { PORT } from './config.js'
import rutasPersona from './routes/persona.route.js';
import rutasUsuario from './routes/usuario.route.js';

const app = express();
/* middlewares */
app.use(express.json());
app.use(morgan('dev'));

/* rutas */
app.use(rutasPersona);
app.use(rutasUsuario);

/* servidor corriendo */
app.listen(PORT, () => {
   return console.log(`Servidor escuchando en el puerto ${PORT}`)
 })