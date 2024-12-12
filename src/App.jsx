import { useState, useEffect } from "react";
import EventSidePanel from "./components/EventSidePanel";
import DynamicCalendar from "./components/DynamicCalendar";

function App() {
  const [events, setEvents] = useState(() => {
    const storedEvents = localStorage.getItem("events");
    return storedEvents ? JSON.parse(storedEvents) : {};
  });

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Default to today's date
  });

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  return (
    <div className="flex h-screen">
      <EventSidePanel
        events={events}
        setEvents={setEvents}
        selectedDate={selectedDate}
      />
      <div className="flex-grow flex items-center justify-center bg-gray-50 px-4">
        <DynamicCalendar
          events={events}
          setSelectedDate={setSelectedDate}
          selectedDate={selectedDate}
        />
      </div>
    </div>
  );
}

export default App;
