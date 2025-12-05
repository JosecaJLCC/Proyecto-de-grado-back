import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '30s',
};

export default function () {
  http.get('http://192.168.0.14:3000/api/v1/patient/show/1'); //endpoint de pacientes con SUS activa
  sleep(1);
}