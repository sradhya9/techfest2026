import { useNavigate } from "react-router-dom";

function EventCard({ event, onDelete, role }) {
  const navigate = useNavigate();
  const isSoldOut = event.seats <= 0;

  function handleRegisterClick() {
    // Redirect to the Registration form with the chosen event preselected
    navigate(`/register?eventId=${event._id}&event=${encodeURIComponent(event.name)}`);
  }

  return (
    <div className="event-card">
      <h3>{event.name}</h3>
      <div className="event-details">
        <p>
          <span>Category:</span> {event.category}
        </p>
        <p>
          <span>Fee:</span> {event.fee === 0 ? "Free" : `Rs. ${event.fee}`}
        </p>
        <p>
          <span>Seats left:</span> {event.seats}
        </p>
        {event.date && (
          <p>
            <span>Date:</span> {new Date(event.date).toLocaleDateString()}
          </p>
        )}
      </div>

      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
        {isSoldOut ? (
          <button disabled className="btn-sold-out">
            SOLD OUT
          </button>
        ) : (
          <button
            onClick={handleRegisterClick}
            className="btn-register"
          >
            Register &rarr;
          </button>
        )}

        {role === "admin" && onDelete && (
          <button
            onClick={() => onDelete(event._id)}
            style={{
              backgroundColor: "var(--dark)",
              color: "var(--cream)",
              border: "var(--border-width) solid var(--dark)",
              padding: "8px 12px",
              cursor: "pointer",
              fontWeight: "700",
              textTransform: "uppercase",
            }}
          >
            Delete Event
          </button>
        )}
      </div>
    </div>
  );
}

export default EventCard;
