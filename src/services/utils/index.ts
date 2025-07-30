import dayjs from "dayjs";

const formatNumber = (number: any) => {
  return number == 0 ? number : number && typeof (number) == "string" && number.includes(".") ? Number(number).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : typeof (number) == "string" ? Number(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : !number ? "-" : number !== null && number.toString().includes(".") ? number.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : number !== null && number ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : "-";
};

const deformatNumber = (number: string) => {
  return number.replace(/\$\s?|(,*)/g, "");
};

const formatPhone = (phoneNumber: string) => {
  const newPhone = ('' + phoneNumber).replace(/\D/g, '');
  const code = newPhone.slice(0, -7);
  const before = newPhone.slice(-7, -4);
  const center = newPhone.slice(-4, -2);
  const after = newPhone.slice(-2);
  return `+${code} ${before}-${center}-${after}`
}

const formatFetchedDate = (date: string) => {
  return dayjs(date).format('DD.MM.YYYY')
}

const formatFetchedDateMonth = (date: string) => {
  return dayjs(date).format('MMM')
}

const formatTimestamp = (date: any) => {
  return dayjs(date * 1000).format('DD.MM.YYYY')
}

const getNow = () => {
  return dayjs().unix()
}

const isLetter = (value: string) => {
  return (value.charCodeAt(0) >= 97 && value.charCodeAt(0) <= 122) || (value.charCodeAt(0) >= 65 && value.charCodeAt(0) <= 90);
}

const checkLetter = (value: string) => {
  return (value.charCodeAt(0) >= 97 && value.charCodeAt(0) <= 122) || (value.charCodeAt(0) >= 65 && value.charCodeAt(0) <= 90) || value.charCodeAt(0) == 46;
}

const checkNumber = (value: any) => {
  if (value) {
    if (typeof value != "number" && typeof value == "string") {
      return +value.replaceAll(" ", "")
    }
    else {
      return +value
    }
  } else {
    return null
  }
}

const getValue = (value: any) => {
  if (value) {
    let result
    value = String(value)
    let lastChar = value.slice(-1);

    if (lastChar.charCodeAt(0) != 46) {
      if (!isLetter(lastChar)) {
        result = value ? Number(value.replaceAll(" ", "")).toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$& ').replaceAll('.0', '') : ''
      }
    } else {
      result = value ? Number(value.replaceAll(" ", "")).toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$& ').replaceAll('.0', '.') : ''

    }
    if (value.toString().includes('.') && !checkLetter(lastChar)) {
      result = value
    }
    if (result == 'Infinity' || result == 'NaN') {
      result = null
    }

    return result
  }
}

function extractBaseUrl(url: string) {
  const pattern = /^(\/[a-zA-Z0-9-_]+(?:\/[a-zA-Z0-9-_]+){0,2})\/[a-zA-Z0-9]+$/;
  const match = url.match(pattern);
  return match ? match[1] : url;
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
  getNow,
  getValue,
  formatFetchedDateMonth,
  extractBaseUrl
};