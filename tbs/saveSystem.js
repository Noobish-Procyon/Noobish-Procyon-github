function saveGame(state) {
  localStorage.setItem("circleClashSave", JSON.stringify(state));
}

function loadGame() {
  const raw = localStorage.getItem("circleClashSave");
  if (!raw) return null;
  return JSON.parse(raw);
}
