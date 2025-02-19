import {createPool} from 'mysql2/promise';
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from './config.js';



// Create the connection to database
export const pool = createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: DB_DATABASE
})

/* export const createConnection = async() =>{
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'cs_copacabana',
            password: '123456',
            port: 3306
        });
        console.log('Conexión exitosa a la base de datos.');
        connection.query('use cs_copacabana');
        return connection;
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        throw error;
    }
} */


  