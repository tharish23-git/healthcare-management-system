import { useState, useEffect } from "react";
import Login from "./pages/Login";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";

export default function App() {
  const [user, setUser] = useState(null);
  const [slots, setSlots] = useState([]);
  const [documents, setDocuments] = useState([]);

  // ✅ INITIAL CORE FETCH: Get data immediately for whoever logs in
  useEffect(() => {
    const loadSystemData = async () => {
      try {
        const slotsRes = await fetch("http://localhost:5000/api/slots");
        if (slotsRes.ok) setSlots(await slotsRes.json());

        const docsRes = await fetch("http://localhost:5000/api/documents");
        if (docsRes.ok) setDocuments(await docsRes.json());
      } catch (err) {
        console.error("Failed to load initial backend system arrays:", err);
      }
    };
    loadSystemData();
  }, [user]); // Re-fetch on login state transitions to guarantee crisp sync

  if (!user) {
    return <Login setUser={setUser} />;
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {user.role === "doctor" ? (
          <DoctorDashboard
            user={user}
            setUser={setUser}
            slots={slots}
            setSlots={setSlots}
            documents={documents}
            setDocuments={setDocuments}
          />
        ) : (
          <PatientDashboard
            user={user}
            setUser={setUser}
            slots={slots}
            setSlots={setSlots}
            documents={documents}
          />
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: "100vh", background: "linear-gradient(135deg, #e0f2fe, #f5f9ff)", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: 30 },
  container: { width: "100%", maxWidth: 900, background: "#ffffff", borderRadius: 16, boxShadow: "0 10px 30px rgba(0,0,0,0.08)", padding: 24 }
};