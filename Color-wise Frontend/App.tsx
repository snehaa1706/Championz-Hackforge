
import { Route, Switch, Link } from "wouter";
import bg from "./assets/background.jpg";
import Questionnaire from "./pages/Questionnaire";

function Landing() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.35)",
          backdropFilter: "blur(10px)",
          padding: "40px 56px",
          borderRadius: "24px",
        }}
      >
        <h1
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "48px",
            marginBottom: "20px",
          }}
        >
          colorwise
        </h1>

        <p style={{ marginBottom: "32px", fontSize: "18px" }}>
          Discover your true style potential with our intelligent wardrobe assistant.
        </p>

        <Link href="/questionnaire">
          <a
            style={{
              display: "inline-block",
              padding: "14px 36px",
              fontSize: "18px",
              borderRadius: "999px",
              border: "none",
              background: "rgba(255,255,255,0.6)",
              color: "#111",
              cursor: "pointer",
              transition: "all 0.3s ease",
              textDecoration: "none",
            }}
          >
            Start Questionnaire
          </a>
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/questionnaire" component={Questionnaire} />
      <Route>
        <div style={{ padding: 24 }}>404 - Not Found</div>
      </Route>
    </Switch>
  );
}
