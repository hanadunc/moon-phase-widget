function getMoonData(date = new Date()) {
  const LUNAR_MONTH = 29.5305877; // Average synodic month length in days
  
  // Exact verified New Moon: Saturday, Oct 10, 2026 at 11:50 AM EDT (15:50 UTC)
  const exactNewMoon = new Date(Date.UTC(2026, 9, 10, 15, 50, 0));
  
  const diffMs = date.getTime() - exactNewMoon.getTime();
  const lunarAgeDays = ((diffMs / (1000 * 60 * 60 * 24)) % LUNAR_MONTH + LUNAR_MONTH) % LUNAR_MONTH;
  const cycleProgress = lunarAgeDays / LUNAR_MONTH;
  
  // Dynamic illumination formula based on lunar phase angle
  const phaseAngle = cycleProgress * 2 * Math.PI;
  const illuminationFraction = (1 - Math.cos(phaseAngle)) / 2;
  const illuminationPercent = (illuminationFraction * 100).toFixed(1);

  // Dynamic Phase Name
  let phaseName = "";
  if (cycleProgress < 0.03 || cycleProgress >= 0.97) phaseName = "NEW MOON";
  else if (cycleProgress < 0.22) phaseName = "WAXING CRESCENT";
  else if (cycleProgress < 0.28) phaseName = "FIRST QUARTER";
  else if (cycleProgress < 0.47) phaseName = "WAXING GIBBOUS";
  else if (cycleProgress < 0.53) phaseName = "FULL MOON";
  else if (cycleProgress < 0.72) phaseName = "WANING GIBBOUS";
  else if (cycleProgress < 0.78) phaseName = "LAST QUARTER";
  else phaseName = "WANING CRESCENT";

  // Dynamic Zodiac Sign Cycle (~2.27 days per sign)
  const ZODIAC_SIGNS = [
    { name: "SAGITTARIUS", symbol: "♐︎" },
    { name: "CAPRICORN", symbol: "♑︎" },
    { name: "AQUARIUS", symbol: "♒︎" },
    { name: "PISCES", symbol: "♓︎" },
    { name: "ARIES", symbol: "♈︎" },
    { name: "TAURUS", symbol: "♉︎" },
    { name: "GEMINI", symbol: "♊︎" },
    { name: "CANCER", symbol: "♋︎" },
    { name: "LEO", symbol: "♌︎" },
    { name: "VIRGO", symbol: "♍︎" },
    { name: "LIBRA", symbol: "♎︎" },
    { name: "SCORPIO", symbol: "♏︎" }
  ];

  // Zodiac alignment anchor (Moon in Sagittarius ♐︎)
  const zodiacAnchor = new Date(Date.UTC(2026, 9, 13, 23, 9, 0));
  const daysSinceAnchor = (date.getTime() - zodiacAnchor.getTime()) / (1000 * 60 * 60 * 24);
  const ZODIAC_CYCLE = 27.321661; // Sidereal month in days
  const signIndex = Math.floor((((daysSinceAnchor % ZODIAC_CYCLE) + ZODIAC_CYCLE) % ZODIAC_CYCLE) / (ZODIAC_CYCLE / 12));
  const currentZodiac = ZODIAC_SIGNS[signIndex % 12] || ZODIAC_SIGNS[0];

  return {
    cycleProgress: cycleProgress,
    illuminationFraction: illuminationFraction,
    phaseName: phaseName,
    illumination: `${illuminationPercent}%`,
    lunarAgeDays: `${lunarAgeDays.toFixed(2)} DAYS`,
    signName: currentZodiac.name,
    zodiacSymbol: currentZodiac.symbol
  };
}

// Dynamic SVG Crescent Graphic with Radiant Celestial Gold Gradient
function renderMoonGraphic(illuminationPercent = 27.5, isWaxing = true) {
  const container = document.getElementById('moon-graphic');
  if (!container) return;

  const sweepFlag = isWaxing ? "1" : "0";
  const innerSweep = isWaxing ? "0" : "1";

container.innerHTML = `
    <svg width="100" height="100" viewBox="0 0 100 100" style="overflow: visible;">
      <defs>
        <!-- Crescent Glow Filter -->
        <filter id="crescent-soft-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur1" />
          <feGaussianBlur stdDeviation="1.5" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      <!-- Deep Ambient Moon Aura Filter -->
        <filter id="ambient-moon-aura" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="14" result="wideBlur" />
          <feGaussianBlur stdDeviation="6" result="tightBlur" />
          <feMerge>
            <feMergeNode in="wideBlur" />
            <feMergeNode in="tightBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- Deeper, Prominent Ambient Backdrop Aura -->
      <circle class="moon-ambient-glow" cx="50" cy="50" r="40" fill="rgba(227, 200, 150, 0.45)" filter="url(#ambient-moon-aura)"/>

      <!-- Base Dark Moon Disk -->
      <circle cx="50" cy="50" r="42" fill="#181320" stroke="rgba(227, 200, 150, 0.25)" stroke-width="1"/>

      <!-- Dynamic Illuminated Crescent -->
      <path d="M50 8 A42 42 0 0 ${sweepFlag} 50 92 A35 42 0 0 ${innerSweep} 50 8 Z" 
            fill="#E3C896" 
            filter="url(#crescent-soft-glow)"/>
    </svg>
  `;
}

function updateLunarData() {
  const now = new Date();
  const data = getMoonData(now);

  if (document.getElementById('phase-name')) document.getElementById('phase-name').innerText = data.phaseName;
  if (document.getElementById('illumination-value')) document.getElementById('illumination-value').innerText = data.illumination;
  if (document.getElementById('lunar-age-value')) document.getElementById('lunar-age-value').innerText = data.lunarAgeDays;
  if (document.getElementById('zodiac-sign')) document.getElementById('zodiac-sign').innerText = data.signName;
  if (document.getElementById('zodiac-symbol')) document.getElementById('zodiac-symbol').innerText = data.zodiacSymbol;

  renderMoonGraphic(data.illuminationFraction, data.cycleProgress);
}

document.addEventListener('DOMContentLoaded', () => {
  updateLunarData();

  // Re-calculate every 15 minutes to handle continuous background updates
  setInterval(updateLunarData, 15 * 60 * 1000);

  // Re-calculate instantly when waking device or clicking the window
  window.addEventListener('focus', updateLunarData);
});