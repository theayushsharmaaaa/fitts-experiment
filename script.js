let trialCount = 0, totalTrials = 0;
let startTime, startX, startY, errors = 0;

// Fixed variations
const sizes = [64, 128, 196, 256];
const distances = [200, 300, 400, 500];

const target = document.getElementById("target");
const startPage = document.getElementById("startPage");
const experimentPage = document.getElementById("experimentPage");

document.getElementById("startBtn").addEventListener("click", () => {
  totalTrials = parseInt(document.getElementById("numTrials").value);
  trialCount = 0;
  errors = 0;
  startPage.style.display = "none";
  experimentPage.style.display = "block";
  nextTrial();
});

function nextTrial() {
  if (trialCount >= totalTrials) {
    alert("Experiment complete! Thank you.");
    target.style.display = "none";
    experimentPage.style.display = "none";
    startPage.style.display = "flex";
    return;
  }

  // Randomly pick from fixed sets
  const size = sizes[Math.floor(Math.random() * sizes.length)];
  const distance = distances[Math.floor(Math.random() * distances.length)];
  const direction = Math.random() < 0.5 ? -1 : 1;

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  startX = centerX - (direction * distance / 2);
  startY = centerY;

  const targetX = centerX + (direction * distance / 2);

  // Position target
  target.style.width = size + "px";
  target.style.height = size + "px";
  target.style.left = (targetX - size / 2) + "px";
  target.style.top = (centerY - size / 2) + "px";
  target.style.display = "block";

  startTime = performance.now();

  target.onclick = () => {
    const endTime = performance.now();
    const timeTaken = (endTime - startTime) / 1000; // sec

    const dx = targetX - startX;
    const dy = 0;
    const distTraveled = Math.sqrt(dx * dx + dy * dy);

    // Save row
    const row = {
      Distance: distance,
      Size: size,
      Direction: direction,
      Time: timeTaken,
      "Distance Traveled": distTraveled,
      Errors: errors
    };
    sendToSheet(row);

    errors = 0;
    trialCount++;
    nextTrial();
  };

  document.body.onclick = (e) => {
    if (e.target !== target) {
      errors++;
    }
  };
}

function sendToSheet(row) {
  fetch(APPSCRIPT_URL, {
  method: "POST",
  mode: "no-cors",
  body: JSON.stringify(row),
  headers: { "Content-Type": "application/json" }
})
  .then(() => console.log("Sent to sheet"))
  .catch(err => console.error("Error:", err));
}

