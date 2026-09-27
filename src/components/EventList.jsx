import EventCard from "./EventCard";

function EventList({ events, onDelete, role }) {
  if (!events || events.length === 0) {
    return (
      <div className="no-events">
        <p>No events found.</p>
      </div>
    );
  }

  return (
    <div className="event-grid">
      {events.map((event) => (
        <EventCard
          key={event._id || event.id}
          event={event}
          onDelete={onDelete}
          role={role}
        />
      ))}
    </div>
  );
}

export default EventList;
