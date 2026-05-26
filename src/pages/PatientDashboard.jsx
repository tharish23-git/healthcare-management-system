import React, { useEffect } from "react";
import SlotList from "../components/SlotList";
import DocumentList from "../components/DocumentList";

export default function PatientDashboard({
  user,
  setUser, 
  slots = [], 
  setSlots,
  documents = [] 
}) {
  
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/slots");
        if (!response.ok) throw new Error("Database offline or unavailable");
        const data = await response.json();
        if (typeof setSlots === "function") {
          setSlots(data);
        }
      } catch (error) {
        console.error("Error connecting to server database:", error);
      }
    };

    if (user) {
      fetchPatientData();
    }
  }, [user, setSlots]);

  // ✅ FILTER: Show ONLY this specific patient's booked appointments
  const myAppointments = (slots || []).filter(
    (s) => s && s.bookedBy === user?.email && s.isBooked
  );

  // ✅ FILTER: Show ONLY medical records addressed to this patient
  const myDocuments = (documents || []).filter(
    (d) => d && d.patientEmail === user?.email
  );

  const cancelBooking = async (id) => {
    const ok = window.confirm("Are you sure you want to cancel this appointment?");
    if (!ok) return;

    try {
      const response = await fetch(`http://localhost:5000/api/slots/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": user.role,
          "x-user-email": user.email
        },
        body: JSON.stringify({ isBooked: false, bookedBy: null }) // Reset both fields on backend
      });

      if (!response.ok) throw new Error("Failed to cancel booking on server");

      // ✅ REFLECT STATE CHANGED: Instantly updates global state so Doctor sees it too
      if (typeof setSlots === "function") {
        setSlots(
          slots.map((s) =>
            s.id === id ? { ...s, isBooked: false, bookedBy: null } : s
          )
        );
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.headerLayout}>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
              </svg>
            </div>
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
          myAppointments.map((s) => (
            <div key={s.id} style={styles.card}>
              <div>
                <div style={{ fontWeight: "bold", color: "#334155" }}>{s.date}</div>
                <div style={{ color: "#64748b", marginTop: 2 }}>{s.time}</div>
              </div>
              <button onClick={() => cancelBooking(s.id)} style={styles.cancelBtn}>
                Cancel Appointment
              </button>
            </div>
          ))
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