(function() {
  // Inject React and Babel if not already present
  function loadScript(src, cb) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = cb;
    document.head.appendChild(s);
  }

  // Inject styles
  var style = document.createElement('style');
  style.innerHTML = `
    #srq-bubble {
      position: fixed; bottom: 28px; right: 28px; width: 56px; height: 56px;
      background: #111; border: 1px solid #333; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      z-index: 99999; transition: transform 0.2s;
    }
    #srq-bubble:hover { transform: scale(1.08); }
    #srq-tooltip {
      position: fixed; bottom: 94px; right: 28px; background: #fff; color: #111;
      font-size: 13px; font-weight: 500; padding: 8px 14px; border-radius: 8px;
      white-space: nowrap; box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      z-index: 99999; display: none; font-family: sans-serif;
    }
    #srq-tooltip::after {
      content: ''; position: absolute; bottom: -6px; right: 20px;
      width: 12px; height: 12px; background: #fff; transform: rotate(45deg); border-radius: 2px;
    }
    #srq-overlay {
      display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6);
      z-index: 999999; align-items: center; justify-content: center; backdrop-filter: blur(4px);
    }
    #srq-overlay.open { display: flex; }
    #srq-modal {
      background: #f9fafb; border-radius: 16px; width: 90%; max-width: 600px;
      height: 85vh; max-height: 800px; overflow-y: auto;
      box-shadow: 0 24px 80px rgba(0,0,0,0.5); display: flex; flex-direction: column;
    }
    #srq-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 20px; border-bottom: 1px solid #e5e7eb; background: #fff;
      flex-shrink: 0; position: sticky; top: 0; z-index: 10; border-radius: 16px 16px 0 0;
    }
    #srq-header span { font-size: 14px; font-weight: 600; color: #111; font-family: sans-serif; }
    #srq-close {
      width: 28px; height: 28px; background: #f3f4f6; border: none; border-radius: 50%;
      font-size: 14px; cursor: pointer; color: #6b7280;
    }
    #srq-root { flex: 1; }
  `;
  document.head.appendChild(style);

  // Inject HTML
  var html = `
    <div id="srq-tooltip">Take Survey</div>
    <div id="srq-bubble"
      onmouseenter="document.getElementById('srq-tooltip').style.display='block'"
      onmouseleave="document.getElementById('srq-tooltip').style.display='none'"
      onclick="document.getElementById('srq-overlay').classList.add('open');document.body.style.overflow='hidden'">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1"/>
        <line x1="9" y1="12" x2="15" y2="12"/>
        <line x1="9" y1="16" x2="13" y2="16"/>
      </svg>
    </div>
    <div id="srq-overlay" onclick="if(event.target===this){this.classList.remove('open');document.body.style.overflow=''}">
      <div id="srq-modal">
        <div id="srq-header">
          <span>Storage Risk Assessment</span>
          <button id="srq-close" onclick="document.getElementById('srq-overlay').classList.remove('open');document.body.style.overflow=''">&#x2715;</button>
        </div>
        <div id="srq-root"></div>
      </div>
    </div>
  `;
  var div = document.createElement('div');
  div.innerHTML = html;
  document.body.appendChild(div);

  document.addEventListener('keydown', function(e) {
    if(e.key === 'Escape') {
      document.getElementById('srq-overlay').classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Load React, then ReactDOM, then Babel, then render survey
  function initSurvey() {
    var babelScript = document.createElement('script');
    babelScript.type = 'text/babel';
    babelScript.setAttribute('data-presets', 'react');
    babelScript.innerHTML = `const { useState } = React;
    const CATEGORIES = { flash: "Flash Dependency & Architecture", vendor: "Vendor & Hardware Concentration", supply: "Procurement & Supply Chain Exposure", cloud: "Cloud Optionality", ai: "AI & Growth Trajectory" };
    const CAT_SUBTITLES = { flash: "How reliant is your environment on NVMe/flash?", vendor: "How exposed are you to a single vendor or platform?", supply: "How vulnerable is your buying cycle to market volatility?", cloud: "Can you shift workloads to cloud when hardware is scarce or expensive?", ai: "Is your data growth compounding your flash exposure?" };
    const questions = [
      { category: "Flash Dependency & Architecture", text: "What percentage of your storage environment is all-flash NVMe?", answers: [{label:"<25%",s:1},{label:"25-50%",s:2},{label:"50-75%",s:3},{label:">75%",s:4}], key: "flash" },
      { category: "Flash Dependency & Architecture", text: "Do you have a mix of disk, hybrid, and flash tiers in production?", answers: [{label:"All three",s:1},{label:"Two tiers",s:2},{label:"One + partial",s:3},{label:"All-flash only",s:4}], key: "flash" },
      { category: "Flash Dependency & Architecture", text: "Is your storage platform designed to run on mixed media (HDD + NVMe)?", answers: [{label:"Yes, natively",s:1},{label:"Partially",s:2},{label:"Via workaround",s:3},{label:"No",s:4}], key: "flash" },
      { category: "Flash Dependency & Architecture", text: "What % of your data is actively hot and truly performance-sensitive?", answers: [{label:"<10%",s:1},{label:"10-25%",s:2},{label:"25-50%",s:3},{label:">50%",s:4}], key: "flash" },
      { category: "Flash Dependency & Architecture", text: "Are performance and capacity tightly coupled in your current architecture?", answers: [{label:"Fully decoupled",s:1},{label:"Mostly",s:2},{label:"Somewhat",s:3},{label:"Tightly coupled",s:4}], key: "flash" },
      { category: "Flash Dependency & Architecture", text: "Can you add HDD capacity without also adding NVMe?", answers: [{label:"Yes, easily",s:1},{label:"With effort",s:2},{label:"Limited",s:3},{label:"No",s:4}], key: "flash" },
      { category: "Vendor & Hardware Concentration", text: "How many storage hardware vendors do you actively use?", answers: [{label:"4+",s:1},{label:"3",s:2},{label:"2",s:3},{label:"1",s:4}], key: "vendor" },
      { category: "Vendor & Hardware Concentration", text: "Are you locked into a proprietary storage platform (hardware + software bundled)?", answers: [{label:"No",s:1},{label:"Mostly open",s:2},{label:"Partially locked",s:3},{label:"Fully locked",s:4}], key: "vendor" },
      { category: "Vendor & Hardware Concentration", text: "Can your storage software run on commodity x86 from multiple OEMs?", answers: [{label:"Yes",s:1},{label:"Mostly",s:2},{label:"One OEM only",s:3},{label:"No",s:4}], key: "vendor" },
      { category: "Vendor & Hardware Concentration", text: "How dependent are you on a single drive or controller vendor for NVMe?", answers: [{label:"Multi-vendor",s:1},{label:"2 vendors",s:2},{label:"1 preferred",s:3},{label:"Single source",s:4}], key: "vendor" },
      { category: "Procurement & Supply Chain Exposure", text: "What are your current NVMe hardware lead times?", answers: [{label:"<4 weeks",s:1},{label:"4-8 weeks",s:2},{label:"8-16 weeks",s:3},{label:">16 weeks",s:4}], key: "supply" },
      { category: "Procurement & Supply Chain Exposure", text: "How much of your storage refresh budget is tied to NVMe pricing?", answers: [{label:"<20%",s:1},{label:"20-40%",s:2},{label:"40-60%",s:3},{label:">60%",s:4}], key: "supply" },
      { category: "Procurement & Supply Chain Exposure", text: "Do you have a strategic reserve or buffer inventory for flash components?", answers: [{label:"6+ months",s:1},{label:"3-6 months",s:2},{label:"1-3 months",s:3},{label:"None",s:4}], key: "supply" },
      { category: "Procurement & Supply Chain Exposure", text: "Have NVMe price increases materially impacted your IT budget in the last 12 months?", answers: [{label:"No impact",s:1},{label:"Minor",s:2},{label:"Moderate",s:3},{label:"Significant",s:4}], key: "supply" },
      { category: "Cloud Optionality", text: "Can your storage workloads run symmetrically in both on-prem and cloud environments?", answers: [{label:"Yes, fully",s:1},{label:"Mostly",s:2},{label:"Partially",s:3},{label:"No",s:4}], key: "cloud" },
      { category: "Cloud Optionality", text: "If hardware lead times doubled tomorrow, could you burst capacity to cloud?", answers: [{label:"Immediately",s:1},{label:"Within weeks",s:2},{label:"With major effort",s:3},{label:"No",s:4}], key: "cloud" },
      { category: "Cloud Optionality", text: "Does your data platform maintain a single namespace across on-prem and cloud?", answers: [{label:"Yes",s:1},{label:"Partial",s:2},{label:"Siloed",s:3},{label:"No cloud",s:4}], key: "cloud" },
      { category: "AI & Growth Trajectory", text: "Are you actively deploying AI/ML workloads that require high-performance storage?", answers: [{label:"No plans",s:1},{label:"Exploring",s:2},{label:"In progress",s:3},{label:"In production",s:4}], key: "ai" },
      { category: "AI & Growth Trajectory", text: "How fast is your unstructured data growing year-over-year?", answers: [{label:"<20%",s:1},{label:"20-40%",s:2},{label:"40-75%",s:3},{label:">75%",s:4}], key: "ai" },
      { category: "AI & Growth Trajectory", text: "Does your AI/ML infrastructure require NVMe for checkpointing, vector DBs, or inference staging?", answers: [{label:"No",s:1},{label:"Some",s:2},{label:"Mostly",s:3},{label:"All of it",s:4}], key: "ai" },
    ];
    const THRESHOLDS = [
      { lo:20, hi:34, label:"Low Risk",      emoji:"🟢", color:"#14532d", bg:"#dcfce7", border:"#16a34a", desc:"Strong architectural flexibility, multi-vendor, cloud-ready. Monitor the market but no urgent action needed.", remediate:"12+ months runway — no urgent action needed." },
      { lo:35, hi:49, label:"Moderate Risk", emoji:"🟡", color:"#713f12", bg:"#fef9c3", border:"#ca8a04", desc:"Some exposure to flash dependency or vendor concentration. Begin evaluating tiered architecture and cloud optionality.", remediate:"6-12 months — begin planning architectural changes now." },
      { lo:50, hi:62, label:"High Risk",     emoji:"🟠", color:"#7c2d12", bg:"#ffedd5", border:"#ea580c", desc:"Meaningful vulnerability to supply disruption. Prioritize architectural review, procurement strategy, and cloud bursting.", remediate:"3-6 months — prioritize remediation this quarter." },
      { lo:63, hi:80, label:"Critical Risk", emoji:"🔴", color:"#7f1d1d", bg:"#fee2e2", border:"#dc2626", desc:"Highly exposed. Flash-heavy, single-vendor, no cloud escape valve. Supply chain disruption could stall projects or trigger emergency spending.", remediate:"Act now — immediate action required." },
    ];
    const catKeys = ["flash","vendor","supply","cloud","ai"];
    function getOverallRisk(score) { return THRESHOLDS.find(t => score >= t.lo && score <= t.hi) || THRESHOLDS[THRESHOLDS.length-1]; }
    function getCatRisk(score, max) {
      const pct = score/max;
      if(pct<=0.33) return {label:"Low Risk",color:"#14532d",bg:"#dcfce7",border:"#16a34a"};
      if(pct<=0.66) return {label:"Medium Risk",color:"#713f12",bg:"#fef9c3",border:"#ca8a04"};
      return {label:"High Risk",color:"#7f1d1d",bg:"#fee2e2",border:"#dc2626"};
    }
    function getCatIndex(category) { return catKeys.findIndex(k => CATEGORIES[k] === category); }

    function ScoringHeader() {
      return (
        <div style={{background:"#fff",borderRadius:12,padding:"20px 28px",marginBottom:16,boxShadow:"0 2px 12px rgba(0,0,0,0.07)",borderLeft:"4px solid #111"}}>
          <p style={{fontSize:16,fontWeight:700,color:"#111",margin:"0 0 10px"}}>Scoring Model</p>
          <p style={{fontSize:13,color:"#374151",margin:"0 0 10px",lineHeight:1.6}}>Each question is scored <strong>1-4</strong>, where:</p>
          <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:"#374151"}}><span style={{background:"#dcfce7",color:"#14532d",borderRadius:4,padding:"1px 8px",fontWeight:600}}>1</span>Low risk / well-positioned</div>
            <div style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:"#374151"}}><span style={{background:"#fef9c3",color:"#713f12",borderRadius:4,padding:"1px 8px",fontWeight:600}}>4</span>High risk / highly exposed</div>
          </div>
          <div style={{display:"flex",gap:20,paddingTop:12,borderTop:"1px solid #f3f4f6"}}>
            {[["5","Categories"],["20","Questions"],["80","Max Score"]].map(([val,lbl])=>(
              <div key={lbl} style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:700,color:"#111"}}>{val}</div><div style={{fontSize:11,color:"#9ca3af",marginTop:2}}>{lbl}</div></div>
            ))}
          </div>
        </div>
      );
    }

    function Survey() {
      const [currentQ, setCurrentQ] = useState(0);
      const [answers, setAnswers] = useState([]);
      const [selected, setSelected] = useState(null);
      const [done, setDone] = useState(false);
      const q = questions[currentQ];
      const isLast = currentQ === questions.length - 1;
      const progress = ((currentQ+1)/questions.length)*100;
      const catIdx = getCatIndex(q.category);

      function handleNext() {
        if(selected===null) return;
        const newAnswers = [...answers, selected];
        if(isLast){setAnswers(newAnswers);setDone(true);}
        else{setAnswers(newAnswers);setCurrentQ(currentQ+1);setSelected(null);}
      }
      function handleRestart(){setCurrentQ(0);setAnswers([]);setSelected(null);setDone(false);}

      if(done){
        const totals={flash:0,vendor:0,supply:0,cloud:0,ai:0};
        answers.forEach((ai,qi)=>{totals[questions[qi].key]+=questions[qi].answers[ai].s;});
        const totalScore=Object.values(totals).reduce((a,b)=>a+b,0);
        const overall=getOverallRisk(totalScore);
        return (
          <div style={{padding:24}}>
            <ScoringHeader />
            {totalScore>50&&(
              <div style={{background:"#111",borderRadius:12,padding:24,marginBottom:16}}>
                <p style={{fontSize:13,fontWeight:700,color:"#fff",margin:"0 0 6px"}}>Let's talk about your score</p>
                <p style={{fontSize:13,color:"#d1d5db",margin:0,lineHeight:1.7}}>You scored <strong style={{color:"#fff"}}>{totalScore} out of 80</strong>. Organizations at this level often face real constraints when hardware availability shifts. Let's walk through what this looks like in your environment.</p>
              </div>
            )}
            <div style={{background:"#fff",borderRadius:12,padding:28,marginBottom:16,boxShadow:"0 2px 12px rgba(0,0,0,0.07)"}}>
              <p style={{fontSize:13,color:"#9ca3af",margin:"0 0 8px"}}>Overall Score</p>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <span style={{fontSize:32,fontWeight:700,color:"#111"}}>{totalScore} <span style={{fontSize:16,color:"#9ca3af",fontWeight:400}}>/ 80</span></span>
                <span style={{background:overall.bg,color:overall.color,border:\`1px solid \${overall.border}\`,borderRadius:999,padding:"4px 14px",fontSize:13,fontWeight:600}}>{overall.emoji} {overall.label}</span>
              </div>
              <div style={{height:8,background:"#f3f4f6",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:\`\${(totalScore/80)*100}%\`,background:overall.border,borderRadius:4}}/></div>
            </div>
            <div style={{background:"#fff",borderRadius:12,padding:28,marginBottom:16,boxShadow:"0 2px 12px rgba(0,0,0,0.07)"}}>
              <p style={{fontSize:14,fontWeight:600,color:"#111",margin:"0 0 16px"}}>Score by Category</p>
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                {catKeys.map((key,i)=>{
                  const name=CATEGORIES[key];
                  const catMax=questions.filter(q=>q.key===key).length*4;
                  const score=totals[key];
                  const risk=getCatRisk(score,catMax);
                  const isPriority=key==="flash"||key==="vendor";
                  const isQuickWin=key==="cloud";
                  return(
                    <div key={key} style={{padding:"14px 16px",borderRadius:8,border:isPriority?"1.5px solid #fca5a5":isQuickWin?"1.5px solid #86efac":"1px solid #f3f4f6",background:isPriority?"#fff7f7":isQuickWin?"#f0fdf4":"#fafafa"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                        <div>
                          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                            <span style={{fontSize:12,color:"#9ca3af",fontWeight:600}}>{i+1}.</span>
                            <span style={{fontSize:13,fontWeight:600,color:"#111"}}>{name}</span>
                            {isPriority&&<span style={{fontSize:10,fontWeight:700,background:"#fee2e2",color:"#991b1b",borderRadius:4,padding:"1px 6px"}}>PRIORITY</span>}
                            {isQuickWin&&<span style={{fontSize:10,fontWeight:700,background:"#dcfce7",color:"#166534",borderRadius:4,padding:"1px 6px"}}>QUICK WIN</span>}
                          </div>
                          {isPriority&&<p style={{fontSize:11,color:"#991b1b",margin:0}}>Architectural lock-in is the hardest problem to solve quickly.</p>}
                          {isQuickWin&&<p style={{fontSize:11,color:"#166534",margin:0}}>Fastest lever most organizations can pull.</p>}
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0,marginLeft:12}}>
                          <span style={{background:risk.bg,color:risk.color,border:\`1px solid \${risk.border}\`,borderRadius:999,padding:"1px 10px",fontSize:11,fontWeight:600}}>{risk.label}</span>
                          <span style={{fontSize:13,fontWeight:600,color:"#111"}}>{score}/{catMax}</span>
                        </div>
                      </div>
                      <div style={{height:6,background:"#e5e7eb",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:\`\${(score/catMax)*100}%\`,background:risk.border,borderRadius:3}}/></div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{background:"#fff",borderRadius:12,padding:28,marginBottom:16,boxShadow:"0 2px 12px rgba(0,0,0,0.07)"}}>
              <p style={{fontSize:14,fontWeight:600,color:"#111",margin:"0 0 16px"}}>Risk Score Thresholds</p>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {THRESHOLDS.map(t=>{
                  const active=totalScore>=t.lo&&totalScore<=t.hi;
                  return(
                    <div key={t.lo} style={{borderRadius:8,border:\`1px solid \${active?t.border:"#f3f4f6"}\`,background:active?t.bg:"#fafafa",padding:"12px 16px",opacity:active?1:0.5}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                        <span style={{fontSize:15}}>{t.emoji}</span>
                        <span style={{fontSize:13,fontWeight:700,color:t.color}}>{t.label}</span>
                        <span style={{fontSize:12,color:"#9ca3af",marginLeft:"auto"}}>{t.lo}-{t.hi}</span>
                      </div>
                      <p style={{fontSize:12,color:"#374151",margin:"0 0 6px",lineHeight:1.6}}>{t.desc}</p>
                      <p style={{fontSize:11,fontWeight:600,color:t.color,margin:0}}>Time to remediate: {t.remediate}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{background:"#fff",borderRadius:12,padding:28,marginBottom:16,boxShadow:"0 2px 12px rgba(0,0,0,0.07)"}}>
              <p style={{fontSize:14,fontWeight:600,color:"#111",margin:"0 0 20px"}}>Your Answers</p>
              {catKeys.map(key=>{
                const name=CATEGORIES[key];
                const catQs=questions.map((q,i)=>({q,i})).filter(({q})=>q.key===key);
                return(
                  <div key={key} style={{marginBottom:24}}>
                    <p style={{fontSize:11,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.05em",margin:"0 0 10px",paddingBottom:6,borderBottom:"1px solid #f3f4f6"}}>{name}</p>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {catQs.map(({q,i})=>{
                        const chosen=q.answers[answers[i]];
                        const s=chosen.s;
                        const sc=s===1?"#16a34a":s===2?"#ca8a04":s===3?"#ea580c":"#dc2626";
                        const sb=s===1?"#dcfce7":s===2?"#fef9c3":s===3?"#ffedd5":"#fee2e2";
                        return(
                          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"10px 14px",background:"#f9fafb",borderRadius:8,border:"1px solid #f3f4f6",gap:12}}>
                            <div style={{flex:1}}>
                              <p style={{fontSize:11,color:"#9ca3af",margin:"0 0 3px",fontWeight:600}}>Q{i+1}</p>
                              <p style={{fontSize:13,color:"#6b7280",margin:"0 0 4px",lineHeight:1.5}}>{q.text}</p>
                              <p style={{fontSize:13,fontWeight:600,color:"#111",margin:0}}>{chosen.label}</p>
                            </div>
                            <span style={{background:sb,color:sc,border:\`1px solid \${sc}\`,borderRadius:6,padding:"3px 10px",fontSize:12,fontWeight:700,flexShrink:0,marginTop:2}}>{s}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={handleRestart} style={{flex:1,padding:13,borderRadius:8,border:"1px solid #d1d5db",background:"#fff",fontSize:15,fontWeight:500,cursor:"pointer",color:"#374151"}}>Retake</button>
              <button onClick={()=>{
  const s=document.createElement('style');
  s.id='pf';
  s.innerHTML='@media print{@page{margin:0.6in;size:letter}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}*{overflow:visible!important;max-height:none!important;height:auto!important}button{display:none!important}}';
  document.head.appendChild(s);
  window.print();
  setTimeout(()=>{const e=document.getElementById('pf');if(e)e.remove();},1500);
}} style={{flex:1,padding:13,borderRadius:8,border:"none",background:"#111",fontSize:15,fontWeight:600,cursor:"pointer",color:"#fff"}}>Download PDF</button>
            </div>
          </div>
        );
      }

      return (
        <div style={{padding:24}}>
          <ScoringHeader />
          <div style={{background:"#fff",borderRadius:12,padding:40,boxShadow:"0 2px 12px rgba(0,0,0,0.07)"}}>
            <p style={{fontSize:13,fontWeight:700,color:"#9ca3af",margin:"0 0 4px"}}>Category {catIdx+1} of {catKeys.length}</p>
            <p style={{fontSize:16,fontWeight:700,color:"#111",margin:"0 0 4px"}}>{q.category}</p>
            <p style={{fontSize:13,color:"#6b7280",margin:"0 0 16px",lineHeight:1.5}}>{CAT_SUBTITLES[q.key]}</p>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <p style={{fontSize:13,color:"#9ca3af",margin:0}}>Question {currentQ+1} of {questions.length}</p>
              <p style={{fontSize:13,color:"#9ca3af",margin:0}}>{Math.round(progress)}%</p>
            </div>
            <div style={{height:5,background:"#e5e7eb",borderRadius:3,marginBottom:24,overflow:"hidden"}}><div style={{height:"100%",width:\`\${progress}%\`,background:"#111",borderRadius:3,transition:"width 0.3s ease"}}/></div>
            <h2 style={{fontSize:17,fontWeight:600,color:"#111",marginBottom:20,lineHeight:1.4}}>{q.text}</h2>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
              {q.answers.map((answer,i)=>(
                <button key={i} onClick={()=>setSelected(i)} style={{padding:"13px 16px",borderRadius:8,border:selected===i?"2px solid #111":"1.5px solid #e5e7eb",background:selected===i?"#f9fafb":"#fff",textAlign:"left",fontSize:14,cursor:"pointer",color:selected===i?"#111":"#374151",fontWeight:selected===i?500:400,display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontSize:12,fontWeight:700,color:selected===i?"#111":"#9ca3af",background:selected===i?"#e5e7eb":"#f3f4f6",borderRadius:4,padding:"2px 7px",flexShrink:0}}>{i+1}</span>
                  {answer.label}
                </button>
              ))}
            </div>
            <button onClick={handleNext} disabled={selected===null} style={{width:"100%",padding:13,borderRadius:8,border:"none",background:selected===null?"#e5e7eb":"#111",color:selected===null?"#9ca3af":"#fff",fontSize:15,fontWeight:600,cursor:selected===null?"not-allowed":"pointer"}}>
              {isLast?"See my results →":"Next →"}
            </button>
          </div>
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById('srq-root')).render(<Survey />);`;
    document.body.appendChild(babelScript);
    if (window.Babel) {
      Babel.transformScriptTags();
    }
  }

  if (window.React && window.ReactDOM && window.Babel) {
    initSurvey();
  } else {
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js', function() {
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js', function() {
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.2/babel.min.js', function() {
          initSurvey();
        });
      });
    });
  }
})();
