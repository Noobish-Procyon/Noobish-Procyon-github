function saveGame(circles) {
  const data = {
    circles: circles.map(c => c.toData()),
    fusionEnergy,
    fusionPity
  };
  localStorage.setItem("circleFusionSave", JSON.stringify(data));
}

function loadGame() {
  const raw = localStorage.getItem("circleFusionSave");
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    fusionEnergy = data.fusionEnergy || 0;
    fusionPity = data.fusionPity || 0;
    const circles = (data.circles || []).map(Circle.fromData);
    return circles;
  } catch (e) {
    return null;
  }
}
