import os

svg_content_chair = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" fill="none">
  <defs>
    <linearGradient id="frBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6"/>
      <stop offset="50%" stop-color="#1D4ED8"/>
      <stop offset="100%" stop-color="#0D1B2A"/>
    </linearGradient>
    <linearGradient id="frTeal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2DD4BF"/>
      <stop offset="100%" stop-color="#0D9488"/>
    </linearGradient>
    <filter id="frGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.25"/>
    </filter>
  </defs>
  <!-- Squircle Base -->
  <rect width="40" height="40" rx="10" fill="url(#frBg)"/>
  <!-- Subtle Border / Bevel -->
  <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="9.25" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.22"/>
  <!-- Top Highlight Arc -->
  <path d="M2.5 11C2.5 6.3 6.3 2.5 11 2.5H29C33.7 2.5 37.5 6.3 37.5 11V13C28 10.5 12 11.5 2.5 15V11Z" fill="#FFFFFF" fill-opacity="0.16"/>
  <!-- Modern Designer Lounge Chair Graphic -->
  <g filter="url(#frGlow)">
    <!-- Backrest / Shell -->
    <path d="M13 11.5C13 9.8 14.5 8.5 16.5 8.5H23.5C25.5 8.5 27 9.8 27 11.5V18.5C27 19.5 26.2 20.2 25 20.5H15C13.8 20.2 13 19.5 13 18.5V11.5Z" fill="#FFFFFF"/>
    <!-- Deep Seat Cushion with subtle curve -->
    <path d="M10 19C10 17.6 11.2 16.8 13 16.8H27C28.8 16.8 30 17.6 30 19V21.5C30 23 28.8 24 27 24H13C11.2 24 10 23 10 21.5V19Z" fill="#FFFFFF"/>
    <!-- Angled Mid-Century Modern Legs -->
    <path d="M13.5 24L11 31" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M26.5 24L29 31" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M17.5 24L18.5 28.5" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-opacity="0.6"/>
    <path d="M22.5 24L21.5 28.5" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-opacity="0.6"/>
    <!-- Vibrant Teal Rental Accent / Cushion Dot -->
    <circle cx="28.5" cy="11.5" r="3.5" fill="url(#frTeal)" stroke="#FFFFFF" stroke-width="1.2"/>
  </g>
</svg>
'''

os.makedirs('scratch', exist_ok=True)
with open('scratch/logo_chair.svg', 'w') as f:
    f.write(svg_content_chair)

print("Saved scratch/logo_chair.svg")
