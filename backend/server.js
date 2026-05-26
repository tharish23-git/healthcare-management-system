const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let slots = [
  { id: 1, date: "2026-05-25", time: "10:00", isBooked: false, bookedBy: null },
  { id: 2, date: "2026-05-25", time: "11:00", isBooked: true, bookedBy: "patient@test.com" }
];

let documents = [
  { id: "1", patientEmail: "patient@test.com", doctorEmail: "doctor@test.com", content: "Blood pressure is normal." }
];

app.get("/api/slots", (req, res) => res.json(slots));
app.put("/api/slots/:id", (req, res) => {
  const slot = slots.find(s => String(s.id) === req.params.id);
  if (slot) {
    slot.isBooked = req.body.isBooked;
    slot.bookedBy = req.body.bookedBy;
  }
  res.json(slot);
});

app.get("/api/documents", (req, res) => res.json(documents));
app.post("/api/documents", (req, res) => {
  const newDoc = { id: String(Date.now()), ...req.body };
  documents.push(newDoc);
  res.status(201).json(newDoc);
});
app.put("/api/documents/:id", (req, res) => {
  const doc = documents.find(d => String(d.id) === req.params.id);
  if (doc) doc.content = req.body.content;
  res.json(doc);
});
app.delete("/api/documents/:id", (req, res) => {
  documents = documents.filter(d => String(d.id) !== req.params.id);
  res.json({ success: true });
});

app.listen(5000, () => console.log("Server running on port 5000"));