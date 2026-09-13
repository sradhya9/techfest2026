import EventCard from "./EventCard";

// This component receives an ARRAY of events and shows one card per event
function EventList({ events }) {
 if (events.length === 0) {
 return <div className="no-events"><p>No events found.</p></div>;
 }

 return (
 <div className="event-grid">
 {events.map((event) => (
 <EventCard key={event.id} event={event} />
 ))}
 </div>
 );
}

export default EventList;
