function getMoonData() {
  return {
    cycleProgress: 0.92,
    phaseName: "WANING CRESCENT",
    illumination: 4,
    lunarAgeDays: "27.2",
    signName: "VIRGO",
    signPath: "M4 6v10a2 2 0 0 0 4 0V6a2 2 0 0 1 4 0v10a2 2 0 0 0 4 0V6a2 2 0 0 1 4 0v12c0 2-2 3-3.5 1.5L14.5 17"
  };
}

function drawMoonGraphic() {
  const container = document.getElementById('moon-graphic');
  if (!container) return;

  container.innerHTML = `
    <svg viewBox="0 0 100 100" width="102" height="102" style="filter: drop-shadow(0 0 16px rgba(216, 184, 120, 0.35)); display: block; margin: 0 auto;">
      <defs>
        <radialGradient id="moon-glow" cx="50%" cy="50%" r="50%">
          <stop offset="70%" stop-color="#181322" />
          <stop offset="100%" stop-color="#221b30" />
        </radialGradient>
        <mask id="crescent-mask">
          <circle cx="50" cy="50" r="42" fill="#ffffff" />
          <circle cx="55" cy="50" r="41" fill="#000000" />
        </mask>
      </defs>

      <!-- Dark Moon Body -->
      <circle cx="50" cy="50" r="42" fill="url(#moon-glow)" stroke="rgba(216, 184, 120, 0.3)" stroke-width="1.2" />

      <!-- Warm Gold Crescent -->
      <circle cx="50" cy="50" r="42" fill="#d8b878" mask="url(#crescent-mask)" />
    </svg>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  const data = getMoonData();

  drawMoonGraphic();

  const moonSignEl = document.getElementById('moon-sign');
  const phaseNameEl = document.getElementById('phase-name');
  const illumValEl = document.getElementById('illumination-val');
  const ageValEl = document.getElementById('age-val');
  const zodiacIconEl = document.getElementById('zodiac-icon');

  if (moonSignEl) moonSignEl.innerText = `MOON IN ${data.signName}`;
  if (phaseNameEl) phaseNameEl.innerText = data.phaseName;
  if (illumValEl) illumValEl.innerText = `${data.illumination}%`;
  if (ageValEl) ageValEl.innerText = `${data.lunarAgeDays} DAYS`;

  if (zodiacIconEl) {
    zodiacIconEl.setAttribute('viewBox', '0 0 24 24');
    zodiacIconEl.innerHTML = `<path d="${data.signPath}" fill="none" stroke="#d8b878" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
});