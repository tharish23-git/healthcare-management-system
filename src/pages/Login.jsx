import { useState } from "react";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (role) => {
    if (!email || !password) {
      alert("Please fill in both Email and Password fields.");
      return;
    }

    // Stores email and role so dashboards can read them and pass them in HTTP Headers
    setUser({ email, role });
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Hospital System Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <div style={styles.buttonGroup}>
          <button
            onClick={() => handleLogin("doctor")}
            style={styles.doctorBtn}
          >
            Login as Doctor
          </button>

          <button
            onClick={() => handleLogin("patient")}
            style={styles.patientBtn}
          >
            Login as Patient
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #e0f2fe, #f5f9ff)"
  },

  card: {
    width: 360,
    background: "#ffffff",
    border: "1px solid #e0f2fe",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 10px 30px rgba(37, 99, 235, 0.12)"
  },

  title: {
    marginBottom: 16,
    color: "#1d4ed8",
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold"
  },

  input: {
    width: "100%",
    padding: 10,
    marginBottom: 12,
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    outline: "none",
    boxSizing: "border-box"
  },

  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 10
  },

  doctorBtn: {
    padding: 10,
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold"
  },

  // Inside src/pages/Login.jsx styles object:
  patientBtn: {
    padding: 10,
    background: "#2563eb", // Changed from #60a5fa to match the Doctor button
    color: "white",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold"
  }
};