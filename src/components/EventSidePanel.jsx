/* eslint-disable react/prop-types */
import { useState } from "react";
import { format } from "date-fns";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import EventModal from "./EventModal";

function EventSidePanel({ events, setEvents, selectedDate }) {
  const [activeTab, setActiveTab] = useState("Work");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState({ type: "Work" }); // Default event type
  const [selectedEvent, setSelectedEvent] = useState(null); // Currently selected event for edit/delete

  const selectedDateEvents = events[selectedDate] || []; // Events for the selected date

  // Filter events by type and keyword
  const filteredEvents = selectedDateEvents.filter(
    (event) =>
      event.type === activeTab &&
      ((event.name?.toLowerCase() || "").includes(
        searchKeyword.toLowerCase()
      ) ||
        (event.description?.toLowerCase() || "").includes(
          searchKeyword.toLowerCase()
        ))
  );

  const openModal = (isEditing = false, event = null) => {
    if (isEditing && event) {
      setEventDetails(event); // Prefill details for editing
    } else {
      setEventDetails({ type: "Work" }); // Reset event details for new event
    }
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEventDetails({ type: "Work" }); // Reset event details
  };

  const saveEvent = () => {
    if (!selectedDate) {
      alert("Please select a date before adding or editing an event.");
      return;
    }

    const updatedEvents = { ...events };

    if (selectedEvent) {
      // Update an existing event
      updatedEvents[selectedDate] = updatedEvents[selectedDate].map((event) =>
        event.id === selectedEvent.id ? eventDetails : event
      );
    } else {
      // Add a new event
      const newEvent = { ...eventDetails, id: new Date().getTime().toString() }; // Unique ID
      updatedEvents[selectedDate] = [...(events[selectedDate] || []), newEvent];
    }

    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    closeModal();
  };

  const openDeleteModal = (event) => {
    setSelectedEvent(event);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    const updatedEvents = events[selectedDate].filter(
      (event) => event.id !== selectedEvent.id
    );
    const newEvents = { ...events, [selectedDate]: updatedEvents };
    setEvents(newEvents);
    localStorage.setItem("events", JSON.stringify(newEvents));
    setIsDeleteModalOpen(false); // Close delete confirmation modal
  };

  return (
    <div className="w-full md:w-1/4 h-auto md:h-screen bg-white shadow-md p-4 flex flex-col">
      <h2 className="text-lg md:text-xl font-bold mb-4">
        Events for{" "}
        {selectedDate
          ? format(new Date(selectedDate), "MMMM dd, yyyy")
          : "No Date Selected"}
      </h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Search events..."
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 md:space-x-4 mb-4">
        {["Work", "Personal", "Others"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-grow px-2 md:px-4 py-2 rounded-md font-semibold text-xs md:text-base ${
              activeTab === tab
                ? "bg-gray-300"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Event List */}
      <div className="flex-grow overflow-y-auto mb-4">
        <ul>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <li
                key={event.id}
                className="p-2 rounded-md mb-2 bg-gray-100 flex justify-between items-center"
              >
                <div className="overflow-hidden">
                  <p className="font-semibold break-words text-sm md:text-base">
                    {event.name}
                  </p>
                  <p className="text-xs md:text-sm">
                    {event.startTime} - {event.endTime}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 break-words">
                    {event.description}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <PencilIcon
                    className="h-4 w-4 md:h-5 md:w-5 text-gray-600 cursor-pointer"
                    onClick={() => openModal(true, event)}
                  />
                  <TrashIcon
                    className="h-4 w-4 md:h-5 md:w-5 text-red-600 cursor-pointer"
                    onClick={() => openDeleteModal(event)}
                  />
                </div>
              </li>
            ))
          ) : (
            <p className="text-xs md:text-sm text-gray-500">
              No {activeTab.toLowerCase()} events for this date.
            </p>
          )}
        </ul>
      </div>

      {/* Add Event Button */}
      <button
        onClick={() => openModal(false)}
        className="flex items-center justify-center px-3 md:px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 hover:shadow-lg transition duration-200"
      >
        <PlusIcon className="h-4 w-4 md:h-5 md:w-5 mr-2" />
        <span className="text-sm md:text-base leading-none">Add Event</span>
      </button>

      {/* Event Modal */}
      {isModalOpen && (
        <EventModal
          isEditing={!!selectedEvent}
          eventDetails={eventDetails}
          setEventDetails={setEventDetails}
          onClose={closeModal}
          onSave={saveEvent}
          existingEvents={selectedDateEvents}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-96">
            <h2 className="text-lg font-bold mb-4">Delete Event</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this event?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventSidePanel;
