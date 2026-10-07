import React, {useMemo, useState} from "react";
import {createRoot} from "react-dom/client";
import {Shield, Terminal, FlaskConical, FileWarning, Database, Activity, Network, FileText, ChevronRight, CheckCircle2, LockKeyhole} from "lucide-react";
import "./style.css";

const targets=[
 {id:"WEB-01",name:"GhostShop",type:"Web / API",addr:"10.13.37.21",level:"BEGINNER",desc:"Intentionally vulnerable storefront for authorization, session and input-validation exercises.",services:["HTTP :80","API :3000"],checks:["Map exposed routes","Review session controls","Validate object authorization"]},
 {id:"API-02",name:"Phantom API",type:"REST / JWT",addr:"10.13.37.22",level:"INTERMEDIATE",desc:"Synthetic API target with seeded identity and authorization defects.",services:["API :8080","Docs :8081"],checks:["Enumerate API surface","Inspect token policy","Test role boundaries"]},
 {id:"NET-03",name:"Blacksite LAN",type:"Network",addr:"10.13.37.0/28",level:"INTERMEDIATE",desc:"Isolated range with Linux services and deliberately weak segmentation.",services:["SSH :22","HTTP :8000","DNS :53"],checks:["Discover lab hosts","Fingerprint services","Document trust paths"]},
 {id:"CODE-04",name:"Wraithbox",type:"Code Review",addr:"LOCAL",level:"ADVANCED",desc:"Offline source-review challenge focused on secrets, unsafe parsing and authorization logic.",services:["Repository","SAST"],checks:["Trace untrusted input","Review trust boundaries","Create remediation diff"]}
];
const findings=[
 {id:"SG-001",sev:"HIGH",title:"Broken object authorization",target:"Phantom API",status:"OPEN"},
 {id:"SG-002",sev:"LOW",title:"Missing security headers",target:"GhostShop",status:"VERIFIED"},
 {id:"SG-003",sev:"MEDIUM",title:"Flat service trust boundary",target:"Blacksite LAN",status:"OPEN"}
];
const evidence=[
 ["EV-012","API authorization response pair","Phantom API","SHA256 VERIFIED"],
 ["EV-011","Header capture","GhostShop","SHA256 VERIFIED"],
 ["EV-010","Network trust map","Blacksite LAN","SHA256 VERIFIED"]
];

