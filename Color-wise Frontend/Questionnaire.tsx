import { useMemo, useState } from "react";
import { Link } from "wouter";

const AGE_OPTIONS = ["13–17", "18–24", "25–34", "35–44", "45+"];
const GENDER_OPTIONS = ["Female", "Male", "Other"];
const STYLE_OPTIONS = ["Casual", "Formal", "Sporty", "Chic"];
const COLOR_PALETTE_OPTIONS = ["Neutral", "Cool", "Warm"];

type Gender = "Female" | "Male" | "Other" | null;

function themeFromGender(gender: Gender) {
  if (gender === "Female") return { bg: "#cec3cf", text: "#974b66" };
  if (gender === "Male") return { bg: "#879fae", text: "#333c4d" };
  if (gender === "Other") return { bg: "#a8a49b", text: "#3d2d19" };
  return { bg: "#c1bea8", text: "#1a1a1a" };
}

export default function Questionnaire() {
  const [step, setStep] = useState(1);

  const [age, setAge] = useState<string | null>(null);
  const [gender, setGender] = useState<Gender>(null);
  const [style, setStyle] = useState<string | null>(null);
  const [palette, setPalette] = useState<string | null>(null);

  const page23 = { bg: "#c1bea8", text: "#1a1a1a" };
  const page4plus = useMemo(() => themeFromGender(gender), [gender]);
  const activeTheme = step <= 2 ? page23 : page4plus;

  const progress =
    step === 1 ? "20%" :
    step === 2 ? "40%" :
    step === 3 ? "60%" :
    step === 4 ? "80%" : "100%";

  /* 🔮 Glassmorphism */
  const cardBase = "rgba(255,255,255,0.28)";
  const cardHover = "rgba(255,255,255,0.18)";
  const cardSelected = "rgba(255,255,255,0.35)";

  function OptionButton({
    label,
    selected,
    onClick,
  }: {
    label: string;
    selected: boolean;
    onClick: () => void;
  }) {
    return (
      <button
        onClick={onClick}
        style={{
          padding: 18,
          borderRadius: 20,
          border: selected
            ? `2px solid ${activeTheme.text}`
            : "1px solid rgba(255,255,255,0.35)",
          background: selected ? cardSelected : cardBase,
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          color: activeTheme.text,
          cursor: "pointer",
          fontSize: 18,
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
          transition: "all 0.25s ease",
        }}
        onMouseEnter={(e) => {
          if (!selected) {
            e.currentTarget.style.background = cardHover;
            e.currentTarget.style.transform = "translateY(-2px)";
          }
        }}
        onMouseLeave={(e) => {
          if (!selected) {
            e.currentTarget.style.background = cardBase;
            e.currentTarget.style.transform = "translateY(0)";
          }
        }}
      >
        {label}
      </button>
    );
  }

  const navBtn = (enabled: boolean) => ({
    padding: "12px 20px",
    borderRadius: 999,
    border: `1px solid ${activeTheme.text}`,
    background: enabled ? activeTheme.text : "rgba(0,0,0,0.2)",
    color: enabled ? activeTheme.bg : "rgba(255,255,255,0.9)",
    cursor: enabled ? "pointer" : "not-allowed",
    fontWeight: 800 as const,
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 24,
        background: activeTheme.bg,
        color: activeTheme.text,
        display: "grid",
        placeItems: "center",
      }}
    >
      {/* Progress bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: 3,
          background: "rgba(0,0,0,0.15)",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            width: progress,
            height: "100%",
            background: activeTheme.text,
            transition: "width 300ms ease",
          }}
        />
      </div>

      <div style={{ width: "min(760px, 92vw)" }}>
        {/* STEP 1 — AGE */}
        {step === 1 && (
          <>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 36, textAlign: "center" }}>
              What’s your age range?
            </h2>

            <div
              style={{
                display: "grid",
                gap: 14,
                marginTop: 22,
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              }}
            >
              {AGE_OPTIONS.map((opt) => (
                <OptionButton key={opt} label={opt} selected={age === opt} onClick={() => setAge(opt)} />
              ))}
            </div>

            <div style={{ marginTop: 22, display: "flex", justifyContent: "space-between" }}>
              <Link href="/"><a style={{ color: activeTheme.text }}>← Back</a></Link>
              <button style={navBtn(!!age)} disabled={!age} onClick={() => setStep(2)}>
                Next →
              </button>
            </div>
          </>
        )}

        {/* STEP 2 — GENDER */}
        {step === 2 && (
          <>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 36, textAlign: "center" }}>
              Select your gender
            </h2>

            <div
              style={{
                display: "grid",
                gap: 14,
                marginTop: 22,
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              }}
            >
              {GENDER_OPTIONS.map((opt) => (
                <OptionButton
                  key={opt}
                  label={opt}
                  selected={gender === opt}
                  onClick={() => setGender(opt as Gender)}
                />
              ))}
            </div>

            <div style={{ marginTop: 22, display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setStep(1)}>← Back</button>
              <button style={navBtn(!!gender)} disabled={!gender} onClick={() => setStep(3)}>
                Next →
              </button>
            </div>
          </>
        )}

        {/* STEP 3 — STYLE */}
        {step === 3 && (
          <>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 36, textAlign: "center" }}>
              Choose your style
            </h2>

            <div
              style={{
                display: "grid",
                gap: 14,
                marginTop: 22,
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              }}
            >
              {STYLE_OPTIONS.map((opt) => (
                <OptionButton key={opt} label={opt} selected={style === opt} onClick={() => setStyle(opt)} />
              ))}
            </div>

            <div style={{ marginTop: 22, display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setStep(2)}>← Back</button>
              <button style={navBtn(!!style)} disabled={!style} onClick={() => setStep(4)}>
                Next →
              </button>
            </div>
          </>
        )}

        {/* STEP 4 — COLOR PALETTE */}
        {step === 4 && (
          <>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 36, textAlign: "center" }}>
              Choose your color palette
            </h2>

            <div
              style={{
                display: "grid",
                gap: 14,
                marginTop: 22,
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              }}
            >
              {COLOR_PALETTE_OPTIONS.map((opt) => (
                <OptionButton
                  key={opt}
                  label={opt}
                  selected={palette === opt}
                  onClick={() => setPalette(opt)}
                />
              ))}

              {/* I DON’T KNOW OPTION (video link) */}
              <button
                onClick={() => window.open("https://youtu.be/a4qN3vdmrTY", "_blank")}
                style={{
                  padding: 18,
                  borderRadius: 20,
                  border: `1px dashed ${activeTheme.text}`,
                  background: "rgba(255,255,255,0.20)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  color: activeTheme.text,
                  cursor: "pointer",
                  fontSize: 16,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.14)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.20)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                I don’t know — watch color analysis video
              </button>
            </div>

            <div style={{ marginTop: 22, display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setStep(3)}>← Back</button>
              <button style={navBtn(!!palette)} disabled={!palette} onClick={() => setStep(5)}>
                Next →
              </button>
            </div>
          </>
        )}

        {/* STEP 5 — RESULT */}
        {step === 5 && (
          <>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 36, textAlign: "center" }}>
              Your profile
            </h2>

            <div
              style={{
                marginTop: 18,
                padding: 18,
                borderRadius: 20,
                background: "rgba(255,255,255,0.28)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: `1px solid rgba(255,255,255,0.35)`,
                boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
              }}
            >
              <p><b>Age:</b> {age}</p>
              <p><b>Gender:</b> {gender}</p>
              <p><b>Style:</b> {style}</p>
              <p><b>Palette:</b> {palette}</p>
            </div>

            <div style={{ marginTop: 22, textAlign: "center" }}>
              <Link href="/">
                <a style={{ ...navBtn(true), textDecoration: "none", display: "inline-block" }}>
                  Finish
                </a>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

