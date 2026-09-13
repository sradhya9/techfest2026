import { useState } from "react";
import { useNavigate } from "react-router-dom";

// This component receives ONE event object as a prop, called "event"
function EventCard({ event }) {
 const navigate = useNavigate();
 // seatsLeft is STATE - it belongs to this one card and can change over time
 const [seatsLeft, setSeatsLeft] = useState(event.seats);

 function handleRegister() {
 if (seatsLeft > 0) {
 navigate('/register');
 }
 }

 return (
 <div className="event-card">
 <h3>{event.name}</h3>
 <div className="event-details">
 <p><span>Category:</span> {event.category}</p>
 <p><span>Fee:</span> {event.fee === 0 ? "Free" : `Rs. ${event.fee}`}</p>
 <p><span>Seats left:</span> {seatsLeft}</p>
 </div>
 {seatsLeft === 0 ? (
 <button disabled className="btn-sold-out">SOLD OUT</button>
 ) : (
 <button onClick={handleRegister} className="btn-register">Register &rarr;</button>
 )}
 </div>
 );
}

export default EventCard;
