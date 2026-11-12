export default function HomePage() {
  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>NASCAR 26 Incident Center</h1>

      <p>
        Submit incidents for league officials to review.
      </p>

      <hr />

      <h2>Submit New Incident</h2>

      <form>
        <div style={{ marginBottom: "1rem" }}>
          <label>Discord Name</label>
          <br />
          <input
            type="text"
            placeholder="Your Discord Name"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Series</label>
          <br />
          <select
            style={{ width: "100%", padding: "8px" }}
          >
            <option>Redline Cup Series</option>
            <option>Grand National Series</option>
            <option>Rapid Response Truck Series</option>
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Incident Against</label>
          <br />
          <input
            type="text"
            placeholder="Driver Being Reported"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Description</label>
          <br />
          <textarea
            rows={6}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Submit Incident
        </button>
      </form>
    </main>
  );
}
