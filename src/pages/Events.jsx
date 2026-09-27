import { useState, useEffect } from "react";
import axios from "axios";
import EventList from "../components/EventList";
import { API } from "../api";

function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [showAddForm, setShowAddForm] = useState(false);

  // New event form state (Admin)
  const [newEvent, setNewEvent] = useState({
    name: "",
    category: "Technical",
    fee: 0,
    seats: 50,
    date: "",
  });

  function loadEvents() {
    axios
      .get(API + "/events")
      .then((res) => {
        setEvents(res.data);
      })
      .catch(() => {
        setMessage("Could not load events from server");
        setMessageType("error");
      });
  }

  useEffect(() => {
    loadEvents();
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role") || "");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  async function deleteEvent(id) {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: "Bearer " + token } };
    try {
      const res = await axios.delete(API + "/events/" + id, config);
      setMessage(res.data.message || "Event deleted");
      setMessageType("success");
      loadEvents();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Failed to delete event");
      }
      setMessageType("error");
    }
  }

  async function handleAddEvent(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: "Bearer " + token } };
    try {
      await axios.post(API + "/events", newEvent, config);
      setMessage("Event created successfully!");
      setMessageType("success");
      setShowAddForm(false);
      setNewEvent({
        name: "",
        category: "Technical",
        fee: 0,
        seats: 50,
        date: "",
      });
      loadEvents();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Failed to create event");
      }
      setMessageType("error");
    }
  }

  const filteredEvents = events.filter((event) => {
    const nameMatches = event.name.toLowerCase().includes(search.toLowerCase());
    const categoryMatches = category === "All" || event.category === category;
    return nameMatches && categoryMatches;
  });

  return (
    <div className="page">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
        <h1>EVENTS</h1>
        {role === "admin" && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              backgroundColor: "var(--yellow)",
              color: "var(--dark)",
              boxShadow: "3px 3px 0px var(--dark)",
            }}
          >
            {showAddForm ? "Close Form" : "+ Add New Event (Admin)"}
          </button>
        )}
      </div>

      {/* Admin Add Event Form */}
      {role === "admin" && showAddForm && (
        <div
          style={{
            border: "var(--border-width) solid var(--dark)",
            padding: "25px",
            marginBottom: "30px",
            backgroundColor: "var(--cream)",
            boxShadow: "6px 6px 0px var(--dark)",
          }}
        >
          <h2 style={{ marginBottom: "15px" }}>Create New Event</h2>
          <form onSubmit={handleAddEvent} className="brutal-form-grid">
            <div className="form-group">
              <label>Event Name</label>
              <input
                type="text"
                required
                value={newEvent.name}
                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={newEvent.category}
                onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                className="category-select"
                style={{ width: "100%" }}
              >
                <option value="Technical">Technical</option>
                <option value="Workshop">Workshop</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
              </select>
            </div>
            <div className="form-group">
              <label>Registration Fee (₹)</label>
              <input
                type="number"
                min="0"
                required
                value={newEvent.fee}
                onChange={(e) => setNewEvent({ ...newEvent, fee: Number(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Total Seats</label>
              <input
                type="number"
                min="1"
                required
                value={newEvent.seats}
                onChange={(e) => setNewEvent({ ...newEvent, seats: Number(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Event Date</label>
              <input
                type="date"
                required
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button
                type="submit"
                className="btn-register"
                style={{ width: "100%", height: "54px" }}
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Status banner */}
      {message && (
        <div
          style={{
            padding: "15px 20px",
            marginBottom: "25px",
            border: "3px solid var(--dark)",
            backgroundColor:
              messageType === "success"
                ? "var(--yellow)"
                : messageType === "error"
                ? "#ffc0bd"
                : "var(--cream)",
            color: "#1a1a1a",
            fontWeight: "700",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{message}</span>
          <button
            onClick={() => setMessage("")}
            style={{
              padding: "2px 8px",
              border: "2px solid var(--dark)",
              background: "transparent",
              fontWeight: "800",
            }}
          >
            ✕
          </button>
        </div>
      )}

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="category-select"
        >
          <option value="All">All Categories</option>
          <option value="Technical">Technical</option>
          <option value="Workshop">Workshop</option>
          <option value="Cultural">Cultural</option>
          <option value="Sports">Sports</option>
        </select>
      </div>

      <EventList
        events={filteredEvents}
        onDelete={deleteEvent}
        role={role}
      />

      <div className="events-info-sections">
        <div className="info-card full-width-card">
          <h2>REGISTRATION STEPS</h2>
          <ul>
            <li>Step 1: Browse the live events list above.</li>
            <li>Step 2: Click 'Register' on your desired event to go directly to the registration form.</li>
            <li>Step 3: Fill in your personal details and confirm your event participation.</li>
            <li>Step 4: Check 'My Registrations' anytime to see your confirmed bookings!</li>
          </ul>
        </div>

        <div className="info-cards-grid">
          <div className="info-card">
            <h2>EVENT CATEGORIES</h2>
            <p>
              We offer Technical, Workshop, Cultural, and Sports events with live seat tracking.
            </p>
          </div>

          <div className="info-card">
            <h2>EVENT COORDINATORS</h2>
            <p>
              Coordinators can manage events directly with Admin privileges.
            </p>
          </div>

          <div className="info-card">
            <h2>SCHEDULE OF EACH EVENT</h2>
            <p>
              Detailed schedules are linked with registration records in MongoDB.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Events;
