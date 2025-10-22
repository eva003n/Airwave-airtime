import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

//extend dayjs wirh relative time plugin
dayjs.extend(relativeTime);
const getDateByDay = (date: Date) => dayjs(date).format("DD-MM-YYYY");
const getDateByMonth = (date: Date) => dayjs(date).format("MM-DD-YYYY");
const getDateByYear = (date: Date) => dayjs(date).format("YYYY-MM-DD");

//get date, year and month
const getDate = (date: Date) => dayjs(date).date();
const getMonth = (date: Date) => dayjs(date).month(); //zere based
const getYear = (date: Date) => dayjs(date).year();

const now = dayjs();
//ditfference between now and future data
const getDateDifference = (date: Date, day = now) => dayjs(date).diff(day, "day");
//get time from now
const getTimeFromNow = (pastDate: Date) => dayjs(pastDate).fromNow();

const getIsoDate = () => now.toISOString();

export {
  getDateByDay,
  getDateByMonth,
  getDateByYear,
  getDateDifference,
  getDate,
  getMonth,
  getYear,
  getTimeFromNow,
  getIsoDate,
};
