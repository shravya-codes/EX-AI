// Live clock in topbar
function tickClock() {
  const el = document.getElementById('live-clock');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleTimeString('en-IN', { hour12: false });
}
setInterval(tickClock, 1000);
tickClock();
