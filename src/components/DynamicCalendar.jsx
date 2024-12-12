/* eslint-disable react/prop-types */
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
  isSameMonth,
  isEqual,
  getDay,
} from "date-fns";
import { useState } from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const DynamicCalendar = ({ events, selectedDate, setSelectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const startDate = startOfWeek(startOfMonth(currentDate));
  const endDate = endOfWeek(endOfMonth(currentDate));
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handleMonthChange = (increment) => {
    const updatedDate = new Date(currentDate);
    updatedDate.setMonth(currentDate.getMonth() + increment);
    setCurrentDate(updatedDate);
  };

  const exportAsJSON = () => {
    const json = JSON.stringify(events, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `events-${format(currentDate, "MMMM-yyyy")}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setIsExportMenuOpen(false);
  };

  const exportAsCSV = () => {
    const csvHeader = "Date,Name,Type,Start Time,End Time,Description\n";
    const csvRows = Object.entries(events)
      .flatMap(([date, dayEvents]) =>
        dayEvents.map(
          (event) =>
            `${date},"${event.name}","${event.type}",${event.startTime},${
              event.endTime
            },"${event.description || ""}"`
        )
      )
      .join("\n");
    const csvContent = csvHeader + csvRows;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `events-${format(currentDate, "MMMM-yyyy")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setIsExportMenuOpen(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6">
      <div className="text-center mb-6 flex flex-wrap justify-between items-center">
        <h1 className="text-lg sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-0">
          Dynamic Event Calendar
        </h1>

        {/* Export As Button with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            className="flex items-center px-3 sm:px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 hover:text-white transition duration-200"
          >
            Export As
            <ChevronDownIcon className="h-5 w-5 ml-1" />
          </button>

          {isExportMenuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-10">
              <button
                onClick={exportAsJSON}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-100 hover:text-blue-800 transition duration-200"
              >
                JSON
              </button>
              <button
                onClick={exportAsCSV}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-100 hover:text-blue-800 transition duration-200"
              >
                CSV
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
        <header className="flex items-center justify-between mb-4">
          {/* Previous Button with Left Arrow */}
          <button
            onClick={() => handleMonthChange(-1)}
            className="flex items-center px-3 sm:px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-2" />
            Previous
          </button>

          {/* Current Month and Year */}
          <h2 className="text-base sm:text-lg md:text-xl font-semibold">
            {format(currentDate, "MMMM yyyy")}
          </h2>

          {/* Next Button with Right Arrow */}
          <button
            onClick={() => handleMonthChange(1)}
            className="flex items-center px-3 sm:px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Next
            <ChevronRightIcon className="h-5 w-5 ml-2" />
          </button>
        </header>

        <div className="grid grid-cols-7 text-center text-xs sm:text-sm font-medium text-gray-500 mb-2">
          {"Sun Mon Tue Wed Thu Fri Sat".split(" ").map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {days.map((day) => {
            const isWeekend = [0, 6].includes(getDay(day));
            const isTodayDate = isToday(day);
            const isSelected = selectedDate
              ? isEqual(
                  new Date(day).setHours(0, 0, 0, 0),
                  new Date(selectedDate).setHours(0, 0, 0, 0)
                )
              : false;

            return (
              <div
                key={format(day, "yyyy-MM-dd")}
                onClick={() =>
                  isSameMonth(day, currentDate) &&
                  setSelectedDate(format(day, "yyyy-MM-dd"))
                }
                className={`h-20 sm:h-24 p-2 border rounded-md flex flex-col justify-between cursor-pointer 
                  ${
                    isSameMonth(day, currentDate)
                      ? "bg-white"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }
                  ${
                    isSelected
                      ? "bg-green-100 border-green-500"
                      : isTodayDate
                      ? "bg-blue-100 border-blue-600"
                      : ""
                  }
                  ${
                    isWeekend && isSameMonth(day, currentDate)
                      ? "bg-red-100 border-red-500"
                      : "border-gray-300"
                  }
                `}
              >
                <div className="text-xs sm:text-sm font-medium">
                  {format(day, "d")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DynamicCalendar;
