let currentStep = 0;
const steps = document.querySelectorAll(".step");
const progressBar = document.getElementById("progress-bar");

function updateProgress() {
  progressBar.style.width =
    (currentStep / (steps.length - 1)) * 100 + "%";
}

function nextStep() {
  if (currentStep >= steps.length - 1) return;

  steps[currentStep].classList.remove("active");
  currentStep++;
  steps[currentStep].classList.add("active");
  updateProgress();
}

async function getOutfit() {
  nextStep();

  const payload = {
    age_group: document.getElementById("age").value,
    gender: document.getElementById("gender").value,
    style: document.getElementById("style").value,
    palette: document.getElementById("palette").value
  };

  const res = await fetch("/pair", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  const outfit = data.best_outfit;

  document.getElementById("output").innerHTML = `
    <p><strong>Score:</strong> ${outfit.score}</p>
    <img src="${outfit.top}">
    <img src="${outfit.bottom}">
    <ul>${outfit.reasons.map(r => `<li>${r}</li>`).join("")}</ul>
  `;
}

updateProgress();
