import { useState, useEffect } from "react";

function Home() {
 const [userName, setUserName] = useState("");
 const [showModal, setShowModal] = useState(false);

 useEffect(() => {
 const storedName = localStorage.getItem("tf26_username");
 if (!storedName) {
 setShowModal(true);
 } else {
 setUserName(storedName);
 }
 }, []);

 function handleNameSubmit(e) {
 e.preventDefault();
 if (userName.trim()) {
 localStorage.setItem("tf26_username", userName.trim());
 setShowModal(false);
 }
 }

 return (
 <div className="page home-page">
 {showModal && (
 <div className="modal-overlay">
 <div className="modal-content">
 <div className="modal-header">
 <h2>ENTER YOUR NAME</h2>
 </div>
 <form onSubmit={handleNameSubmit} className="brutal-form">
 <div className="form-group">
 <input 
 type="text" 
 value={userName} 
 onChange={(e) => setUserName(e.target.value)} 
 placeholder="Your Name" 
 style={{width: '100%', padding: '15px', border: '3px solid var(--dark)', background: 'transparent', fontFamily: 'inherit', fontSize: '1.2rem'}}
 autoFocus
 />
 </div>
 <button type="submit" className="submit-btn" style={{marginTop: '20px', width: '100%'}}>ENTER &rarr;</button>
 </form>
 </div>
 </div>
 )}

 <div className="hero-section">
 <div className="hero-text">
 <h1>Welcome, <span>{userName || "Guest"}!</span></h1>
 <p>Join us for the ultimate annual technical convergence bringing together innovators, developers, and tech enthusiasts from across the region. Explore cutting-edge workshops, competitive hackathons, and engaging non-technical challenges designed to push your limits.</p>
 </div>
 </div>

 <div className="highlights-section">
 <h2>KEY HIGHLIGHTS</h2>
 <div className="event-grid">
 <div className="event-card">
 <h3>Hackathon</h3>
 <div className="event-details">
 <p>Massive 24-Hour Hackathon with exciting cash rewards.</p>
 </div>
 </div>
 <div className="event-card">
 <h3>Workshops</h3>
 <div className="event-details">
 <p>Expert-led workshops on artificial intelligence, web technologies, and robotics.</p>
 </div>
 </div>
 <div className="event-card">
 <h3>Gaming</h3>
 <div className="event-details">
 <p>Gaming tournaments and live interactive tech exhibition stalls.</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}

export default Home;
