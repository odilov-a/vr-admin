import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
dayjs.extend(duration);
dayjs.extend(utc);

const formatNumber = (number: any) => {
  return number == 0
    ? number
    : number && typeof number == "string" && number.includes(".")
    ? Number(number)
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    : typeof number == "string"
    ? Number(number)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    : !number
    ? " "
    : number !== null && number.toString().includes(".")
    ? number
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    : number !== null && number
    ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    : " ";
};

const deformatNumber = (number: string) => {
  return number.replace(/\$\s?|(,*)/g, "");
};

const formatPhone = (phoneNumber: string) => {
  const newPhone = ("" + phoneNumber).replace(/\D/g, "");
  const code = newPhone.slice(0, -7);
  const before = newPhone.slice(-7, -4);
  const center = newPhone.slice(-4, -2);
  const after = newPhone.slice(-2);
  return `+${code} ${before}-${center}-${after}`;
};

const formatFetchedDate = (date: string) => {
  if (date.length > 10) {
    return dayjs(parseInt(date)).format("DD.MM.YYYY");
  } else {
    return dayjs(date).format("DD.MM.YYYY");
  }
};

const formatFetchedDateMonth = (date: string) => {
  return dayjs(date).format("MMM");
};

const formatTimestamp = (date: any) => {
  if (date.toString().length > 10) {
    return dayjs(date).format("DD.MM.YYYY");
  } else {
    return dayjs(date * 1000).format("DD.MM.YYYY");
  }
};

const getStartOfDayTimestamp = (timestamp: any) => {
  const date = checkNumber(timestamp);
  return dayjs
    .utc(date)
    .startOf("day")
    .valueOf();
};

const getEndOfDayTimestamp = (timestamp: any) => {
  const date = checkNumber(timestamp);
  return dayjs
    .utc(date)
    .endOf("day")
    .valueOf();
};

const formatTime = (timestampStr: string): string => {
  const timestamp = Number(timestampStr);
  if (isNaN(timestamp)) return "Invalid timestamp";
  if (timestamp === 0) return "Qayd etilmagan";

  const isMilliseconds = timestamp > 1_000_000_000_000;
  const date = isMilliseconds ? dayjs(timestamp) : dayjs(timestamp * 1000);

  return date.format("HH:mm - DD.MM.YYYY");
};

const formatHour = (timestampStr: string): string => {
  const timestamp = Number(timestampStr);
  if (isNaN(timestamp)) return "Invalid timestamp";
  if (timestamp === 0) return "Qayd etilmagan";

  const isMilliseconds = timestamp > 1_000_000_000_000;
  const date = isMilliseconds ? dayjs(timestamp) : dayjs(timestamp * 1000);

  return date.format("HH:mm");
};

const calculateWorkedTime = (entryTime: number, exitTime: number): string => {
  if (isNaN(entryTime) || isNaN(exitTime) || entryTime > exitTime) {
    return "Invalid timestamps";
  }

  // Agar vaqt sekundda berilgan bo‘lsa, uni millisekundga aylantiramiz
  if (entryTime < 10 ** 10) entryTime *= 1000;
  if (exitTime < 10 ** 10) exitTime *= 1000;

  const durationMs = exitTime - entryTime; // Ishlangan vaqt (millisekundda)
  const workDuration = dayjs.duration(durationMs); // Day.js duration obyektiga o'girish

  return workDuration.format("HH:mm:ss");
};

