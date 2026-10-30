import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../api";

function MyRegistrations() {
  const [list, setList] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear old mock localStorage entries permanently so it matches MongoDB strictly
    localStorage.removeItem("tf26_registrations");

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first to view your registrations.");
      setLoading(false);
      return;
    }

    const config = { headers: { Authorization: "Bearer " + token } };
    axios
      .get(API + "/registrations/my", config)
      .then((res) => {
        // Direct 1-to-1 sync with MongoDB documents
        setList(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setMessage(err.response?.data?.message || "Please login first");
        setLoading(false);
      });
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>MY REGISTRATIONS</h1>
      </div>

      {loading && <p>Loading your registrations from MongoDB...</p>}

      {message && !loading && list.length === 0 && (
        <div
          style={{
            padding: "20px",
            border: "3px solid var(--dark)",
            backgroundColor: "var(--yellow)",
            color: "var(--dark)",
            fontWeight: "700",
            marginBottom: "30px",
            display: "inline-block",
          }}
        >
          <p style={{ marginBottom: "15px" }}>{message}</p>
          <div style={{ display: "flex", gap: "10px" }}>
            <Link
              to="/login"
              style={{
                display: "inline-block",
                background: "var(--dark)",
                color: "var(--cream)",
                padding: "8px 16px",
                fontWeight: "700",
              }}
            >
              Go to Login &rarr;
            </Link>
            <Link
              to="/register"
              style={{
                display: "inline-block",
                border: "2px solid var(--dark)",
                padding: "8px 16px",
                fontWeight: "700",
              }}
            >
              Fill Registration Form
            </Link>
          </div>
        </div>
      )}

      {!loading && list.length === 0 && !message && (
        <div className="no-events">
          <p>You have not registered for any events yet in the database.</p>
          <Link
            to="/events"
            style={{
              display: "inline-block",
              marginTop: "15px",
              background: "var(--red)",
              color: "var(--cream)",
              padding: "10px 20px",
              fontWeight: "700",
            }}
          >
            Browse Events &rarr;
          </Link>
        </div>
      )}

      {!loading && list.length > 0 && (
        <div className="event-grid">
          {list.map((r) => (
            <div key={r._id} className="event-card">
              <h3>{r.event?.name || "Event Registration"}</h3>
              <div className="event-details">
                <p>
                  <span>Category:</span> {r.event?.category || "General"}
                </p>
                <p>
                  <span>Fee:</span>{" "}
                  {r.event?.fee === 0 ? "Free" : `Rs. ${r.event?.fee || 100}`}
                </p>
                {r.department && (
                  <p>
                    <span>Department:</span> {r.department}
                  </p>
                )}
                {r.phone && (
                  <p>
                    <span>Contact:</span> {r.phone}
                  </p>
                )}
                <p>
                  <span>Registered:</span>{" "}
                  {r.registeredAt
                    ? new Date(r.registeredAt).toLocaleDateString()
                    : "Confirmed"}
                </p>
              </div>
              <div
                style={{
                  marginTop: "auto",
                  padding: "10px 12px",
                  background: "var(--yellow)",
                  color: "var(--dark)",
                  fontWeight: "800",
                  textAlign: "center",
                  border: "2px solid var(--dark)",
                  boxShadow: "3px 3px 0px var(--dark)",
                }}
              >
                ✓ CONFIRMED REGISTRATION
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRegistrations;
