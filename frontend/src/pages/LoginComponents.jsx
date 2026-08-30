import React from "react";
import { Moon, Menu, X, Twitter, Instagram, User, AlertCircle, XCircle } from "lucide-react";

export const TopNav = ({ mobileOpen, setMobileOpen }) => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 40px", height:"64px", borderBottom:"1px solid rgba(255,255,255,.1)", position:"relative", zIndex:20 }}>
    <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
      <div style={{ width:34, height:34, borderRadius:"9px", background:"linear-gradient(135deg,#5A4EC7,#8C7EF0)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 3px 12px rgba(90,78,199,.6)" }}>
        <span style={{ color:"#fff", fontWeight:"900", fontSize:"1.05rem", fontFamily:"Inter,sans-serif" }}>N</span>
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
      style={{ display:"none", background:"none", border:"none", color:"#fff", cursor:"pointer", padding:"4px" }}>
      {mobileOpen ? <X size={22}/> : <Menu size={22}/>}
    </button>
  </div>
);

export const TestimonialBubble = () => (
  <div className="sw-slide-up" style={{ position:"absolute", bottom:"-24px", left:"36px", display:"flex", alignItems:"center", gap:"12px", background:"#fff", borderRadius:"16px", padding:"12px 20px", boxShadow:"0 10px 32px rgba(44,27,107,.22)", zIndex:10, minWidth:"290px", border:"1px solid rgba(108,93,211,.1)" }}>
    <div style={{ position:"relative", flexShrink:0 }}>
      <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#5A4EC7,#F0714B)", display:"flex", alignItems:"center", justifyContent:"center", border:"2.5px solid #fff", boxShadow:"0 2px 10px rgba(90,78,199,.4)" }}>
        <User size={21} color="#fff"/>
      </div>
      <div className="sw-pulse" style={{ position:"absolute", bottom:1, right:1, width:11, height:11, borderRadius:"50%", background:"#22C55E", border:"2.5px solid #fff" }}/>
    </div>
    <div style={{ flex:1 }}>
      <div style={{ display:"flex", alignItems:"baseline", gap:"8px", marginBottom:"3px" }}>
        <span style={{ fontFamily:"Inter,sans-serif", fontWeight:"700", fontSize:"13.5px", color:"#241458" }}>NexaCore Support</span>
        <span style={{ fontFamily:"Inter,sans-serif", fontSize:"11px", color:"#7B6B9D", fontWeight:"500" }}>Just now</span>
      </div>
      <p style={{ fontFamily:"Inter,sans-serif", fontSize:"12.5px", color:"#4A3F72", fontWeight:"500" }}>👋 Hey there. How can we help you...?</p>
    </div>
  </div>
);

export const FooterBar = () => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 40px", height:"48px", borderTop:"1px solid rgba(255,255,255,.1)", background:"rgba(0,0,0,.2)" }}>
    <div style={{ display:"flex", alignItems:"center", gap:"20px" }}>
      <button className="sw-nav-link" aria-label="Twitter" style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:"12.5px" }}><Twitter size={13}/> Twitter</button>
      <span style={{ color:"rgba(255,255,255,.3)", fontSize:"12px" }}>—</span>
      <button className="sw-nav-link" aria-label="Instagram" style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:"12.5px" }}><Instagram size={13}/> Instagram</button>
    </div>
    <div style={{ display:"flex", alignItems:"center", gap:"18px" }}>
      <span style={{ color:"rgba(255,255,255,.65)", fontSize:"11.5px", fontFamily:"Inter,sans-serif", fontWeight:"500" }}>©2026 All Rights Reserved NexaCore.</span>
      <button className="sw-nav-link" style={{ fontSize:"11.5px" }}>Privacy</button>
      <span style={{ color:"rgba(255,255,255,.25)" }}>·</span>
      <button className="sw-nav-link" style={{ fontSize:"11.5px" }}>Terms of Service</button>
    </div>
  </div>
);

export const ErrorBanner = ({ msg, onClose }) => (
  <div className="sw-fade-down" style={{ display:"flex", alignItems:"flex-start", gap:"9px", padding:"11px 13px", borderRadius:"11px", marginBottom:"14px", background:"rgba(239,68,68,.08)", border:"2px solid rgba(239,68,68,.28)", borderLeft:"4px solid #ef4444" }}>
    <AlertCircle size={15} color="#ef4444" style={{ flexShrink:0, marginTop:"1px" }}/>
    <span style={{ fontFamily:"Inter,sans-serif", fontSize:"13px", color:"#b91c1c", fontWeight:"600", flex:1, lineHeight:1.5 }}>{msg}</span>
    <button onClick={onClose} aria-label="Dismiss error" style={{ background:"none", border:"none", cursor:"pointer", color:"#ef4444", padding:0, flexShrink:0 }}><XCircle size={15}/></button>
  </div>
);
