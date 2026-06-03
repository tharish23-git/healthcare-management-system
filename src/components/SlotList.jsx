export default function SlotList({ slots, setSlots, isDoctor, user }) {
  const bookSlot = async (slotId) => {
    try {
      // 1. Use the correct slotId string
      const response = await fetch(`http://54.169.40.124:3000/api/slots/${slotId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          isBooked: true, 
          bookedBy: user?.email 
        }),
      });

      if (response.ok) {
        // 2. Match using _id
        setSlots(
          slots.map((s) =>
            (s._id === slotId)
              ? { ...s, isBooked: true, bookedBy: user?.email }
              : s
          )
        );
        alert("Appointment booked successfully!");
      } else {
        const err = await response.json();
        alert("Failed to save booking: " + (err.error || "Server error"));
      }
    } catch (error) {
      console.error("Booking error:", error);
    }
  };

  return (
    <div style={styles.card}>
      <h3>Slots</h3>
      {slots.map((s) => {
        // 3. Define the ID clearly
        const slotId = s._id; 
        
        return (
          <div key={slotId} style={styles.item}>
            <div>
              {s.date} {s.time}
            </div>

            {isDoctor && (
              <span>
                {s.isBooked ? `Booked by ${s.bookedBy}` : "Open"}
              </span>
            )}

            {!isDoctor && !s.isBooked && (
              // 4. Pass the correct slotId
              <button onClick={() => bookSlot(slotId)}>
                Book
              </button>
            )}

            {!isDoctor && s.isBooked && (
              <span>Booked</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  card: { padding: 10 },
  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    borderBottom: "1px solid #ddd"
  }
};