function App(){
 const [view,setView]=useState("Lab");
 const [selected,setSelected]=useState(targets[0]);
 const [input,setInput]=useState("");
 const [log,setLog]=useState(["SPECTER.GHOST lab console ready.","Type 'help' for scoped commands."]);
 const [report,setReport]=useState(false);
 const nav=[["Lab",FlaskConical],["Findings",FileWarning],["Evidence",Database],["Reports",FileText],["Topology",Network],["Telemetry",Activity]];
 const stats=useMemo(()=>[["LAB TARGETS","04"],["ACTIVE FINDINGS","03"],["EVIDENCE ITEMS","12"],["RISK SCORE","6.4"]],[]);
 const run=(e)=>{e.preventDefault();const c=input.trim().toLowerCase();if(!c)return;
   const out={help:"Commands: help, targets, scope, status, clear",targets:targets.map(t=>`${t.id}  ${t.name}  ${t.addr}`).join("\n"),scope:"SCOPE: SPECTER.GHOST isolated lab only\nALLOW: listed RFC1918/local lab targets\nDENY: public targets, credential attacks, persistence\nEVIDENCE: record observations before remediation",status:"Ghost Node: ONLINE\nRoE: ENFORCED\nTargets: 4 READY\nFindings: 3 ACTIVE"}[c];
   setLog(c==="clear"?[]:[...log,`ghost@lab $ ${input}`,out||"Command blocked: console accepts built-in lab actions only."]);
   setInput("");
 };
 return <div className="app">
  <aside>
   <div className="brand"><div className="mark">SG</div><div><b>SPECTER.GHOST</b><span>SECURITY CONTROL PLANE</span></div></div>
   <div className="sideLabel">WORKSPACE</div>
   {nav.slice(0,4).map(([n,I])=><button className={view===n?"nav active":"nav"} onClick={()=>setView(n)} key={n}><I size={17}/>{n}</button>)}
   <div className="sideLabel">SYSTEM</div>
   {nav.slice(4).map(([n,I])=><button className={view===n?"nav active":"nav"} onClick={()=>setView(n)} key={n}><I size={17}/>{n}</button>)}
   <div className="roe"><LockKeyhole size={17}/><div><b>RoE ENFORCED</b><span>LAB TARGETS ONLY</span></div></div>
  </aside>
  <main>
   <header><div><div className="eyebrow">AUTHORIZED SECURITY LAB</div><h1>{view.toUpperCase()}</h1></div><div className="online"><i/> GHOST NODE ONLINE</div></header>
   {view==="Lab"&&<><section className="stats">{stats.map(([a,b])=><div className="stat" key={a}><span>{a}</span><strong>{b}</strong></div>)}</section>
    <section className="grid">
     <div className="panel"><div className="panelHead"><div><span>TRAINING RANGE</span><h2>Lab targets</h2></div><Shield size={20}/></div>
      <div className="targets">{targets.map(t=><button className={"target "+(selected.id===t.id?"chosen":"")} onClick={()=>setSelected(t)} key={t.id}><div><small>{t.id} · {t.type}</small><b>{t.name}</b><span>{t.addr}</span></div><ChevronRight size={18}/></button>)}</div>
     </div>
     <div className="panel detail"><div className="panelHead"><div><span>{selected.id} / {selected.level}</span><h2>{selected.name}</h2></div><span className="ready">● READY</span></div>
      <p>{selected.desc}</p><h3>SERVICES</h3><div className="chips">{selected.services.map(x=><span key={x}>{x}</span>)}</div>
      <h3>ASSESSMENT TRACK</h3>{selected.checks.map(x=><div className="check" key={x}><CheckCircle2 size={15}/>{x}</div>)}
      <button className="primary" onClick={()=>setLog([...log,`Workspace opened: ${selected.id} ${selected.name}`])}>OPEN WORKSPACE</button>
     </div>
    </section>
    <section className="console panel"><div className="consoleTop"><span><Terminal size={15}/> LAB CONSOLE</span><small>SCOPED COMMAND MODE</small></div><pre>{log.join("\n")}</pre><form onSubmit={run}><span>ghost@lab $</span><input value={input} onChange={e=>setInput(e.target.value)} placeholder="help" autoComplete="off"/></form></section>
   </>}
   {view==="Findings"&&<section className="panel page"><div className="panelHead"><div><span>ASSESSMENT REGISTER</span><h2>Findings</h2></div><FileWarning/></div><div className="table">{findings.map(f=><div className="row" key={f.id}><b>{f.id}</b><span className={"sev "+f.sev.toLowerCase()}>{f.sev}</span><strong>{f.title}</strong><span>{f.target}</span><small>{f.status}</small></div>)}</div></section>}
   {view==="Evidence"&&<section className="panel page"><div className="panelHead"><div><span>CHAIN OF CUSTODY</span><h2>Evidence vault</h2></div><Database/></div>{evidence.map(e=><div className="evidence" key={e[0]}><b>{e[0]}</b><div><strong>{e[1]}</strong><span>{e[2]}</span></div><small>{e[3]}</small></div>)}</section>}
   {view==="Reports"&&<section className="panel page report"><div className="panelHead"><div><span>DELIVERABLES</span><h2>Report builder</h2></div><FileText/></div><p>Compile the current lab assessment into a concise security report with scope, findings, evidence references and remediation status.</p><button className="primary" onClick={()=>setReport(true)}>GENERATE LAB REPORT</button>{report&&<div className="reportBox"><b>SPECTER.GHOST ASSESSMENT // READY</b><span>4 targets · 3 findings · 12 evidence items</span><span>Highest severity: HIGH · Scope: isolated lab</span></div>}</section>}
   {view==="Topology"&&<section className="panel page"><div className="panelHead"><div><span>ISOLATED RANGE</span><h2>Topology</h2></div><Network/></div><div className="topology"><div>GHOST NODE</div><i>↘</i><div>LAB GATEWAY<br/><small>10.13.37.1</small></div><i>→</i><div>10.13.37.0/28<br/><small>4 controlled targets</small></div></div></section>}
   {view==="Telemetry"&&<section className="panel page"><div className="panelHead"><div><span>NODE HEALTH</span><h2>Telemetry</h2></div><Activity/></div><div className="meters"><label>Ghost Node <progress value="92" max="100"/></label><label>Evidence pipeline <progress value="100" max="100"/></label><label>Lab availability <progress value="96" max="100"/></label></div></section>}
   <footer>SPECTER.GHOST // SECURITY RESEARCH CONTROL PLANE <span>AUTHORIZED LAB USE · v1.0.0</span></footer>
  </main>
 </div>
}
createRoot(document.getElementById("root")).render(<App/>);