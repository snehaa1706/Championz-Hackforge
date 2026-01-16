export default function App() {
  return (
    <div
      className="landing"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1520975922203-bf9f4b8adcc5')",
      }}
    >
      {/* progress bar */}
      <div className="progress" />

      <h1 style={{ fontSize: "64px", fontWeight: 600 }}>colorwise</h1>
      <p style={{ opacity: 0.8, marginTop: 12 }}>
        Discover your true style potential
      </p>

      <button className="start-btn">
        Start Questionnaire
      </button>
    </div>
  );
}
