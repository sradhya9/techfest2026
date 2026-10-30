import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../api";

function Dashboard() {
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [allRegistrations, setAllRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    // Clear old mock localStorage entries permanently so it matches MongoDB strictly
    localStorage.removeItem("tf26_registrations");

    const currentRole = localStorage.getItem("role");
    const currentToken = localStorage.getItem("token");
    setRole(currentRole || "");
    setToken(currentToken || "");

    if (currentRole === "admin" && currentToken) {
      loadAllRegistrations(currentToken);
    } else {
      setLoading(false);
    }
  }, []);

  function loadAllRegistrations(authToken) {
    setLoading(true);
    const config = { headers: { Authorization: "Bearer " + authToken } };
    axios
      .get(API + "/registrations", config)
      .then((res) => {
        // Direct 1-to-1 sync with MongoDB documents
        setAllRegistrations(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading dashboard registrations:", err);
        setMessage("Could not load registrations from database.");
        setMessageType("error");
        setLoading(false);
      });
  }

  async function handleDeleteRegistration(reg) {
    if (
      !window.confirm(
        `Are you sure you want to delete registration for ${
          reg.name || reg.user?.name || "this student"
        }? This will remove it from MongoDB.`
      )
    ) {
      return;
    }

    try {
      const config = { headers: { Authorization: "Bearer " + token } };
      const res = await axios.delete(API + "/registrations/" + reg._id, config);
      setMessage(res.data.message || "Registration deleted from MongoDB.");
      setMessageType("success");
      // Remove from state immediately
      setAllRegistrations((prev) => prev.filter((item) => item._id !== reg._id));
    } catch (err) {
      console.error("Failed to delete from database:", err);
      setMessage(
        err.response?.data?.message || "Failed to delete record from database."
      );
      setMessageType("error");
    }

    setTimeout(() => setMessage(""), 4000);
  }

  // Filter registrations by search term
  const filteredRegistrations = allRegistrations.filter((r) => {
    const studentName = (r.name || r.user?.name || "").toLowerCase();
    const studentEmail = (r.email || r.user?.email || "").toLowerCase();
    const eventName = (r.event?.name || "").toLowerCase();
    const dept = (r.department || "").toLowerCase();
    const term = search.toLowerCase();
    return (
      studentName.includes(term) ||
      studentEmail.includes(term) ||
      eventName.includes(term) ||
      dept.includes(term)
    );
  });

  // Calculate statistics
  const totalRegistrations = allRegistrations.length;
  const uniqueStudents = new Set(
    allRegistrations.map((r) => r.email || r.user?.email).filter(Boolean)
  ).size;
  const totalRevenue = allRegistrations.reduce(
    (sum, r) => sum + (r.event?.fee || 0),
    0
  );
  const distinctEvents = new Set(
    allRegistrations.map((r) => r.event?.name).filter(Boolean)
  ).size;

  // Restrict access: Admin Only
  if (!token || role !== "admin") {
    return (
      <div className="page dashboard-page">
        <div className="page-header">
          <h1>ACCESS DENIED</h1>
        </div>
        <div
          style={{
            border: "var(--border-width) solid var(--dark)",
            padding: "35px",
            backgroundColor: "#ffdddd",
            color: "#1a1a1a",
            maxWidth: "600px",
            boxShadow: "6px 6px 0px var(--dark)",
          }}
        >
          <h2 style={{ color: "var(--red)", marginBottom: "15px" }}>
            ⛔ ADMINS ONLY
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              marginBottom: "25px",
              fontWeight: "600",
              lineHeight: 1.6,
            }}
          >
            The Organizer Dashboard is strictly restricted to administrative coordinators. Regular users and students do not have permission to access this area.
          </p>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <Link
              to="/login"
              style={{
                padding: "10px 20px",
                backgroundColor: "var(--dark)",
                color: "var(--cream)",
                fontWeight: "700",
                display: "inline-block",
                border: "2px solid var(--dark)",
              }}
            >
              Log in as Admin &rarr;
            </Link>
            <Link
              to="/events"
              style={{
                padding: "10px 20px",
                backgroundColor: "var(--yellow)",
                color: "var(--dark)",
                fontWeight: "700",
                display: "inline-block",
                border: "2px solid var(--dark)",
              }}
            >
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page dashboard-page" style={{ maxWidth: "1400px" }}>
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <div>
          <h1>
            ORGANIZER DASHBOARD{" "}
            <span
              style={{
                fontSize: "1rem",
                background: "var(--red)",
                color: "var(--cream)",
                padding: "4px 10px",
                verticalAlign: "middle",
              }}
            >
              ADMIN
            </span>
          </h1>
          <p style={{ marginTop: "5px", color: "var(--dark)", fontWeight: "600" }}>
            Live MongoDB registrations records. All actions directly modify the database.
          </p>
        </div>
      </div>

      {/* Summary KPI Stats */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card stat-highlight">
          <div className="stat-label">Total in Database</div>
          <div className="stat-value">{totalRegistrations}</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-label">Unique Students</div>
          <div className="stat-value">{uniqueStudents}</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-label">Total Fees Collected</div>
          <div className="stat-value">₹{totalRevenue}</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-label">Active Events</div>
          <div className="stat-value">{distinctEvents}</div>
        </div>
      </div>

      {/* Action Notification Message */}
      {message && (
        <div
          style={{
            padding: "14px 20px",
            marginBottom: "25px",
            border: "3px solid var(--dark)",
            backgroundColor: messageType === "success" ? "var(--yellow)" : "#ffc0bd",
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

      {/* Toolbar & Search */}
      <div className="dashboard-toolbar">
        <input
          type="text"
          placeholder="Search by student name, email, department, or event..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="dashboard-search-input"
        />
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ fontWeight: "700", fontSize: "0.95rem" }}>
            Showing {filteredRegistrations.length} of {allRegistrations.length} database records
          </span>
          <button
            onClick={() => loadAllRegistrations(token)}
            style={{
              backgroundColor: "var(--cream)",
              color: "var(--dark)",
              padding: "8px 16px",
              fontSize: "0.85rem",
            }}
          >
            ↻ Refresh DB
          </button>
        </div>
      </div>

      {/* Registrations Table */}
      {loading ? (
        <p>Loading registrations from MongoDB...</p>
      ) : filteredRegistrations.length === 0 ? (
        <div
          style={{
            padding: "40px",
            border: "var(--border-width) solid var(--dark)",
            backgroundColor: "var(--cream)",
            textAlign: "center",
            fontWeight: "700",
          }}
        >
          <p style={{ fontSize: "1.2rem", marginBottom: "10px" }}>No registrations in database.</p>
          <p style={{ color: "#666" }}>
            {search ? "No records match your search filter." : "The registrations collection in MongoDB is currently empty."}
          </p>
        </div>
      ) : (
        <div className="brutal-table-container">
          <table className="brutal-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Dept</th>
                <th>Event</th>
                <th>Category</th>
                <th>Fee</th>
                <th>Date & Time</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.map((r, index) => (
                <tr key={r._id}>
                  <td style={{ fontWeight: "700", color: "#666" }}>{index + 1}</td>
                  <td>
                    <strong>{r.name || r.user?.name || "Student"}</strong>
                  </td>
                  <td>{r.email || r.user?.email || "—"}</td>
                  <td>{r.phone || "—"}</td>
                  <td>
                    <span className="badge-tag dept">{r.department || "General"}</span>
                  </td>
                  <td>
                    <strong style={{ color: "var(--red)" }}>{r.event?.name}</strong>
                  </td>
                  <td>
                    <span className="badge-tag event-cat">
                      {r.event?.category || "Technical"}
                    </span>
                  </td>
                  <td style={{ fontWeight: "700" }}>
                    {r.event?.fee === 0 ? "Free" : `₹${r.event?.fee || 100}`}
                  </td>
                  <td style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                    {r.registeredAt
                      ? new Date(r.registeredAt).toLocaleDateString() +
                        " " +
                        new Date(r.registeredAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Confirmed"}
                  </td>
                  <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                    <button
                      onClick={() => handleDeleteRegistration(r)}
                      className="btn-table-delete"
                      title="Delete this registration from MongoDB"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
