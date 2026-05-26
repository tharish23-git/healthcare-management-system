export default function SlotList({ slots, setSlots, isDoctor, user }) {
  const bookSlot = (id) => {
    setSlots(
      slots.map((s) =>
        s.id === id
          ? {
              ...s,
              isBooked: true,
              bookedBy: user?.email
            }
          : s
      )
    );
  };

  return (
    <div style={styles.card}>
      <h3>Slots</h3>

      {slots.map((s) => (
        <div key={s.id} style={styles.item}>
          <div>
            {s.date} {s.time}
          </div>

          {isDoctor && (
            <span>
              {s.isBooked ? `Booked by ${s.bookedBy}` : "Open"}
            </span>
          )}

          {!isDoctor && !s.isBooked && (
            <button onClick={() => bookSlot(s.id)}>
              Book
            </button>
          )}

          {!isDoctor && s.isBooked && (
            <span>Booked</span>
          )}
        </div>
      ))}
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