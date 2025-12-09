import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // 0-30s: 10 usuarios
    { duration: '30s', target: 20 },   // 30-60s: 20 usuarios
    { duration: '30s', target: 30 },   // 60-90s: 30 usuarios
    { duration: '30s', target: 40 },   // 90-120s: 40 usuarios
    { duration: '30s', target: 50 },   // 120-150s: 50 usuarios
    { duration: '30s', target: 60 },   // 150-180s: 60 usuarios
    { duration: '30s', target: 70 },   // 180-210s: 70 usuarios
    { duration: '30s', target: 80 },   // 210-240s: 80 usuarios
    { duration: '30s', target: 90 },   // 240-270s: 90 usuarios
    { duration: '30s', target: 100 },  // 270-300s: 100 usuarios
  ],
};

export default function () {
  // Endpoint de lectura de atenciones del dia actual
  http.get('http://192.168.0.12:3000/api/v1/attention/show');
  // Endpoint de verificacion de expiracion de turnos de atenciones
  http.get('http://192.168.0.12:3000/api/v1/attention/show-turn'); 
  //Endpoint de cambio de los estados de las atenciones
  http.get('http://192.168.0.12:3000/api/v1/attention/show-status');
  
  sleep(1);
}