function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function dist(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx*dx + dy*dy);
}
