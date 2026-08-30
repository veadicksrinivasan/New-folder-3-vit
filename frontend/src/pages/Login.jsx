import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, ArrowRight, Shield, Code2, RefreshCw, ShieldCheck, MapPin, User } from "lucide-react";
import { injectLoginStyles } from "./LoginStyles";
import { LoginIllustration } from "./LoginIllustration";
import { TopNav, TestimonialBubble, FooterBar, ErrorBanner } from "./LoginComponents";

export const Login = () => {
  const [username, setUsername]     = useState("");
  const [password, setPassword]     = useState("");
  const [role, setRole]             = useState("developer");
  const [captchaInput, setCaptcha]  = useState("");
  const [captchaCode, setCode]      = useState("");
  const [captchaErr, setCaptchaErr] = useState(false);
  const [loginErr, setLoginErr]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [showPass, setShowPass]     = useState(false);
  const [mounted, setMounted]       = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shakeKey, setShakeKey]     = useState(0);
  const captchaRef = useRef(null);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const genCaptcha = () => { setCode(Math.floor(1000 + Math.random()*9000).toString()); setCaptcha(""); setCaptchaErr(false); };
  useEffect(() => { injectLoginStyles(); genCaptcha(); setTimeout(()=>setMounted(true),60); }, []);
  useEffect(() => { if (user) navigate("/",{replace:true}); }, [user,navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoginErr("");
    if (captchaInput.trim() !== captchaCode) { setCaptchaErr(true); setShakeKey(k=>k+1); genCaptcha(); setTimeout(()=>captchaRef.current?.focus(),60); return; }
    setLoading(true);
    try { await login(username,password,role); navigate("/",{replace:true}); }
    catch { setLoginErr("Invalid username or password. Please try again."); genCaptcha(); }
    finally { setLoading(false); }
  };
  const clearErr = () => setLoginErr("");

  const lbl = { display:"block", fontFamily:"Inter,sans-serif", fontSize:"12px", fontWeight:"600", color:"#6B6B85", marginBottom:"6px" };
  const iconBtn = { position:"absolute", right:"14px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#B8ADF2", padding:"2px", display:"flex" };

  return (
    <div style={{ minHeight:"100vh", background:"#EDF1F7", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Inter,sans-serif", padding:"40px 20px", position:"relative", overflow:"hidden" }}>

      {/* Page background blobs */}
      <div style={{ position:"fixed", top:"-120px", left:"-100px", width:"400px", height:"400px", borderRadius:"50%", background:"rgba(140,126,240,.12)", filter:"blur(80px)", pointerEvents:"none", zIndex:0 }}/>
      <div style={{ position:"fixed", bottom:"-100px", right:"-80px", width:"360px", height:"360px", borderRadius:"50%", background:"rgba(108,93,211,.1)", filter:"blur(80px)", pointerEvents:"none", zIndex:0 }}/>
      <div style={{ position:"fixed", top:"40%", right:"15%", width:"200px", height:"200px", borderRadius:"50%", background:"rgba(240,113,75,.07)", filter:"blur(60px)", pointerEvents:"none", zIndex:0 }}/>

      {/* Outer card */}
      <div className={`sw-outer-card${mounted?" sw-fade-up":""}`} style={{ width:"100%", maxWidth:"1080px", background:"linear-gradient(155deg,#1E0C5E 0%,#2C1B6B 35%,#32208A 70%,#241458 100%)", borderRadius:"36px", boxShadow:"0 40px 80px rgba(44,27,107,.2),0 0 0 1px rgba(255,255,255,.07)", overflow:"visible", position:"relative", zIndex:1, opacity:mounted?1:0, transition:"opacity .5s ease" }}>

        <TopNav mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>

        {/* Hero body */}
        <div className="sw-hero-layout" style={{ display:"flex", minHeight:"430px", position:"relative" }}>

          {/* Illustration zone */}
          <div className="sw-illus-area" style={{ flex:"0 0 62%", position:"relative", overflow:"hidden", borderRadius:"0 0 0 36px", minHeight:"420px" }}>
            <LoginIllustration/>
            <TestimonialBubble/>
          </div>

          {/* Login card zone */}
          <div className="sw-login-panel" style={{ width:"38%", display:"flex", alignItems:"center", justifyContent:"center", padding:"28px 36px 28px 20px" }}>
            <div style={{ width:"100%", background:"#fff", borderRadius:"24px", padding:"36px 32px", boxShadow:"0 20px 40px rgba(0,0,0,.22)" }}>

              {/* Heading — Playfair Display serif */}
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontWeight:"700", fontSize:"28px", lineHeight:1.2, color:"#241458", marginBottom:"6px", letterSpacing:"-0.01em" }}>Welcome Back...</h2>
              <p style={{ fontFamily:"Inter,sans-serif", fontSize:"13px", color:"#6B6B85", fontWeight:"400", marginBottom:"22px", lineHeight:1.45 }}>Please enter your credentials to continue</p>

              {loginErr && <ErrorBanner msg={loginErr} onClose={clearErr}/>}

              <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"14px" }}>

                {/* Role toggle */}
                <div>
                  <label style={{ ...lbl, textTransform:"uppercase", letterSpacing:"0.08em", fontSize:"11px" }}>Sign in as</label>
                  <div style={{ display:"flex", gap:"8px", background:"#F5F3FF", borderRadius:"12px", padding:"4px" }}>
                    <button type="button" className={`sw-role ${role==="admin"?"on":"off"}`} onClick={()=>{setRole("admin");clearErr();}}>
                      <Shield size={13}/> Admin
                    </button>
                    <button type="button" className={`sw-role ${role==="developer"?"on":"off"}`} onClick={()=>{setRole("developer");clearErr();}}>
                      <Code2 size={13}/> Developer
                    </button>
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label htmlFor="nx-user" style={lbl}>Username</label>
                  <div style={{ position:"relative" }}>
                    <input id="nx-user" className="sw-input" type="text" placeholder="Enter your username" value={username} onChange={e=>{setUsername(e.target.value);clearErr();}} autoComplete="username" required/>
                    <User size={16} color="#B8ADF2" style={{ position:"absolute", right:"16px", top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="nx-pass" style={lbl}>Password</label>
                  <div style={{ position:"relative" }}>
                    <input id="nx-pass" className="sw-input" type={showPass?"text":"password"} placeholder="Enter your password" value={password} onChange={e=>{setPassword(e.target.value);clearErr();}} autoComplete="current-password" required/>
                    <button type="button" aria-label={showPass?"Hide password":"Show password"} onClick={()=>setShowPass(v=>!v)} style={iconBtn}>
                      {showPass?<EyeOff size={16}/>:<Eye size={16}/>}
                    </button>
                  </div>
                </div>

                {/* CAPTCHA */}
                <div>
                  <label style={{ ...lbl, color:captchaErr?"#ef4444":"#6B6B85" }}>{captchaErr?"Wrong code — use new one below":"Security Verification"}</label>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", height:"48px", padding:"0 14px", borderRadius:"12px", marginBottom:"8px", background:captchaErr?"#fff8f8":"#F5F3FF", border:`1.5px solid ${captchaErr?"rgba(239,68,68,.38)":"#E4E1F5"}`, transition:"all .25s" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                      <ShieldCheck size={16} color={captchaErr?"#ef4444":"#6C5DD3"}/>
                      <span style={{ fontFamily:"'Courier New',monospace", fontSize:"20px", fontWeight:"900", letterSpacing:"0.5em", color:captchaErr?"#ef4444":"#241458", userSelect:"none" }}>{captchaCode}</span>
                    </div>
                    <button type="button" className="sw-refresh" onClick={genCaptcha} aria-label="Get new CAPTCHA code"><RefreshCw size={11}/> New</button>
                  </div>
                  <div key={shakeKey} className={captchaErr?"sw-shake":""}>
                    <input ref={captchaRef} className={`sw-input${captchaErr?" err":""}`} style={{ paddingLeft:"18px", paddingRight:"18px" }} type="text" aria-label="CAPTCHA code" placeholder={captchaErr?"✗ Wrong — enter new code":"Enter 4-digit code"} value={captchaInput} onChange={e=>{setCaptcha(e.target.value);if(captchaErr)setCaptchaErr(false);}} maxLength={4} required/>
                  </div>
                </div>

                {/* Terms */}
                <p style={{ fontFamily:"Inter,sans-serif", fontSize:"11.5px", color:"#6B6B85", lineHeight:1.5 }}>
                  By logging in you agree to our <span style={{ color:"#6C5DD3", fontWeight:"600", cursor:"pointer", textDecoration:"underline" }}>Terms &amp; Conditions</span>
                </p>

                {/* CTA + Forgot */}
                <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
                  <button type="submit" className="sw-btn-cta" disabled={loading}>
                    <span>{loading?"Signing in…":"login..."}</span>
                    {!loading&&<ArrowRight size={16}/>}
                  </button>
                  <button type="button" style={{ display:"flex", alignItems:"center", gap:"5px", background:"none", border:"none", cursor:"pointer", color:"#6C5DD3", fontSize:"12px", fontWeight:"600", fontFamily:"Inter,sans-serif", whiteSpace:"nowrap", flexShrink:0 }}>
                    <MapPin size={13}/> Forget Password
                  </button>
                </div>
              </form>

              <p style={{ fontFamily:"Inter,sans-serif", fontSize:"12.5px", color:"#6B6B85", textAlign:"center", marginTop:"18px" }}>
                Don't have an account yet? <span style={{ color:"#6C5DD3", fontWeight:"700", cursor:"pointer" }}>Create Account</span>
              </p>
            </div>
          </div>
        </div>

        <FooterBar/>
      </div>
    </div>
  );
};
