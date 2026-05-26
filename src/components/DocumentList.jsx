export default function DocumentList({ documents, user }) {
  const filtered = documents.filter(
    (d) => d.patientEmail === user.email
  );

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Medical Records</h3>

      {filtered.length === 0 && (
        <div style={styles.empty}>
          No medical records available
        </div>
      )}

      {filtered.map((d) => (
        <div key={d.id} style={styles.item}>
          <div style={styles.header}>
            Patient: {d.patientEmail}
          </div>

          <div style={styles.content}>
            {d.content}
          </div>
        </div>
      ))}
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

  item: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    background: "#f8fafc",
    border: "1px solid #e2e8f0"
  },

  header: {
    fontSize: 12,
    color: "#2563eb",
    fontWeight: "bold",
    marginBottom: 6
  },

  content: {
    color: "#0f172a",
    lineHeight: 1.4
  },

  empty: {
    padding: 10,
    color: "#94a3b8",
    fontStyle: "italic"
  }
};