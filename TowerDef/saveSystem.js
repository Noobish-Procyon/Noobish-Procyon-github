function saveTDGame(state) {
  const data = {
    coins: state.coins,
    wave: state.wave,
    turrets: state.turrets.map(t => ({
      type: t.type,
      x: t.x,
      y: t.y
    }))
  };
  localStorage.setItem("circleTDSave", JSON.stringify(data));
}

function loadTDGame(path) {
  const raw = localStorage.getItem("circleTDSave");
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    const turrets = (data.turrets || []).map(t => new Turret(t.type, t.x, t.y));
    return {
      coins: data.coins || 0,
      wave: data.wave || 1,
      turrets
    };
  } catch (e) {
    return null;
  }
}
