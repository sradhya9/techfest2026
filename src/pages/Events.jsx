import { useState } from "react";
import EventList from "../components/EventList";
import events from "../data/events";

function Events() {
 const [search, setSearch] = useState("");
 const [category, setCategory] = useState("All");

 const filteredEvents = events.filter((event) => {
 const nameMatches = event.name.toLowerCase().includes(search.toLowerCase());
 const categoryMatches = category === "All" || event.category === category;
 return nameMatches && categoryMatches;
 });

 return (
 <div className="page">
 <div className="page-header">
 <h1>EVENTS</h1>
 </div>
 
 <div className="filter-bar">
 <input
 type="text"
 placeholder="Search events..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="search-input"
 />
 <select value={category} onChange={(e) => setCategory(e.target.value)} className="category-select">
 <option value="All">All Categories</option>
 <option value="Technical">Technical</option>
 <option value="Workshop">Workshop</option>
 <option value="Cultural">Cultural</option>
 <option value="Sports">Sports</option>
 </select>
 </div>

 <EventList events={filteredEvents} />

 <div className="events-info-sections">
 <div className="info-card full-width-card">
 <h2>REGISTRATION STEPS</h2>
 <ul>
 <li>Step 1: Browse the events list above.</li>
 <li>Step 2: Click on 'Register' for your desired event to go to the Registration page.</li>
 <li>Step 3: Fill in your personal details and select the events.</li>
 <li>Step 4: Submit the form to confirm your participation.</li>
 </ul>
 </div>

 <div className="info-cards-grid">
 <div className="info-card">
 <h2>EVENT CATEGORIES</h2>
 <p>We offer a variety of categories including Technical, Workshop, Cultural, and Sports to cater to all interests.</p>
 </div>

 <div className="info-card">
 <h2>EVENT COORDINATORS</h2>
 <p>For any queries, contact our lead coordinators: John Doe (Technical) and Jane Smith (Cultural).</p>
 </div>

 <div className="info-card">
 <h2>SCHEDULE OF EACH EVENT</h2>
 <p>Detailed schedules will be emailed to registered participants 48 hours prior to the event.</p>
 </div>
 </div>
 </div>
 </div>
 );
}

export default Events;
