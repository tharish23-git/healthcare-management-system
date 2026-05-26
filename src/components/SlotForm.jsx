import { useState } from "react";

export default function SlotForm({ slots, setSlots }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const addSlot = () => {
    if (!date || !time) return;

    setSlots([
      ...slots,
      { id: Date.now(), date, time, isBooked: false }
    ]);

    setDate("");
    setTime("");
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Create Appointment Slot</h3>

      <div style={styles.row}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={styles.input}
        />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={styles.input}
        />
      </div>

      <button onClick={addSlot} style={styles.button}>
        Add Slot
      </button>

      {/* Dummy Preview (UI Confirmation) */}
      <div style={styles.preview}>
        Preview: {date || "YYYY-MM-DD"} {time || "HH:MM"}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#ffffff",
    border: "1px solid #e0f2fe",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    boxShadow: "0 6px 16px rgba(37, 99, 235, 0.08)"
  },

  title: {
    marginBottom: 12,
    color: "#1d4ed8"
  },

  row: {
    display: "flex",
    gap: 10,
    marginBottom: 12
  },

  input: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    outline: "none"
  },

  button: {
    width: "100%",
    padding: 10,
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold"
  },

  preview: {
    marginTop: 10,
    fontSize: 12,
    color: "#64748b"
  }
};