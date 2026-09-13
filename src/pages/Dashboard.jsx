import { useState, useEffect } from "react";

function Dashboard() {
 const [registrations, setRegistrations] = useState([]);
 const [editingReg, setEditingReg] = useState(null);

 useEffect(() => {
 const stored = localStorage.getItem("tf26_registrations");
 if (stored) {
 setRegistrations(JSON.parse(stored));
 }
 }, []);

 function handleDelete(id) {
 const updated = registrations.filter(r => r.id !== id);
 setRegistrations(updated);
 localStorage.setItem("tf26_registrations", JSON.stringify(updated));
 }

 function handleEditClick(reg) {
 setEditingReg(reg);
 }

 function handleSaveEdit(e) {
 e.preventDefault();
 const updated = registrations.map(r => r.id === editingReg.id ? editingReg : r);
 setRegistrations(updated);
 localStorage.setItem("tf26_registrations", JSON.stringify(updated));
 setEditingReg(null);
 }

 return (
 <div className="page dashboard-page">
 <div className="page-header">
 <h1>ORGANIZER DASHBOARD</h1>
 </div>
 
 <div className="dashboard-content">
 <h2>Registrations</h2>
 {registrations.length === 0 ? (
 <p>No registrations found.</p>
 ) : (
 <div className="table-responsive">
 <table className="brutal-table">
 <thead>
 <tr>
 <th>Name</th>
 <th>Email</th>
 <th>Mobile</th>
 <th>Dept</th>
 <th>Events Details</th>
 <th>Actions</th>
 </tr>
 </thead>
 <tbody>
 {registrations.map(reg => (
 <tr key={reg.id}>
 <td>{reg.name}</td>
 <td>{reg.email}</td>
 <td>{reg.phone}</td>
 <td>{reg.department}</td>
 <td>
 {reg.techEvents && (
 <div>
 <strong>Tech:</strong> {reg.selectedTechList?.length > 0 ? reg.selectedTechList.join(', ') : 'Any'}
 </div>
 )}
 {reg.nonTechEvents && (
 <div>
 <strong>Non-Tech:</strong> {reg.selectedNonTechList?.length > 0 ? reg.selectedNonTechList.join(', ') : 'Any'}
 </div>
 )}
 {!reg.techEvents && !reg.nonTechEvents && "None"}
 </td>
 <td className="actions-cell">
 <button onClick={() => handleEditClick(reg)} className="btn-edit">Edit</button>
 <button onClick={() => handleDelete(reg.id)} className="btn-delete">Delete</button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>

 {editingReg && (
 <div className="modal-overlay">
 <div className="modal-content">
 <div className="modal-header">
 <h2>Edit Registration</h2>
 <button onClick={() => setEditingReg(null)} className="btn-close">X</button>
 </div>
 <form onSubmit={handleSaveEdit} className="brutal-form">
 <div className="form-group">
 <label>Name</label>
 <input type="text" value={editingReg.name} onChange={(e) => setEditingReg({...editingReg, name: e.target.value})} />
 </div>
 <div className="form-group">
 <label>Email</label>
 <input type="text" value={editingReg.email} onChange={(e) => setEditingReg({...editingReg, email: e.target.value})} />
 </div>
 <div className="form-group">
 <label>Mobile</label>
 <input type="text" value={editingReg.phone} onChange={(e) => setEditingReg({...editingReg, phone: e.target.value})} />
 </div>
 <button type="submit" className="submit-btn" style={{marginTop: '20px'}}>Save Changes</button>
 </form>
 </div>
 </div>
 )}
 </div>
 );
}

export default Dashboard;
