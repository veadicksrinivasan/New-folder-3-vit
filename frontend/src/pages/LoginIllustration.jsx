import React from "react";

export const LoginIllustration = () => (
  <svg viewBox="0 0 640 320" xmlns="http://www.w3.org/2000/svg"
    style={{ width:"100%", height:"100%", position:"absolute", inset:0, display:"block" }}
    role="img" aria-label="Wind turbines and solar panels renewable energy scene">
    <defs>
      <linearGradient id="groundG" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#3D2A8A" stopOpacity="0.7"/>
        <stop offset="100%" stopColor="#2C1B6B" stopOpacity="0.1"/>
      </linearGradient>
      <radialGradient id="moonG" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#5B3FA0" stopOpacity="0.85"/>
        <stop offset="100%" stopColor="#3B2570" stopOpacity="0.2"/>
      </radialGradient>
      <radialGradient id="glowG" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#7C5DD3" stopOpacity="0.3"/>
        <stop offset="100%" stopColor="#2C1B6B" stopOpacity="0"/>
      </radialGradient>
    </defs>

    {/* Background ambient glow */}
    <ellipse cx="200" cy="200" rx="280" ry="200" fill="url(#glowG)"/>

    {/* Clouds L */}
    <g className="sw-cloud-l">
      <ellipse cx="72" cy="48" rx="46" ry="17" fill="#C4B8F8" fillOpacity=".42"/>
      <ellipse cx="104" cy="40" rx="31" ry="14" fill="#C4B8F8" fillOpacity=".35"/>
      <ellipse cx="50" cy="57" rx="25" ry="12" fill="#C4B8F8" fillOpacity=".28"/>
    </g>
    {/* Clouds R */}
    <g className="sw-cloud-r">
      <ellipse cx="490" cy="42" rx="43" ry="16" fill="#C4B8F8" fillOpacity=".35"/>
      <ellipse cx="522" cy="34" rx="28" ry="12" fill="#C4B8F8" fillOpacity=".28"/>
    </g>
    <g className="sw-cloud-r" style={{animationDelay:"2.5s"}}>
      <ellipse cx="568" cy="70" rx="35" ry="15" fill="#C4B8F8" fillOpacity=".3"/>
      <ellipse cx="594" cy="63" rx="21" ry="11" fill="#C4B8F8" fillOpacity=".22"/>
    </g>

    {/* Moon circle — brighter */}
    <circle cx="292" cy="148" r="102" fill="url(#moonG)"/>
    <circle cx="292" cy="148" r="102" fill="none" stroke="#7B6AE0" strokeWidth="1.5" strokeOpacity=".25"/>

    {/* Ground */}
    <rect x="0" y="280" width="640" height="5" rx="2.5" fill="#9D8FE8" fillOpacity=".5"/>
    <rect x="0" y="284" width="640" height="36" fill="url(#groundG)"/>
    <line x1="30" y1="281" x2="610" y2="281" stroke="#B8ADF2" strokeWidth="1" strokeOpacity=".3"/>

    {/* ═══ TURBINE 1 – small left ═══ */}
    <rect x="83" y="188" width="5.5" height="93" rx="2.75" fill="#9D8FE8" fillOpacity=".85"/>
    <circle cx="85.75" cy="186" r="7" fill="#DDD6FE"/>
    <g><animateTransform attributeName="transform" type="rotate" from="0 85.75 186" to="360 85.75 186" dur="5.5s" repeatCount="indefinite"/>
      <line x1="85.75" y1="186" x2="85.75" y2="124" stroke="#DDD6FE" strokeWidth="6" strokeLinecap="round"/>
      <line x1="85.75" y1="186" x2="139" y2="217" stroke="#DDD6FE" strokeWidth="6" strokeLinecap="round"/>
      <line x1="85.75" y1="186" x2="32.5" y2="217" stroke="#DDD6FE" strokeWidth="6" strokeLinecap="round"/>
    </g>

    {/* ═══ TURBINE 2 – medium ═══ */}
    <rect x="183" y="152" width="7" height="129" rx="3.5" fill="#9D8FE8" fillOpacity=".88"/>
    <circle cx="186.5" cy="149" r="9" fill="#DDD6FE"/>
    <g><animateTransform attributeName="transform" type="rotate" from="0 186.5 149" to="360 186.5 149" dur="4.2s" repeatCount="indefinite"/>
      <line x1="186.5" y1="149" x2="186.5" y2="70" stroke="#EDE9FF" strokeWidth="7.5" strokeLinecap="round"/>
      <line x1="186.5" y1="149" x2="253" y2="187" stroke="#EDE9FF" strokeWidth="7.5" strokeLinecap="round"/>
      <line x1="186.5" y1="149" x2="120" y2="187" stroke="#EDE9FF" strokeWidth="7.5" strokeLinecap="round"/>
    </g>

    {/* ═══ TURBINE 3 – large center ═══ */}
    <rect x="289" y="104" width="9" height="177" rx="4.5" fill="#9D8FE8" fillOpacity=".9"/>
    <circle cx="293.5" cy="101" r="12" fill="#EDE9FF"/>
    <g><animateTransform attributeName="transform" type="rotate" from="0 293.5 101" to="360 293.5 101" dur="3.2s" repeatCount="indefinite"/>
      <line x1="293.5" y1="101" x2="293.5" y2="4" stroke="#F5F3FF" strokeWidth="10" strokeLinecap="round"/>
      <line x1="293.5" y1="101" x2="381" y2="150" stroke="#F5F3FF" strokeWidth="10" strokeLinecap="round"/>
      <line x1="293.5" y1="101" x2="206" y2="150" stroke="#F5F3FF" strokeWidth="10" strokeLinecap="round"/>
    </g>

    {/* Ladder */}
    <rect x="264" y="170" width="4" height="112" rx="2" fill="#9D8FE8" fillOpacity=".55"/>
    <rect x="278" y="170" width="4" height="112" rx="2" fill="#9D8FE8" fillOpacity=".55"/>
    {[0,1,2,3,4,5].map(i=><rect key={i} x="264" y={179+i*18} width="18" height="3" rx="1.5" fill="#9D8FE8" fillOpacity=".45"/>)}

    {/* ═══ SOLAR PANEL A – large ═══ */}
    <g transform="translate(412,172) rotate(-20)">
      <rect x="0" y="0" width="112" height="76" rx="5" fill="#150A48" stroke="#8A7CE0" strokeWidth="2"/>
      <line x1="0" y1="25.3" x2="112" y2="25.3" stroke="#7C5DD3" strokeOpacity=".6" strokeWidth="1.2"/>
      <line x1="0" y1="50.6" x2="112" y2="50.6" stroke="#7C5DD3" strokeOpacity=".6" strokeWidth="1.2"/>
      {[22.4,44.8,67.2,89.6].map((x,i)=><line key={i} x1={x} y1="0" x2={x} y2="76" stroke="#7C5DD3" strokeOpacity=".5" strokeWidth="1.2"/>)}
      {[0,1,2].map(r=>[0,1,2,3,4].map(c=><rect key={`${r}-${c}`} x={c*22.4+2} y={r*25.3+2} width="19.4" height="21.3" rx="2" fill="#6C5DD3" fillOpacity=".5"/>))}
      <line x1="56" y1="76" x2="56" y2="112" stroke="#9D8FE8" strokeWidth="4.5" strokeLinecap="round"/>
      <line x1="36" y1="110" x2="76" y2="110" stroke="#9D8FE8" strokeWidth="3.5" strokeLinecap="round"/>
    </g>
    {/* ═══ SOLAR PANEL B – medium ═══ */}
    <g transform="translate(508,185) rotate(-11)">
      <rect x="0" y="0" width="86" height="58" rx="4" fill="#150A48" stroke="#8A7CE0" strokeWidth="1.8"/>
      <line x1="0" y1="29" x2="86" y2="29" stroke="#7C5DD3" strokeOpacity=".55" strokeWidth="1.2"/>
      {[21.5,43,64.5].map((x,i)=><line key={i} x1={x} y1="0" x2={x} y2="58" stroke="#7C5DD3" strokeOpacity=".5" strokeWidth="1.2"/>)}
      {[0,1].map(r=>[0,1,2,3].map(c=><rect key={`${r}-${c}`} x={c*21.5+2} y={r*29+2} width="18" height="24" rx="2" fill="#6C5DD3" fillOpacity=".45"/>))}
      <line x1="43" y1="58" x2="43" y2="84" stroke="#9D8FE8" strokeWidth="4" strokeLinecap="round"/>
      <line x1="27" y1="82" x2="59" y2="82" stroke="#9D8FE8" strokeWidth="3" strokeLinecap="round"/>
    </g>

    {/* ═══ PERSON 1 – blue, left ═══ */}
    <g className="sw-float">
      <circle cx="135" cy="233" r="10" fill="#FBBF24"/>
      <ellipse cx="135" cy="226" rx="10" ry="6" fill="#78350F"/>
      <rect x="126" y="243" width="18" height="28" rx="5" fill="#3B82F6"/>
      <line x1="126" y1="250" x2="112" y2="264" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round"/>
      <line x1="144" y1="250" x2="158" y2="260" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round"/>
      <rect x="127" y="269" width="6.5" height="17" rx="3.25" fill="#1D4ED8"/>
      <rect x="137" y="269" width="6.5" height="17" rx="3.25" fill="#1D4ED8"/>
      <rect x="157" y="253" width="18" height="13" rx="2.5" fill="rgba(255,255,255,.28)" stroke="rgba(255,255,255,.55)" strokeWidth="1.2"/>
      <line x1="159" y1="257" x2="173" y2="257" stroke="rgba(255,255,255,.65)" strokeWidth="1.2"/>
      <line x1="159" y1="261" x2="171" y2="261" stroke="rgba(255,255,255,.65)" strokeWidth="1.2"/>
      <ellipse cx="135" cy="286" rx="15" ry="4" fill="rgba(0,0,0,.22)"/>
    </g>

    {/* ═══ PERSON 2 – on ladder ═══ */}
    <g className="sw-float2" style={{animationDelay:"0.5s"}}>
      <circle cx="254" cy="199" r="9.5" fill="#FBBF24"/>
      <ellipse cx="254" cy="192" rx="9.5" ry="6" fill="#78350F"/>
      <rect x="246" y="208" width="16" height="25" rx="4" fill="#3B82F6"/>
      <line x1="246" y1="215" x2="234" y2="226" stroke="#3B82F6" strokeWidth="5.5" strokeLinecap="round"/>
      <line x1="262" y1="215" x2="272" y2="222" stroke="#3B82F6" strokeWidth="5.5" strokeLinecap="round"/>
      <rect x="247" y="231" width="6" height="16" rx="3" fill="#1D4ED8"/>
      <rect x="256" y="231" width="6" height="16" rx="3" fill="#1D4ED8"/>
    </g>

    {/* ═══ PERSON 3 – orange, center ═══ */}
    <g className="sw-float3">
      <circle cx="373" cy="234" r="10" fill="#FBBF24"/>
      <ellipse cx="373" cy="227" rx="10" ry="6" fill="#78350F"/>
      <rect x="364" y="244" width="18" height="28" rx="5" fill="#EF6030"/>
      <line x1="364" y1="251" x2="350" y2="265" stroke="#EF6030" strokeWidth="6" strokeLinecap="round"/>
      <line x1="382" y1="251" x2="394" y2="262" stroke="#EF6030" strokeWidth="6" strokeLinecap="round"/>
      <rect x="365" y="270" width="6.5" height="17" rx="3.25" fill="#B91C1C"/>
      <rect x="375" y="270" width="6.5" height="17" rx="3.25" fill="#B91C1C"/>
      <ellipse cx="373" cy="286" rx="15" ry="4" fill="rgba(0,0,0,.22)"/>
    </g>

    {/* ═══ PERSON 4 – orange, far right ═══ */}
    <g className="sw-float4">
      <circle cx="600" cy="237" r="10" fill="#FBBF24"/>
      <ellipse cx="600" cy="230" rx="10" ry="6" fill="#78350F"/>
      <rect x="591" y="247" width="18" height="28" rx="5" fill="#EF6030"/>
      <line x1="591" y1="254" x2="578" y2="265" stroke="#EF6030" strokeWidth="6" strokeLinecap="round"/>
      <line x1="609" y1="254" x2="618" y2="257" stroke="#EF6030" strokeWidth="6" strokeLinecap="round"/>
      <rect x="592" y="273" width="6.5" height="15" rx="3.25" fill="#B91C1C"/>
      <rect x="602" y="273" width="6.5" height="15" rx="3.25" fill="#B91C1C"/>
      <ellipse cx="600" cy="286" rx="15" ry="4" fill="rgba(0,0,0,.22)"/>
    </g>
  </svg>
);
