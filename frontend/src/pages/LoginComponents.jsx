import React from "react";
import { Moon, Menu, X, Twitter, Instagram, User, AlertCircle, XCircle } from "lucide-react";

/* ── Top Navigation ── */
export const TopNav = ({ mobileOpen, setMobileOpen }) => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 40px", height:"64px", borderBottom:"1px solid rgba(255,255,255,.07)", position:"relative", zIndex:20 }}>
    <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
      <div style={{ width:32, height:32, borderRadius:"8px", background:"linear-gradient(135deg,#6C5DD3,#8C7EF0)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 3px 10px rgba(108,93,211,.5)" }}>
        <span style={{ color:"#fff", fontWeight:"900", fontSize:"1rem", fontFamily:"Inter,sans-serif" }}>N</span>
      </div>
      <span style={{ color:"#fff", fontWeight:"700", fontSize:"16px", fontFamily:"Inter,sans-serif", letterSpacing:"-0.01em" }}>NexaCore</span>
    </div>
    <div className="sw-nav-links" style={{ display:"flex", alignItems:"center", gap:"32px" }}>
      <button className="sw-nav-link">Marketplace</button>
      <button className="sw-nav-link">Projects</button>
      <button className="sw-nav-link">Portal</button>
      <button className="sw-nav-link" style={{ display:"flex", alignItems:"center", gap:"6px" }}><Moon size={14}/> Light Mode</button>
    </div>
    <div className="sw-nav-links" style={{ display:"flex", alignItems:"center", gap:"10px" }}>
      <button className="sw-btn-outline">Log In</button>
      <button className="sw-btn-filled">Sign Up</button>
    </div>
    <button className="sw-hamburger" aria-label={mobileOpen?"Close menu":"Open menu"}
      onClick={()=>setMobileOpen(o=>!o)}
      style={{ display:"none", background:"none", border:"none", color:"rgba(255,255,255,.8)", cursor:"pointer", padding:"4px" }}>
      {mobileOpen ? <X size={22}/> : <Menu size={22}/>}
    </button>
  </div>
);

/* ── Testimonial Bubble ── */
export const TestimonialBubble = () => (
  <div className="sw-slide-up" style={{ position:"absolute", bottom:"-22px", left:"36px", display:"flex", alignItems:"center", gap:"12px", background:"#fff", borderRadius:"14px", padding:"10px 18px", boxShadow:"0 8px 28px rgba(44,27,107,.18)", zIndex:10, minWidth:"280px" }}>
    <div style={{ position:"relative", flexShrink:0 }}>
      <div style={{ width:42, height:42, borderRadius:"50%", background:"linear-gradient(135deg,#6C5DD3,#F0714B)", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #fff", boxShadow:"0 2px 8px rgba(108,93,211,.35)" }}>
        <User size={20} color="#fff"/>
      </div>
      <div className="sw-pulse" style={{ position:"absolute", bottom:1, right:1, width:10, height:10, borderRadius:"50%", background:"#22C55E", border:"2px solid #fff" }}/>
    </div>
    <div style={{ flex:1 }}>
      <div style={{ display:"flex", alignItems:"baseline", gap:"8px", marginBottom:"2px" }}>
        <span style={{ fontFamily:"Inter,sans-serif", fontWeight:"700", fontSize:"13px", color:"#241458" }}>NexaCore Support</span>
        <span style={{ fontFamily:"Inter,sans-serif", fontSize:"11px", color:"#A9A9BC" }}>Just now</span>
      </div>
      <p style={{ fontFamily:"Inter,sans-serif", fontSize:"12px", color:"#6B6B85" }}>👋 Hey there. How can we help you...?</p>
    </div>
  </div>
);

/* ── Footer Bar ── */
export const FooterBar = () => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 40px", height:"48px", borderTop:"1px solid rgba(255,255,255,.07)", background:"rgba(0,0,0,.15)" }}>
    <div style={{ display:"flex", alignItems:"center", gap:"20px" }}>
      <button className="sw-nav-link" aria-label="Twitter" style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:"12px" }}><Twitter size={13}/> Twitter</button>
      <span style={{ color:"rgba(255,255,255,.2)", fontSize:"12px" }}>—</span>
      <button className="sw-nav-link" aria-label="Instagram" style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:"12px" }}><Instagram size={13}/> Instagram</button>
    </div>
    <div style={{ display:"flex", alignItems:"center", gap:"18px" }}>
      <span style={{ color:"#6B6B85", fontSize:"11px", fontFamily:"Inter,sans-serif" }}>©2026 All Rights Reserved NexaCore.</span>
      <button className="sw-nav-link" style={{ fontSize:"11px" }}>Privacy</button>
      <span style={{ color:"rgba(255,255,255,.2)" }}>·</span>
      <button className="sw-nav-link" style={{ fontSize:"11px" }}>Terms of Service</button>
    </div>
  </div>
);

/* ── Error Banner ── */
export const ErrorBanner = ({ msg, onClose }) => (
  <div className="sw-fade-down" style={{ display:"flex", alignItems:"flex-start", gap:"8px", padding:"10px 12px", borderRadius:"10px", marginBottom:"14px", background:"rgba(239,68,68,.07)", border:"1.5px solid rgba(239,68,68,.22)", borderLeft:"3px solid #ef4444" }}>
    <AlertCircle size={14} color="#ef4444" style={{ flexShrink:0, marginTop:"1px" }}/>
    <span style={{ fontFamily:"Inter,sans-serif", fontSize:"12.5px", color:"#dc2626", fontWeight:"600", flex:1, lineHeight:1.5 }}>{msg}</span>
    <button onClick={onClose} aria-label="Dismiss error" style={{ background:"none", border:"none", cursor:"pointer", color:"#fca5a5", padding:0, flexShrink:0 }}><XCircle size={14}/></button>
  </div>
);
