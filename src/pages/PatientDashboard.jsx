import React, { useEffect, useRef, useState } from "react";
import SlotList from "../components/SlotList";
import DocumentList from "../components/DocumentList";

export default function PatientDashboard({
  user,
  setUser,
  slots = [],
  setSlots,
  documents = []
}) {
  const fileInputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  // Safety check: if user is missing, don't break the render
  if (!user) return <div style={{ padding: 20 }}>Loading account...</div>;

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("email", user.email);

    try {
      const res = await fetch("http://localhost:5000/upload-patient", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        alert("Image uploaded successfully!");
        setAvatarUrl(data.fileUrl);
      } else {
        alert("Upload failed: " + (data.error || "Server error"));
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed: Connection error");
    }
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/slots");
        if (!response.ok) return;
        const data = await response.json();
        if (typeof setSlots === "function") setSlots(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchPatientData();
  }, [setSlots]);

  const myAppointments = (slots || []).filter(
    (s) => s?.bookedBy === user?.email && s?.isBooked
  );

  const myDocuments = (documents || []).filter(
    (d) => d?.patientEmail === user?.email
  );

const cancelBooking = async (slotId) => {
  if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
  
  // Ensure we are sending the ID exactly as it appears in your DB
  // If your DB uses string IDs like "1779876382382", this is correct.
  const idString = String(slotId).trim(); 
  
  try {
    const response = await fetch(`http://localhost:5000/api/slots/${idString}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        isBooked: false, 
        bookedBy: null // Clear the email
      })
    });
    
    if (response.ok) {
      // Update UI
      setSlots(slots.map((s) => 
        (String(s._id || s.id).trim() === idString) 
          ? { ...s, isBooked: false, bookedBy: null } 
          : s
      ));
    } else {
      const errorData = await response.json();
      alert("Error: " + (errorData.error || "Could not cancel"));
    }
  } catch (error) { 
    console.error("Network Error:", error);
    alert("Connection failed."); 
  }
};
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.headerLayout}>
          <div style={styles.userInfo}>
            <div style={{...styles.avatar, cursor: "pointer", overflow: "hidden"}} onClick={handleAvatarClick}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                  <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
                </svg>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
            <div>
              <div style={styles.name}>Patient Account</div>
              <div style={styles.email}>{user?.email}</div>
            </div>
          </div>
          <button onClick={() => setUser(null)} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      <h1 style={styles.title}>Patient Dashboard</h1>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Available Appointments</h2>
        <SlotList slots={slots} setSlots={setSlots} isDoctor={false} user={user} />
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>My Appointments</h2>
        {myAppointments.length === 0 ? (
          <p style={styles.empty}>No appointments yet</p>
        ) : (
          myAppointments.map((s) => {
            // Calculate ID once to ensure consistency between key and click handler
            const appointmentId = s._id || s.id;
            
            return (
              <div key={appointmentId} style={styles.card}>
                <div>
                  <div style={{ fontWeight: "bold", color: "#334155" }}>{s.date}</div>
                  <div style={{ color: "#64748b", marginTop: 2 }}>{s.time}</div>
                </div>
                <button 
                  onClick={() => cancelBooking(appointmentId)} 
                  style={styles.cancelBtn}
                >
                  Cancel Appointment
                </button>
              </div>
            );
          })
        )}
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>My Medical Records</h2>
        <DocumentList documents={myDocuments} user={user} />
      </div>
    </div>
  );
}

const styles = {
  page: { padding: 20, background: "linear-gradient(135deg, #f5f9ff, #e0f2fe)", minHeight: "100vh" },
  header: { background: "#2563eb", padding: 12, borderRadius: 12, marginBottom: 15, color: "white" },
  headerLayout: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  userInfo: { display: "flex", alignItems: "center", gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: "50%", background: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center" },
  name: { fontWeight: "bold" },
  email: { fontSize: 12, opacity: 0.9 },
  logoutBtn: { background: "#dc3545", color: "white", border: "none", borderRadius: 8, padding: "8px 14px", fontWeight: "bold", cursor: "pointer" },
  title: { color: "#1d4ed8", marginBottom: 20 },
  section: { marginBottom: 30 },
  sectionTitle: { color: "#2563eb", marginBottom: 10 },
  card: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, background: "#fff", borderRadius: 10, border: "1px solid #e0f2fe", marginBottom: 10 },
  cancelBtn: { background: "#ef4444", color: "white", border: "none", borderRadius: 6, padding: "8px 14px", fontWeight: "bold", cursor: "pointer" },
  empty: { color: "#94a3b8", fontStyle: "italic" }
};