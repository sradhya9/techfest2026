import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API } from "../api";

function Registration() {
  const [searchParams] = useSearchParams();
  const preselectedEventName = searchParams.get("event") || searchParams.get("eventName") || "";
  const preselectedEventId = searchParams.get("eventId") || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [techEvents, setTechEvents] = useState(false);
  const [nonTechEvents, setNonTechEvents] = useState(false);
  const [department, setDepartment] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [confirmedEvent, setConfirmedEvent] = useState("");
  const [selectedTechList, setSelectedTechList] = useState([]);
  const [selectedNonTechList, setSelectedNonTechList] = useState([]);

  useEffect(() => {
    // Pre-fill name and email if logged in
    const storedName = localStorage.getItem("name");
    if (storedName && !name) {
      setName(storedName);
    }

    // Auto-select event from query parameters (clicked from Events page)
    if (preselectedEventName) {
      const techNames = ["Coding Contest", "Web Dev Workshop", "Web Dev Bootcamp", "Robotics Challenge"];
      const nonTechNames = ["Cultural Night", "Football Tournament"];

      if (techNames.some((t) => t.toLowerCase() === preselectedEventName.toLowerCase())) {
        setTechEvents(true);
        setSelectedTechList((prev) =>
          prev.includes(preselectedEventName) ? prev : [...prev, preselectedEventName]
        );
      } else if (nonTechNames.some((nt) => nt.toLowerCase() === preselectedEventName.toLowerCase())) {
        setNonTechEvents(true);
        setSelectedNonTechList((prev) =>
          prev.includes(preselectedEventName) ? prev : [...prev, preselectedEventName]
        );
      } else {
        setTechEvents(true);
        setSelectedTechList((prev) =>
          prev.includes(preselectedEventName) ? prev : [...prev, preselectedEventName]
        );
      }
    }
  }, [preselectedEventName]);

  const handleTechListChange = (eventName) => {
    setSelectedTechList((prev) =>
      prev.includes(eventName) ? prev.filter((e) => e !== eventName) : [...prev, eventName]
    );
  };

  const handleNonTechListChange = (eventName) => {
    setSelectedNonTechList((prev) =>
      prev.includes(eventName) ? prev.filter((e) => e !== eventName) : [...prev, eventName]
    );
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
    setServerError("");

    if (name.trim() === "") {
      newErrors.name = "Name is required";
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number";
    }
    if (dob === "") {
      newErrors.dob = "Date of Birth is required";
    }
    if (gender === "") {
      newErrors.gender = "Gender is required";
    }
    if (department === "") {
      newErrors.department = "Department is required";
    }

    const allSelected = [...selectedTechList, ...selectedNonTechList];
    if (allSelected.length === 0 && !preselectedEventName) {
      newErrors.events = "Please select at least one event";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const targetEventName = allSelected[0] || preselectedEventName || "Coding Contest";

      // 1. Submit to Backend API (MongoDB)
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: "Bearer " + token } } : {};

      try {
        await axios.post(
          API + "/registrations",
          {
            eventId: preselectedEventId || undefined,
            eventName: targetEventName,
            selectedEvents: allSelected,
            name,
            email,
            phone,
            dob,
            gender,
            department,
            message,
          },
          config
        );

        // Clean up any stale localStorage mock data
        localStorage.removeItem("tf26_registrations");

        setConfirmedEvent(targetEventName);
        setSubmitted(true);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setServerError(err.response.data.message);
        } else {
          setServerError("Failed to register. Please check server connection.");
        }
      }
    }
  }

  if (submitted) {
    return (
      <div className="page success-page">
        <div className="success-box" style={{ maxWidth: "600px", margin: "40px auto", padding: "40px", border: "var(--border-width) solid var(--dark)", backgroundColor: "var(--yellow)", boxShadow: "8px 8px 0px var(--dark)" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "15px" }}>THANK YOU, {name.toUpperCase()}!</h1>
          <p style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "15px" }}>
            You have been registered successfully for {confirmedEvent || "TechFest 2026"}.
          </p>
          <p style={{ marginBottom: "25px", fontWeight: "600" }}>
            Your registration is confirmed in MongoDB and your seat has been reserved.
          </p>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <Link
              to="/my-registrations"
              style={{
                backgroundColor: "var(--dark)",
                color: "var(--cream)",
                padding: "12px 24px",
                fontWeight: "700",
                textTransform: "uppercase",
                border: "2px solid var(--dark)",
              }}
            >
              View My Registrations &rarr;
            </Link>
            <Link
              to="/events"
              style={{
                backgroundColor: "var(--cream)",
                color: "var(--dark)",
                padding: "12px 24px",
                fontWeight: "700",
                textTransform: "uppercase",
                border: "2px solid var(--dark)",
              }}
            >
              Browse More Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page form-page">
      <div className="page-header">
        <h1>REGISTRATION</h1>
        {preselectedEventName && (
          <p style={{ marginTop: "10px", fontSize: "1.1rem", fontWeight: "700", color: "var(--red)" }}>
            Selected Event: <span>{preselectedEventName}</span>
          </p>
        )}
      </div>

      {serverError && (
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto 25px auto",
            padding: "15px 20px",
            border: "3px solid var(--dark)",
            backgroundColor: "#ffdddd",
            color: "#1a1a1a",
            fontWeight: "700",
          }}
        >
          {serverError}
          {serverError.includes("login") && (
            <Link
              to="/login"
              style={{
                display: "inline-block",
                marginLeft: "15px",
                textDecoration: "underline",
                color: "var(--red)",
              }}
            >
              Go to Login &rarr;
            </Link>
          )}
        </div>
      )}

      <div className="form-container" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <form onSubmit={handleSubmit} className="brutal-form-grid">
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            {errors.name && <p className="error-msg">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            {errors.email && <p className="error-msg">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Mobile</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
            {errors.phone && <p className="error-msg">{errors.phone}</p>}
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
            {errors.dob && <p className="error-msg">{errors.dob}</p>}
          </div>

          <div className="form-group">
            <label>Gender</label>
            <div
              className="radio-group"
              style={{ display: "flex", gap: "20px", alignItems: "center", height: "54px" }}
            >
              <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={gender === "Male"}
                  onChange={(e) => setGender(e.target.value)}
                  style={{ width: "auto", margin: 0 }}
                />{" "}
                Male
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={gender === "Female"}
                  onChange={(e) => setGender(e.target.value)}
                  style={{ width: "auto", margin: 0 }}
                />{" "}
                Female
              </label>
            </div>
            {errors.gender && <p className="error-msg">{errors.gender}</p>}
          </div>

          <div className="form-group">
            <label>Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="brutal-select"
              style={{
                width: "100%",
                padding: "15px",
                border: "3px solid var(--dark)",
                background: "transparent",
                fontFamily: "inherit",
                fontSize: "1rem",
                height: "54px",
              }}
            >
              <option value="">Select Department</option>
              <option value="CSE">Computer Science</option>
              <option value="ECE">Electronics</option>
              <option value="ME">Mechanical</option>
              <option value="CE">Civil</option>
            </select>
            {errors.department && <p className="error-msg">{errors.department}</p>}
          </div>

          <div className="form-group full-width">
            <label>Events</label>
            <div
              className="checkbox-group"
              style={{ display: "flex", gap: "20px", padding: "10px 0" }}
            >
              <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <input
                  type="checkbox"
                  checked={techEvents}
                  onChange={(e) => {
                    setTechEvents(e.target.checked);
                    if (!e.target.checked) setSelectedTechList([]);
                  }}
                  style={{ width: "auto", margin: 0 }}
                />{" "}
                Technical
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <input
                  type="checkbox"
                  checked={nonTechEvents}
                  onChange={(e) => {
                    setNonTechEvents(e.target.checked);
                    if (!e.target.checked) setSelectedNonTechList([]);
                  }}
                  style={{ width: "auto", margin: 0 }}
                />{" "}
                Non-Technical
              </label>
            </div>

            {techEvents && (
              <div
                className="sub-events"
                style={{
                  marginLeft: "20px",
                  padding: "10px",
                  borderLeft: "3px solid var(--dark)",
                }}
              >
                <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
                  Select Technical Events:
                </p>
                <label style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "8px" }}>
                  <input
                    type="checkbox"
                    checked={selectedTechList.includes("Coding Contest")}
                    onChange={() => handleTechListChange("Coding Contest")}
                    style={{ width: "auto", margin: 0 }}
                  />{" "}
                  Coding Contest
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "8px" }}>
                  <input
                    type="checkbox"
                    checked={selectedTechList.includes("Web Dev Bootcamp") || selectedTechList.includes("Web Dev Workshop")}
                    onChange={() => handleTechListChange("Web Dev Bootcamp")}
                    style={{ width: "auto", margin: 0 }}
                  />{" "}
                  Web Dev Bootcamp
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <input
                    type="checkbox"
                    checked={selectedTechList.includes("Robotics Challenge")}
                    onChange={() => handleTechListChange("Robotics Challenge")}
                    style={{ width: "auto", margin: 0 }}
                  />{" "}
                  Robotics Challenge
                </label>
              </div>
            )}

            {nonTechEvents && (
              <div
                className="sub-events"
                style={{
                  marginLeft: "20px",
                  padding: "10px",
                  borderLeft: "3px solid var(--dark)",
                  marginTop: "10px",
                }}
              >
                <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
                  Select Non-Technical Events:
                </p>
                <label style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "8px" }}>
                  <input
                    type="checkbox"
                    checked={selectedNonTechList.includes("Cultural Night")}
                    onChange={() => handleNonTechListChange("Cultural Night")}
                    style={{ width: "auto", margin: 0 }}
                  />{" "}
                  Cultural Night
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <input
                    type="checkbox"
                    checked={selectedNonTechList.includes("Football Tournament")}
                    onChange={() => handleNonTechListChange("Football Tournament")}
                    style={{ width: "auto", margin: 0 }}
                  />{" "}
                  Football Tournament
                </label>
              </div>
            )}
            {errors.events && <p className="error-msg">{errors.events}</p>}
          </div>

          <div className="form-group full-width">
            <label>Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              style={{
                width: "100%",
                padding: "15px",
                border: "3px solid var(--dark)",
                background: "transparent",
                fontFamily: "inherit",
                fontSize: "1rem",
              }}
            ></textarea>
          </div>

          <div className="full-width">
            <button type="submit" className="submit-btn" style={{ width: "100%" }}>
              SUBMIT REGISTRATION &rarr;
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registration;
