import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { range } from "lodash";

import { Button, Fields } from "components";
import { useHooks } from "hooks";
import './style.scss'

const months = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
const daysOfWeek = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

interface IProps {
  className?: string;
}

const YearlyCalendar = (props: IProps) => {
  const { className = "" } = props
  const { t } = useHooks()
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(today);
  const [rangeStart, setRangeStart] = useState<Dayjs | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Dayjs | null>(null);
  const [startDate, setDate] = useSearchParams();
  const currentYear = dayjs().year();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const years = range(2010, currentYear + 1).map((year) => ({ label: year.toString(), value: year }));

  useEffect(() => {
    const currentParams = Object.fromEntries(startDate.entries());
    if (!currentParams.start) {
      setDate({
        ...currentParams,
        start: (1000 * today.unix()).toString(),
      });
    }
  }, []);

  const handleDateClick = (date: Dayjs) => {
    let newStart = rangeStart;
    let newEnd = rangeEnd;

    if (!rangeStart || (rangeStart && rangeEnd)) {
      newStart = date;
      newEnd = null;
    } else {
      if (date.isBefore(rangeStart)) {
        newEnd = rangeStart;
        newStart = date;
      } else {
        newEnd = date;
      }
    }

    setRangeStart(newStart);
    setRangeEnd(newEnd);
    setSelectedDate(date);
  };


  const clearFilters = () => {
    setDate({});

    setRangeStart(null);
    setRangeEnd(null);
    setSelectedDate(today);
  };

  return (
    <div className={className}>
      <div className="flex justify-end items-center mb-[20px]">
        <Fields.SelectD
          //@ts-ignore
          placeholder={t("Yil")}
          defaultValue={selectedYear}
          optionLabel="label"
          options={years}
          optionValue='value'
          onChange={(value: any) => {
            setSelectedYear(value.value)
          }}
          className="w-[100px] mr-[20px]"
        />
        <Button
          type="secondary"
          htmlType="button"
          title="Filterni tozalash"
          className="mr-[20px]"
          onClick={() => (
            clearFilters()
          )}
        />

        <Button
          type="primary"
          htmlType="button"
          title="Izlash"
          onClick={() => {
            const values: Record<string, string> = {};
            if (rangeStart) {
              values.start = (1000 * dayjs(rangeStart).unix()).toString();
            }
            if (rangeEnd) {
              values.end = (1000 * dayjs(rangeEnd).unix()).toString();
            }
            setDate((prev) => ({
              ...Object.fromEntries(prev.entries()),
              ...values,
            }));
          }}
        />
      </div>
      <Card bordered={false} className="calendar-container" style={{ width: "100%", height: "350px", overflowX: "auto", whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", gap: 10, width: "max-content" }}>
          {months.map((month, monthIndex) => {
            const firstDayOfMonth = dayjs().year(selectedYear).month(monthIndex).startOf("month");
            const daysInMonth = firstDayOfMonth.daysInMonth();
            const startDay = firstDayOfMonth.day();
            const calendarDays = [...Array(startDay > 0 ? startDay - 1 : 6).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

            return (
              <div key={month} style={{ width: 260, minWidth: 260, padding: 10, background: "#fff" }}>
                <h3 className="text-center font-bold">{month}</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5 }}>
                  {daysOfWeek.map((day) => (
                    <div key={day} className="text-center font-bold opacity-45">{day}</div>
                  ))}
                  {calendarDays.map((day, index) => {
                    const date = day
                      ? dayjs().year(selectedYear).month(monthIndex).date(day)
                      : null;
                    const isSelected = date && date.isSame(selectedDate, "day");
                    const isToday = date && date.isSame(today, "day");
                    const isInRange =
                      date &&
                      rangeStart &&
                      rangeEnd &&
                      date.isAfter(rangeStart, "day") &&
                      date.isBefore(rangeEnd, "day");
                    const isStartOrEnd = date && (date.isSame(rangeStart, "day") || date.isSame(rangeEnd, "day"));

                    return (
                      <div
                        key={index}
                        onClick={() => date && handleDateClick(date)}
                        style={{
                          width: 30,
                          height: 30,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: isSelected ? "#faad14" : isInRange ? "#ffe58f" : isStartOrEnd ? "#faad14" : isToday ? "transparent" : "transparent",
                          border: isInRange ? "none" : isToday ? "1px solid #faad14" : isStartOrEnd ? "none" : "none",
                          color: isSelected ? "#fff" : isInRange ? "#000" : isStartOrEnd ? "#fff" : "#000",
                          cursor: "pointer",
                        }}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

    </div>
  );
};

export default YearlyCalendar;
