export const injectLoginStyles = () => {
  if (document.getElementById("sw-styles")) return;
  const el = document.createElement("style");
  el.id = "sw-styles";
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes swShake { 0%,100%{transform:translateX(0)} 15%{transform:translateX(-7px)} 30%{transform:translateX(7px)} 50%{transform:translateX(-4px)} 70%{transform:translateX(4px)} 90%{transform:translateX(-2px)} }
    @keyframes swFadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
    @keytml swFadeDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes swCloudL { 0%,100%{transform:translateX(0)} 50%{transform:translateX(14px)} }
    @keyframes swCloudR { 0%,100%{transform:translateX(0)} 50%{transform:translateX(-12px)} }
    @keyframes swFloat  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes swFloat2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
    @keyframes swPulse  { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.6)} 50%{box-shadow:0 0 0 7px rgba(34,197,94,0)} }
    @keyframes swSlideUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
    @keyframes swFadeDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

    .sw-shake     { animation: swShake   0.42s ease; }
    .sw-fade-up   { animation: swFadeUp  0.6s  cubic-bezier(.22,1,.36,1) both; }
    .sw-fade-down { animation: swFadeDown 0.28s ease both; }
    .sw-cloud-l   { animation: swCloudL 10s ease-in-out infinite; }
    .sw-cloud-r   { animation: swCloudR 13s ease-in-out infinite; }
    .sw-float     { animation: swFloat  3.8s ease-in-out infinite; }
    .sw-float2    { animation: swFloat2 5s   ease-in-out infinite; }
    .sw-float3    { animation: swFloat  4.5s ease-in-out infinite 0.8s; }
    .sw-float4    { animation: swFloat2 3.2s ease-in-out infinite 0.4s; }
    .sw-pulse     { animation: swPulse  2s   infinite; }
    .sw-slide-up  { animation: swSlideUp 0.45s cubic-bezier(.22,1,.36,1) both; }

    /* ── Inputs ── */
    .sw-input {
      width:100%; height:52px; padding:0 48px 0 18px;
      border-radius:12px; border:2px solid #C9C4E8;
      background:#F5F3FF;
      font-family:'Inter',sans-serif; font-size:14px; color:#1E1250;
      outline:none; transition:border-color .2s, box-shadow .2s, background .2s;
    }
    .sw-input::placeholder { color:#9590B4; }
    .sw-input:focus {
      border-color:#6C5DD3; background:#fff;
      box-shadow:0 0 0 4px rgba(108,93,211,.18);
    }
    .sw-input.err {
      border-color:#ef4444; background:#fff5f5;
      box-shadow:0 0 0 4px rgba(239,68,68,.12);
    }

    /* ── CTA Button ── */
    .sw-btn-cta {
      width:100%; height:50px; border-radius:25px; border:none;
      background:linear-gradient(135deg,#5A4EC7 0%,#7B6EE8 50%,#8C7EF0 100%);
      color:#fff; font-family:'Inter',sans-serif; font-size:15px;
      font-weight:700; letter-spacing:0.3px; cursor:pointer;
      display:flex; align-items:center; justify-content:center; gap:8px;
      box-shadow:0 10px 22px rgba(90,78,199,.45);
      transition:transform .2s, box-shadow .2s, opacity .2s;
    }
    .sw-btn-cta:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 14px 28px rgba(90,78,199,.55); }
    .sw-btn-cta:active:not(:disabled) { transform:translateY(0); }
    .sw-btn-cta:disabled { opacity:.5; cursor:not-allowed; }

    /* ── Nav buttons ── */
    .sw-btn-outline {
      padding:8px 22px; border-radius:20px;
      border:2px solid rgba(255,255,255,.6); background:transparent;
      color:#fff; font-family:'Inter',sans-serif;
      font-size:13.5px; font-weight:600; cursor:pointer; transition:all .18s;
    }
    .sw-btn-outline:hover { border-color:#fff; background:rgba(255,255,255,.12); }

    .sw-btn-filled {
      padding:8px 22px; border-radius:20px; border:none;
      background:linear-gradient(135deg,#5A4EC7,#8C7EF0);
      color:#fff; font-family:'Inter',sans-serif;
      font-size:13.5px; font-weight:700; cursor:pointer;
      box-shadow:0 4px 14px rgba(90,78,199,.5); transition:all .18s;
    }
    .sw-btn-filled:hover { transform:translateY(-1px); box-shadow:0 8px 20px rgba(90,78,199,.6); }

    /* ── Role toggle ── */
    .sw-role {
      flex:1; height:38px; border-radius:9px;
      display:flex; align-items:center; justify-content:center; gap:6px;
      font-family:'Inter',sans-serif; font-size:13px; font-weight:700;
      cursor:pointer; transition:all .18s;
    }
    .sw-role.on  { background:linear-gradient(135deg,#5A4EC7,#8C7EF0); border:none; color:#fff; box-shadow:0 3px 12px rgba(90,78,199,.45); }
    .sw-role.off { background:transparent; border:2px solid #C9C4E8; color:#6B6B85; }
    .sw-role.off:hover { border-color:#6C5DD3; color:#5A4EC7; background:#EDE9FF; }

    /* ── Refresh btn ── */
    .sw-refresh {
      display:flex; align-items:center; gap:4px;
      padding:6px 12px; border-radius:8px;
      border:2px solid #C9C4E8; background:#EDE9FF;
      color:#5A4EC7; font-size:12px; font-weight:700;
      font-family:'Inter',sans-serif; cursor:pointer; transition:all .18s;
    }
    .sw-refresh:hover { border-color:#5A4EC7; background:#DDD6FE; }

    /* ── Nav link ── */
    .sw-nav-link {
      font-family:'Inter',sans-serif; font-size:14px; font-weight:500;
      color:rgba(255,255,255,.92); background:none; border:none;
      cursor:pointer; transition:color .18s;
    }
    .sw-nav-link:hover { color:#fff; text-decoration:underline; }

    /* ── Focus ring for accessibility ── */
    *:focus-visible { outline:3px solid #6C5DD3; outline-offset:2px; border-radius:4px; }

    /* ── Responsive ── */
    @media (max-width:1024px) {
      .sw-hero-layout { flex-direction:column !important; }
      .sw-login-panel { width:100% !important; max-width:500px !important; margin:0 auto !important; padding:1.5rem !important; }
      .sw-illus-area  { min-height:260px !important; }
    }
    @media (max-width:768px) {
      .sw-nav-links  { display:none !important; }
      .sw-hamburger  { display:flex !important; }
      .sw-outer-card { border-radius:20px !important; }
      .sw-login-panel { padding:1rem !important; }
    }
  `;
  document.head.appendChild(el);
};
