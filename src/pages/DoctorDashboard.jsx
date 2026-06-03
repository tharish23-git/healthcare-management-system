import { useState } from "react";
import SlotForm from "../components/SlotForm";
import SlotList from "../components/SlotList";

export default function DoctorDashboard({ user, setUser, slots, setSlots, documents, setDocuments }) {
  const [editingDocId, setEditingDocId] = useState(null);
  const [editText, setEditText] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newNotes, setNewNotes] = useState("");

  // CREATE DOCUMENT
  const addDocument = async () => {
    if (!newEmail || !newNotes) {
      alert("Fields cannot be empty!");
      return;
    }

    try {
      const res = await fetch("http://54.169.40.124:3000/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          patientEmail: newEmail, 
          doctorEmail: user?.email, 
          content: newNotes 
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert("Server Error: " + JSON.stringify(errorData));
        return;
      }

      const data = await res.json();
      setDocuments(prevDocs => [...prevDocs, data]); 
      setNewEmail(""); 
      setNewNotes("");
    } catch (err) {
      console.error("NETWORK ERROR:", err);
      alert("Connection failed. Check server console.");
    }
  };

  // UPDATE DOCUMENT
  const updateDocument = async (id) => {
    try {
      const res = await fetch(`http://54.169.40.124:3000/api/documents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editText })
      });

      if (res.ok) {
        setDocuments(prev => prev.map(d => 
          ((d._id || d.id) === id) ? { ...d, content: editText } : d
        ));
        setEditingDocId(null);
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // DELETE DOCUMENT
  const deleteDocument = async (id) => {
    await fetch(`http://54.169.40.124:3000/api/documents/${String(id)}`, { method: "DELETE" });
    setDocuments(documents.filter(d => String(d._id || d.id) !== String(id)));
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.headerLayout}>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <div>
              <div style={styles.doctorName}>Medical Practitioner</div>
              <div style={styles.doctorEmail}>{user?.email}</div>
            </div>
          </div>
          <button onClick={() => setUser(null)} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      <h1 style={styles.title}>Doctor Dashboard</h1>

      {/* SLOTS */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Appointment Slots</h2>
        <SlotForm slots={slots} setSlots={setSlots} />
        <SlotList slots={slots} setSlots={setSlots} isDoctor={true} user={user} />
      </div>

      {/* DOCUMENTS FORM & LIST (Stacked Vertically) */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Medical Records</h2>
        <div style={styles.card}>
          <h3 style={{ marginBottom: 10, color: "#1d4ed8" }}>Create Record</h3>
          <div style={styles.formStack}>
            <input placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} style={styles.input} />
            <textarea placeholder="Notes" value={newNotes} onChange={(e) => setNewNotes(e.target.value)} style={styles.textarea} />
            <button onClick={addDocument} style={styles.saveBtn}>Save Record</button>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={{ marginBottom: 10, color: "#1d4ed8" }}>All Documents</h3>
          {documents.map((d) => {
            const docId = d._id || d.id;
            return (
              <div key={docId} style={styles.item}>
                <div style={styles.email}>{d.patientEmail}</div>
                {editingDocId === docId ? (
                  <>
                    <textarea value={editText} onChange={(e) => setEditText(e.target.value)} style={styles.textarea} />
                    <div style={styles.actions}>
                      <button onClick={() => updateDocument(docId)} style={styles.saveBtn}>Save</button>
                      <button onClick={() => setEditingDocId(null)} style={styles.cancelBtn}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={styles.contentBody}>{d.content}</div>
                    <div style={styles.actions}>
                      <button onClick={() => { setEditingDocId(docId); setEditText(d.content); }} style={styles.editBtn}>Edit</button>
                      <button onClick={() => deleteDocument(docId)} style={styles.deleteBtn}>Delete</button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: 20, background: "linear-gradient(135deg, #f5f9ff, #e0f2fe)", minHeight: "100vh" },
  header: { background: "#1e3a8a", padding: 12, borderRadius: 12, marginBottom: 15, color: "white" },
  headerLayout: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  userInfo: { display: "flex", alignItems: "center", gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: "50%", background: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center" },
  doctorName: { fontWeight: "bold" },
  doctorEmail: { fontSize: 12, opacity: 0.9 },
  logoutBtn: { background: "#dc3545", color: "white", border: "none", borderRadius: 8, padding: "8px 14px", fontWeight: "bold", cursor: "pointer" },
  title: { color: "#1d4ed8", marginBottom: 20 },
  section: { marginBottom: 30 },
  sectionTitle: { color: "#2563eb", marginBottom: 10 },
  card: { background: "#ffffff", border: "1px solid #e0f2fe", borderRadius: 14, padding: 16, marginTop: 16, boxShadow: "0 6px 16px rgba(37, 99, 235, 0.08)" },
  formStack: { display: "flex", flexDirection: "column", gap: 10 },
  item: { padding: "12px 10px", borderBottom: "1px solid #e2e8f0" },
  email: { fontWeight: "bold", color: "#2563eb", marginBottom: 4 },
  contentBody: { color: "#334155", marginTop: 4, lineHeight: "1.5" },
  input: { width: "100%", padding: 10, borderRadius: 8, border: "1px solid #cbd5e1", boxSizing: "border-box" },
  textarea: { width: "100%", minHeight: 80, padding: 10, borderRadius: 8, border: "1px solid #cbd5e1", boxSizing: "border-box" },
  actions: { display: "flex", gap: 10, marginTop: 8 },
  editBtn: { background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: 6, padding: "5px 12px", cursor: "pointer" },
  saveBtn: { background: "#22c55e", color: "white", border: "none", borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontWeight: "bold" },
  cancelBtn: { background: "#64748b", color: "white", border: "none", borderRadius: 6, padding: "6px 14px", cursor: "pointer" },
  deleteBtn: { background: "#ef4444", color: "white", border: "none", borderRadius: 6, padding: "5px 12px", cursor: "pointer" }
};