function getMoonData(date = new Date()) {
  const LUNAR_MONTH = 29.5305877;
  
  // Hunter's Moon Anchor: Monday, Oct 26, 2026 at 04:12 UTC (12:12 AM EDT)
  const fullMoonAnchor = new Date(Date.UTC(2026, 9, 26, 4, 12, 0));
  
  const diffDays = (date.getTime() - fullMoonAnchor.getTime()) / (1000 * 60 * 60 * 24);
  const cycleProgress = (((0.5 + (diffDays / LUNAR_MONTH)) % 1) + 1) % 1;
  const lunarAgeDays = cycleProgress * LUNAR_MONTH;

  const phaseAngle = cycleProgress * 2 * Math.PI;
  const illuminationFraction = (1 - Math.cos(phaseAngle)) / 2;
  const illuminationPercent = (illuminationFraction * 100).toFixed(1);

  let phaseName = "";
  if (cycleProgress < 0.03 || cycleProgress >= 0.97) phaseName = "NEW MOON";
  else if (cycleProgress < 0.22) phaseName = "WAXING CRESCENT";
  else if (cycleProgress < 0.28) phaseName = "FIRST QUARTER";
  else if (cycleProgress < 0.46) phaseName = "WAXING GIBBOUS";
  else if (cycleProgress <= 0.54) phaseName = "FULL MOON";
  else if (cycleProgress < 0.72) phaseName = "WANING GIBBOUS";
  else if (cycleProgress < 0.78) phaseName = "LAST QUARTER";
  else phaseName = "WANING CRESCENT";

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

  const zodiacAnchor = new Date(Date.UTC(2026, 9, 13, 23, 9, 0));
  const daysSinceAnchor = (date.getTime() - zodiacAnchor.getTime()) / (1000 * 60 * 60 * 24);
  const ZODIAC_CYCLE = 27.321661;
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

function renderMoonGraphic(illuminationFraction, cycleProgress, phaseName) {
  const container = document.getElementById('moon-graphic');
  if (!container) return;

  const assetFile = "assets/phases/moon-phases.jpg";
  const crop = { x: 1040, y: 145, w: 220, h: 220 };

  // Calculate dynamic shadow percentage
  const unlitPercent = Math.min(100, Math.max(0, (1 - illuminationFraction) * 100));
  const isWaning = cycleProgress >= 0.5;

  // Waning sweeps shadow from right to left; Waxing from left to right
  const shadowDirection = isWaning ? 'to left' : 'to right';

  container.innerHTML = `
    <!-- Breathing Ambient Aura: dims naturally toward New Moon -->
    <div class="moon-aura-glow" style="opacity: ${Math.max(0.15, illuminationFraction)};"></div>

    <div style="position: relative; width: 120px; height: 120px; margin: 0 auto; z-index: 2;">
      <!-- Base SVG: Approved Texture + Approved Filter -->
      <svg width="120" height="120" viewBox="0 0 120 120" style="overflow: visible; display: block;">
        <defs>
          <filter id="lunar-bloom" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="arcana-gold-grade" color-interpolation-filters="sRGB">
            <feColorMatrix type="matrix" values="
              -0.34 -0.34 -0.34 0 1
              -0.34 -0.34 -0.34 0 1
              -0.34 -0.34 -0.34 0 1
               0     0     0    1 0" result="lum" />
            <feColorMatrix in="lum" type="matrix" values="
              2.85  0     0     0  0.26
              2.45  0     0     0  0.18
              1.85  0     0     0  0.08
              1.5   1.5   1.5   0  0" />
          </filter>

          <clipPath id="lunar-circle-clip">
            <circle cx="60" cy="60" r="52" />
          </clipPath>
        </defs>

        <!-- Deep Base Disc -->
        <circle cx="60" cy="60" r="52" fill="rgba(19, 14, 27, 0.4)" stroke="rgba(216, 195, 151, 0.22)" stroke-width="0.8" />

        <!-- Full Moon Texture Asset -->
        <g clip-path="url(#lunar-circle-clip)" filter="url(#lunar-bloom)">
          <svg x="8" y="8" width="104" height="104" viewBox="${crop.x} ${crop.y} ${crop.w} ${crop.h}" preserveAspectRatio="xMidYMid slice">
            <image href="${assetFile}" width="1400" height="980" filter="url(#arcana-gold-grade)" />
          </svg>
        </g>

        <!-- Crisp Gold Accent Rim -->
        <circle cx="60" cy="60" r="52" fill="none" stroke="#D8C397" stroke-width="0.85" opacity="0.85" />
      </svg>

      <!-- Fail-proof HTML/CSS Dynamic Shadow Overlay -->
      ${unlitPercent > 1.5 ? `
        <div style="
          position: absolute;
          top: 8px;
          left: 8px;
          width: 104px;
          height: 104px;
          border-radius: 50%;
          background: rgba(19, 14, 27, 0.7);
          pointer-events: none;
          mask-image: linear-gradient(${shadowDirection}, #000 0%, #000 ${unlitPercent}%, transparent ${Math.min(100, unlitPercent + 14)}%);
          -webkit-mask-image: linear-gradient(${shadowDirection}, #000 0%, #000 ${unlitPercent}%, transparent ${Math.min(100, unlitPercent + 14)}%);
        "></div>
      ` : ''}
    </div>
  `;
}

function updateLunarData(forcedDate = null) {
  const now = forcedDate || new Date();
  const data = getMoonData(now);

  if (document.getElementById('phase-name')) document.getElementById('phase-name').innerText = data.phaseName;
  if (document.getElementById('illumination-value')) document.getElementById('illumination-value').innerText = data.illumination;
  if (document.getElementById('lunar-age-value')) document.getElementById('lunar-age-value').innerText = data.lunarAgeDays;
  if (document.getElementById('zodiac-sign')) document.getElementById('zodiac-sign').innerText = data.signName;
  if (document.getElementById('zodiac-symbol')) document.getElementById('zodiac-symbol').innerText = data.zodiacSymbol;

  renderMoonGraphic(data.illuminationFraction, data.cycleProgress, data.phaseName);
}

document.addEventListener('DOMContentLoaded', () => {
  // Run on startup
  updateLunarData();

  // Recalculate every 15 minutes to smoothly update percentages and transits
  setInterval(updateLunarData, 15 * 60 * 1000);

  // Instantly re-sync if the user resumes or focuses the app
  window.addEventListener('focus', updateLunarData);
});