// utils/fechaBolivia.js
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

export function fechaBolivia() {
  return dayjs().tz("America/La_Paz").format("YYYY-MM-DD");
}

export function fechaHoraBolivia() {
  return dayjs().tz("America/La_Paz").format("YYYY-MM-DD HH:mm:ss");
}