const timestampToTime = (timestamp: any) => {
  const date = new Date(timestamp);
  const hours = date
    .getHours()
    .toString()
    .padStart(2, "0");
  const minutes = date
    .getMinutes()
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}`;
};

function formatMessageDate(timestamp: any) {
  const messageDate = new Date(timestamp);
  const currentDate = new Date();
  const yesterdayDate = new Date(currentDate);
  yesterdayDate.setDate(currentDate.getDate() - 1);

  const isSameDay = (date1: any, date2: any) =>
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();

  const isTomorrow = new Date(currentDate);
  isTomorrow.setDate(currentDate.getDate() + 1);

  if (isSameDay(messageDate, currentDate)) {
    const hours = messageDate
      .getHours()
      .toString()
      .padStart(2, "0");
    const minutes = messageDate
      .getMinutes()
      .toString()
      .padStart(2, "0");
    return `${hours}:${minutes}`;
  } else if (isSameDay(messageDate, yesterdayDate)) {
    return "Kecha";
  } else {
    const day = messageDate
      .getDate()
      .toString()
      .padStart(2, "0");
    const month = (messageDate.getMonth() + 1).toString().padStart(2, "0");
    const year = messageDate.getFullYear();
    return `${day}.${month}.${year}`;
  }
}

const getNow = () => {
  return dayjs().unix();
};

const getNowMs = (): number => {
  return dayjs().valueOf();
};

const isLetter = (value: string) => {
  return (
    (value.charCodeAt(0) >= 97 && value.charCodeAt(0) <= 122) ||
    (value.charCodeAt(0) >= 65 && value.charCodeAt(0) <= 90)
  );
};

const checkLetter = (value: string) => {
  return (
    (value.charCodeAt(0) >= 97 && value.charCodeAt(0) <= 122) ||
    (value.charCodeAt(0) >= 65 && value.charCodeAt(0) <= 90) ||
    value.charCodeAt(0) == 46
  );
};

const checkNumber = (value: any) => {
  if (value) {
    if (typeof value != "number" && typeof value == "string") {
      return +value.replaceAll(" ", "");
    } else {
      return +value;
    }
  } else {
    return null;
  }
};

const getValue = (value: any) => {
  if (value) {
    let result;
    value = String(value);
    let lastChar = value.slice(-1);

    if (lastChar.charCodeAt(0) != 46) {
      if (!isLetter(lastChar)) {
        result = value
          ? Number(value.replaceAll(" ", ""))
              .toFixed(1)
              .replace(/\d(?=(\d{3})+\.)/g, "$& ")
              .replaceAll(".0", "")
          : "";
      }
    } else {
      result = value
        ? Number(value.replaceAll(" ", ""))
            .toFixed(1)
            .replace(/\d(?=(\d{3})+\.)/g, "$& ")
            .replaceAll(".0", ".")
        : "";
    }
    if (value.toString().includes(".") && !checkLetter(lastChar)) {
      result = value;
    }
    if (result == "Infinity" || result == "NaN") {
      result = null;
    }

    return result;
  }
};

function extractBaseUrl(url: string) {
  const pattern = /^(\/[a-zA-Z0-9-_]+(?:\/[a-zA-Z0-9-_]+){0,2})\/[a-zA-Z0-9]+$/;
  const match = url.match(pattern);
  return match ? match[1] : url;
}

const extractLatLng = (
  url: string
): { latitude: number; longitude: number } | null => {
  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);

    if (url.includes("yandex")) {
      const ll = params.get("ll");
      if (ll) {
        const [longitude, latitude] = ll.split(",").map(parseFloat);
        return { latitude, longitude };
      }
    } else if (url.includes("google")) {
      const pathParts = urlObj.pathname.split("/");

      for (const part of pathParts) {
        if (part.includes("@")) {
          const coords = part.split("@")[1].split(",");
          if (coords.length >= 2) {
            const latitude = parseFloat(coords[0]);
            const longitude = parseFloat(coords[1]);
            return { latitude, longitude };
          }
        }
      }
    }
  } catch (error) {
    console.error("ERROR URL:", error);
  }
  return null;
};

const minutesToHours = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} soat ${remainingMinutes} daqiqa`;
};

function extractFirstPathSegment(path: any): string {
  const pattern = /^\/[^\/]+/;
  const match = path.match(pattern);
  return match ? match[0] : path;
}

export default {
  formatNumber,
  formatPhone,
  checkNumber,
  deformatNumber,
  isLetter,
  checkLetter,
  formatFetchedDate,
  formatTimestamp,
  timestampToTime,
  getNow,
  getNowMs,
  getValue,
  formatFetchedDateMonth,
  formatMessageDate,
  formatHour,
  extractBaseUrl,
  extractLatLng,
  formatTime,
  calculateWorkedTime,
  minutesToHours,
  getStartOfDayTimestamp,
  getEndOfDayTimestamp,
  extractFirstPathSegment,
};
