import { useState } from "react";

/* eslint-disable react/prop-types */
function EventModal({
  isEditing,
  eventDetails,
  setEventDetails,
  onClose,
  onSave,
  existingEvents = [],
}) {
  const [error, setError] = useState("");

  const validateEvent = () => {
    const { name, startTime, endTime, type } = eventDetails;

    if (!name || !startTime || !endTime || !type) {
      setError("All fields are required except description.");
      return false;
    }

    if (startTime >= endTime) {
      setError("End time must be after start time.");
      return false;
    }

    // Check for overlapping events
    const isOverlapping = existingEvents.some(
      (event) =>
        (startTime >= event.startTime && startTime < event.endTime) || // New event starts during an existing event
        (endTime > event.startTime && endTime <= event.endTime) || // New event ends during an existing event
        (startTime <= event.startTime && endTime >= event.endTime) // New event completely overlaps an existing event
    );

    if (isOverlapping) {
      setError("This event overlaps with an existing event.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSave = () => {
    if (validateEvent()) {
      onSave();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">
          {isEditing ? "Edit Event" : "Add Event"}
        </h2>
        <form className="space-y-4">
          <div>
            <label className="block font-semibold">Event Name</label>
            <input
              type="text"
              value={eventDetails?.name || ""}
              onChange={(e) =>
                setEventDetails({ ...eventDetails, name: e.target.value })
              }
              className="w-full border rounded-md p-2"
              placeholder="Enter event name"
            />
          </div>
          <div>
            <label className="block font-semibold">Event Type</label>
            <select
              value={eventDetails?.type || ""}
              onChange={(e) =>
                setEventDetails({ ...eventDetails, type: e.target.value })
              }
              className="w-full border rounded-md p-2"
            >
              <option value="">Select type</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold">Start Time</label>
            <input
              type="time"
              value={eventDetails?.startTime || ""}
              onChange={(e) =>
                setEventDetails({ ...eventDetails, startTime: e.target.value })
              }
              className="w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block font-semibold">End Time</label>
            <input
              type="time"
              value={eventDetails?.endTime || ""}
              onChange={(e) =>
                setEventDetails({ ...eventDetails, endTime: e.target.value })
              }
              className="w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block font-semibold">
              Event Description (Optional)
            </label>
            <textarea
              value={eventDetails?.description || ""}
              onChange={(e) =>
                setEventDetails({
                  ...eventDetails,
                  description: e.target.value,
                })
              }
              className="w-full border rounded-md p-2"
              placeholder="Event description"
            ></textarea>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventModal;
