
export function obtenerTurnoPorHora(fecha_bolivia) {
  const hora = new Date(fecha_bolivia).getHours();

  if (hora >= 8 && hora < 12) return 'MAÑANA';
  if (hora >= 12 && hora < 16) return 'TARDE';
  return null; // fuera de turno
}