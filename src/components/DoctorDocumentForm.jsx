import { useState } from "react";

export default function DoctorDocumentForm({ documents, setDocuments, doctorEmail }) {
  const [patientEmail, setPatientEmail] = useState("");
  const [content, setContent] = useState("");

  const addDocument = async () => {
    const response = await fetch("http://54.169.40.124:3000/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientEmail, doctorEmail, content })
    });
    const savedDoc = await response.json();
    setDocuments([...documents, savedDoc]);
    setPatientEmail(""); setContent("");
  };

  return (
    <div>
      <input placeholder="Email" value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} />
      <textarea placeholder="Notes" value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={addDocument}>Save Record</button>
    </div>
  );
}