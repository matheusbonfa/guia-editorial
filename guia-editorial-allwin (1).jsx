import { useState, useRef } from "react";

const C={bg:"#0e0e10",side:"#141416",card:"#18181b",card2:"#1f1f23",border:"#27272a",hover:"#2a2a2e",white:"#fafafa",text:"#e4e4e7",sub:"#a1a1aa",muted:"#71717a",dim:"#52525b",lime:"#bbdb4e",cyan:"#09add5",yellow:"#fef009",orange:"#fe6b21",purple:"#c501ff"};
const ff="'Poppins',sans-serif";
const mid=()=>`${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const fmt=d=>new Date(d).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"});
const fmtF=d=>new Date(d).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"});
const fmtM=d=>new Date(d).toLocaleDateString("pt-BR",{month:"long",year:"numeric"});
function pDates(s,n){const st=new Date(s+"T12:00:00"),vd=[1,3,5],ds=[];let c=new Date(st);while(!vd.includes(c.getDay()))c.setDate(c.getDate()+1);while(ds.length<n){if(vd.includes(c.getDay()))ds.push(new Date(c));c.setDate(c.getDate()+1);}return ds;}
function dDate(pd){const d=new Date(pd),m=d.getMonth(),y=d.getFullYear();return m===0?new Date(y-1,11,20):new Date(y,m-1,20);}

const FORMATS=[{id:"reels",label:"Reels",icon:"🎬"},{id:"carrossel",label:"Carrossel",icon:"📚"},{id:"estatico",label:"Estático",icon:"🖼️"},{id:"stories",label:"Stories",icon:"📱"}];
const TYPES=[{id:"educativo",label:"Educativo",icon:"📖"},{id:"entretenimento",label:"Entretenimento",icon:"😂"},{id:"promocional",label:"Promocional",icon:"🔥"},{id:"autoridade",label:"Autoridade",icon:"🏆"},{id:"prova-social",label:"Prova Social",icon:"⭐"},{id:"institucional",label:"Institucional",icon:"🏛️"},{id:"consultivo",label:"Consultivo",icon:"🧭"}];
const STAGES=[{id:"descoberta",label:"Descoberta",color:C.lime,tc:"#000",obj:"Conhecer",strat:"Atrair quem não conhece. Conteúdo leve e curioso."},{id:"consideracao",label:"Consideração",color:C.cyan,tc:"#fff",obj:"Educar",strat:"Mostrar autoridade e diferenciais."},{id:"compra",label:"Compra",color:C.yellow,tc:"#000",obj:"Converter",strat:"Cliente decidiu. Facilitar, criar urgência."},{id:"retencao",label:"Retenção",color:C.orange,tc:"#fff",obj:"Manter",strat:"Manter engajado. Valor contínuo."},{id:"expansao",label:"Expansão",color:C.purple,tc:"#fff",obj:"Indicar",strat:"Transformar em promotor."}];
const DKCOLS=[{id:"todo",label:"A Fazer",sub:"Prioridade"},{id:"doing",label:"Em Produção",sub:"Designer"},{id:"review",label:"Em Análise",sub:"Aprovação"},{id:"fix",label:"Correções",sub:"Ajustes"},{id:"done",label:"Aprovados",sub:"Pronto"}];
const ICONS=["🏢","🔧","🏥","🍽️","💼","🎓","🏋️","✈️","🛒","💅","🏠","📱","🐾","🌿","⚖️","🎨","🚗","💻"];
const BTYPES=[
  {id:"desconto",label:"Desconto",icon:"💰",fields:[{k:"percent",l:"% desconto",t:"number",p:"30"},{k:"on",l:"Em quê?",p:"revisão"}]},
  {id:"brinde",label:"Brinde",icon:"🎁",fields:[{k:"what",l:"O que ganha?",p:"Check-up"},{k:"condition",l:"Condição",p:"Na troca de óleo"}]},
  {id:"cashback",label:"Cashback",icon:"💳",fields:[{k:"percent",l:"%",t:"number",p:"10"},{k:"who",l:"Para quem?",p:"Pai"}]},
  {id:"sorteio",label:"Sorteio",icon:"🎰",fields:[{k:"what",l:"Prêmio",p:"Prêmios"},{k:"rule",l:"Regra",p:"1 número/R$100"}]},
  {id:"evento",label:"Evento",icon:"🎉",fields:[{k:"what",l:"O quê?",p:"Pipoca, espaço kids"}]},
  {id:"institucional",label:"Institucional",icon:"🏛️",fields:[{k:"message",l:"Mensagem",p:"Celebração..."}]},
];
function benText(bs){if(!bs?.length)return"";return bs.map(function(b){if(b.type==="desconto")return(b.percent||"?")+"% OFF "+(b.on||"");if(b.type==="brinde")return(b.what||"Brinde")+(b.condition?" ("+b.condition+")":"");if(b.type==="cashback")return(b.percent||"?")+"% cashback"+(b.who?" - "+b.who:"");if(b.type==="sorteio")return(b.what||"")+(b.rule?" - "+b.rule:"");if(b.type==="evento")return b.what||"Evento";if(b.type==="institucional")return b.message||"Institucional";return"";}).filter(Boolean).join(" + ");}

// === AUTO-GENERATE CAMPAIGN POSTS ===
function suggestCampaignPosts(camp, products){
  const prods=(camp.productIds||[]).map(pid=>products.find(p=>p.id===pid)).filter(Boolean);
  const mainProd=prods[0]||{name:"serviço"};
  const ben=benText(camp.benefits);
  const isInstitutional=camp.priority<=2||!camp.benefits?.length;
  const days=Math.max(1,Math.round((new Date(camp.end)-new Date(camp.start))/(1000*60*60*24)));

  if(isInstitutional){
    return [{desc:`Post institucional ${camp.name}`,formatId:"estatico",typeId:"institucional"}];
  }

  const posts=[];

  // PRE-LAUNCH (stories)
  posts.push({desc:`Pré-lançamento ${camp.name} — "Algo especial está chegando..."`,formatId:"stories",typeId:"promocional"});

  // LAUNCH (reels)
  posts.push({desc:`Lançamento oficial ${camp.name}: ${ben}`,formatId:"reels",typeId:"promocional"});

  // DETAIL (carrossel)
  posts.push({desc:`Como funciona a promoção ${camp.name} — ${ben} em ${mainProd.name}`,formatId:"carrossel",typeId:"promocional"});

  // If campaign is long (>10 days), add reinforcement
  if(days>10){
    posts.push({desc:`Reforço: não perca ${camp.name} — ${ben}`,formatId:"estatico",typeId:"promocional"});
  }

  // If campaign is very long (>20 days), add more
  if(days>20){
    posts.push({desc:`Prova social / bastidores da campanha ${camp.name}`,formatId:"reels",typeId:"prova-social"});
    posts.push({desc:`Conteúdo educativo relacionado a ${mainProd.name} + reforço ${camp.name}`,formatId:"carrossel",typeId:"educativo"});
  }

  // LAST CALL
  if(days>5){
    posts.push({desc:`Última chamada ${camp.name} — últimos dias para aproveitar ${ben}`,formatId:"carrossel",typeId:"promocional"});
  }

  return posts;
}

// === SCRIPT GENERATOR ===
function genScript(p){
  const{prod,stg,fr,format,ctype,camps,postDate:pd,deliveryDate:dd,briefDesc}=p;
  const promo=camps.filter(c=>c.benefits?.length).map(c=>"📣 "+c.name+": "+benText(c.benefits)).join("\n");
  const hooks={descoberta:["Voce sabia que a maioria dos problemas no carro pode ser evitada?","3 sinais de que seu carro precisa de atencao","O que ninguem te conta sobre "+prod.name.toLowerCase()],consideracao:["A diferenca entre fazer e nao fazer "+prod.name.toLowerCase(),"Por que "+prod.name.toLowerCase()+" aqui e diferente","O que verificamos que a maioria ignora"],compra:["Condicao especial em "+prod.name.toLowerCase()+" - tempo limitado","Veja o que esse cliente economizou","Ultima semana: nao perca"],retencao:["Dica exclusiva pra quem ja e cliente","Novidade pra voce que confia na gente","Cuide melhor do carro entre as revisoes"],expansao:["Seu amigo precisa saber disso","Indique e voces dois ganham","Compartilhe com quem precisa"]};
  const ctas={descoberta:"Salve - Compartilhe - Comente",consideracao:"Link na bio - Mande mensagem",compra:"Agende pelo WhatsApp - Oferta limitada",retencao:"Marque amigo - Conte sua experiencia",expansao:"Indique e ganhe - Compartilhe"};
  var devText="";
  if(stg.id==="descoberta") devText="Apresentar de forma leve e curiosa.\nProduto: "+prod.name+" ("+prod.desc+").";
  else if(stg.id==="consideracao") devText="Mostrar diferenciais e provas.\nProduto: "+prod.name+" - o que inclui.";
  else if(stg.id==="compra") devText="Oferta clara e direta.\n"+(promo||"Condicao especial.")+"\nFacilitar: WhatsApp, agendamento.";
  else if(stg.id==="retencao") devText="Valor real pra cliente ativo.\nProduto: "+prod.name+" - manutencao periodica.";
  else devText="Ensinar a indicar.\nAcao comercial de indicacao.";
  var tom="Leve, chamativo";
  if(stg.id==="consideracao") tom="Profissional";
  else if(stg.id==="compra") tom="Urgente, direto";
  else if(stg.id==="retencao") tom="Proximo";
  else if(stg.id==="expansao") tom="Empolgante";
  var lines=[];
  lines.push("===================================");
  lines.push("📌 "+(fr?.name?.toUpperCase()||"POST"));
  lines.push("===================================");
  lines.push("");
  lines.push("📅 Postagem: "+fmtF(pd)+"  |  📦 Entrega: "+fmtF(dd));
  lines.push("🎯 "+stg.label+" ("+stg.obj+")  |  📦 "+prod.name);
  if(format) lines.push("📐 "+format.icon+" "+format.label+(ctype?" | "+ctype.icon+" "+ctype.label:""));
  if(fr) lines.push("🎬 Franquia: "+fr.icon+" "+fr.name);
  if(briefDesc){lines.push("");lines.push("📋 BRIEFING DA CAMPANHA:");lines.push(briefDesc);}
  if(promo){lines.push("");lines.push("🔥 PROMOCAO ATIVA:");lines.push(promo);}
  lines.push("");
  lines.push("=== ESTRATEGIA ("+stg.obj.toUpperCase()+") ===");
  lines.push(stg.strat);
  if(fr) lines.push("Franquia \""+fr.name+"\": "+fr.desc);
  lines.push("");
  lines.push("=== HOOK ===");
  lines.push("\""+pick(hooks[stg.id]||hooks.descoberta)+"\"");
  lines.push("");
  lines.push("=== DESENVOLVIMENTO ===");
  lines.push(devText);
  lines.push("");
  lines.push("=== CTA ===");
  lines.push(ctas[stg.id]||ctas.descoberta);
  lines.push("");
  lines.push("=== DESIGNER ===");
  lines.push("Formato: "+(format?.label||"?")+" | Tom: "+tom);
  lines.push(camps.length?"Campanha: "+camps[0].name:"Identidade padrao");
  return lines.join("\n");
}

// === DEMO ===
const DEMO_PRODS=[{id:"p1",name:"Revisão Completa",desc:"Checklist 40 itens",priority:5},{id:"p2",name:"Troca de Óleo",desc:"Óleo e filtro premium",priority:4},{id:"p3",name:"A/C Automotivo",desc:"Higienização",priority:3},{id:"p4",name:"Freios e Suspensão",desc:"Diagnóstico",priority:4},{id:"p5",name:"Experiência VIP",desc:"Sala premium",priority:5},{id:"p6",name:"Alinhamento",desc:"Digital",priority:3},{id:"p7",name:"Revisão Pré-Viagem",desc:"Foco viagens",priority:4}];
const DEMO_FR=[{id:"fr1",name:"Quem tem empresa sabe",icon:"💼",desc:"Dor empresário → solução",formatId:"reels",typeId:"autoridade",stageIds:["consideracao"],obj:"Educar"},{id:"fr2",name:"Pack de Memes",icon:"😂",desc:"Memes leves",formatId:"carrossel",typeId:"entretenimento",stageIds:["descoberta","retencao"],obj:"Conhecer"},{id:"fr3",name:"Qual é a diferença?",icon:"🔍",desc:"Compara serviços",formatId:"reels",typeId:"educativo",stageIds:["consideracao","expansao"],obj:"Educar"},{id:"fr4",name:"Você Sabia?",icon:"🧠",desc:"Curiosidade",formatId:"carrossel",typeId:"educativo",stageIds:["descoberta"],obj:"Conhecer"},{id:"fr5",name:"Antes e Depois",icon:"🔄",desc:"Transformação",formatId:"carrossel",typeId:"prova-social",stageIds:["consideracao","compra"],obj:"Converter"},{id:"fr6",name:"Bastidores",icon:"🎬",desc:"Dia a dia",formatId:"reels",typeId:"prova-social",stageIds:["descoberta","retencao"],obj:"Conhecer"},{id:"fr7",name:"Depoimento",icon:"⭐",desc:"Cliente real",formatId:"reels",typeId:"prova-social",stageIds:["compra","expansao"],obj:"Converter"},{id:"fr8",name:"Oferta",icon:"🔥",desc:"Promoção direta",formatId:"estatico",typeId:"promocional",stageIds:["compra"],obj:"Converter"},{id:"fr9",name:"Institucional",icon:"🏛️",desc:"Datas, causas",formatId:"estatico",typeId:"institucional",stageIds:["descoberta"],obj:"Conhecer"},{id:"fr10",name:"Checklist",icon:"✅",desc:"Lista prática",formatId:"carrossel",typeId:"educativo",stageIds:["descoberta","consideracao"],obj:"Educar"},{id:"fr11",name:"Indique e Ganhe",icon:"🎁",desc:"Ação indicação",formatId:"carrossel",typeId:"consultivo",stageIds:["expansao"],obj:"Indicar"}];

function buildDemoCamps(){
  const camps=[
    {id:"cm3",name:"🚗 Feriado Prolongado",start:"2026-04-06",end:"2026-04-18",desc:"Pré-viagem",benefits:[{type:"desconto",percent:30,on:"revisão básica"}],productIds:["p1","p7"],priority:3,status:"aprovada"},
    {id:"cm4",name:"💐 Dia das Mães",start:"2026-04-22",end:"2026-05-10",desc:"Mãe ganha check-up",benefits:[{type:"brinde",what:"Check-up gratuito (freios, suspensão, bateria)",condition:"Na troca de óleo"}],productIds:["p2","p4"],priority:3,status:"aprovada"},
    {id:"cm6",name:"⚽ Copa do Mundo",start:"2026-05-11",end:"2026-07-19",desc:"Sorteios + Promoção Vitória",benefits:[{type:"sorteio",what:"Prêmios a cada jogo",rule:"1 número/R$100"},{type:"desconto",percent:20,on:"troca de óleo (se ganhar)"}],productIds:["p1","p2","p6"],priority:4,status:"sugerida"},
    {id:"cm14",name:"🖤 Black November",start:"2026-11-01",end:"2026-11-27",desc:"Promoções mês todo",benefits:[{type:"brinde",what:"Alinh+balanc grátis",condition:"Troca óleo (Black Friday)"},{type:"desconto",percent:30,on:"alinh. (Ressaca)"}],productIds:["p2","p6","p1"],priority:5,status:"sugerida"},
  ];
  camps.forEach(c=>{c.postPlan=suggestCampaignPosts(c,DEMO_PRODS);});
  return camps;
}

const DEMO={id:"d1",name:"Centro Automotivo Uberlândia",desc:"Oficina com sala VIP. Referência em conforto.",icon:"🔧",products:DEMO_PRODS,franchises:DEMO_FR,campaigns:buildDemoCamps(),kCols:[...DKCOLS],kanban:{todo:[],doing:[],review:[],fix:[],done:[]}};

// === UI ===
const Input=({label,value,onChange,placeholder,multiline,type="text",s={}})=>(<div style={{marginBottom:"14px",...s}}>{label&&<label style={{display:"block",fontSize:"11px",fontWeight:500,color:C.sub,marginBottom:"5px",fontFamily:ff}}>{label}</label>}{multiline?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={3} style={{width:"100%",padding:"10px 14px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:"8px",color:C.text,fontSize:"13px",fontFamily:ff,resize:"vertical",outline:"none",boxSizing:"border-box"}}/>:<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:"10px 14px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:"8px",color:C.text,fontSize:"13px",fontFamily:ff,outline:"none",boxSizing:"border-box"}}/>}</div>);
const Btn=({children,onClick,v="primary",disabled,s={}})=>{const vs={primary:{background:C.white,color:C.bg},secondary:{background:"transparent",color:C.sub,border:`1px solid ${C.border}`},ghost:{background:"transparent",color:C.dim},danger:{background:"#dc2626",color:"#fff"}};return <button onClick={disabled?undefined:onClick} style={{padding:"8px 18px",borderRadius:"8px",fontWeight:600,fontSize:"12px",fontFamily:ff,cursor:disabled?"not-allowed":"pointer",border:"none",transition:"all .15s",opacity:disabled?.3:1,...vs[v],...s}}>{children}</button>;};
const Tag=({children,color,onClick,s={}})=><span onClick={onClick} style={{display:"inline-flex",alignItems:"center",gap:"3px",padding:"2px 8px",borderRadius:"4px",fontSize:"10px",fontWeight:500,fontFamily:ff,background:(color||C.dim)+"18",color:color||C.sub,cursor:onClick?"pointer":"default",whiteSpace:"nowrap",...s}}>{children}</span>;

// === APP ===
export default function App(){
  const[cos,setCos]=useState([DEMO]);const[aid,setAid]=useState(null);const[page,setPage]=useState("home");const[modal,setModal]=useState(null);const[mData,setMData]=useState(null);const[sideO,setSideO]=useState(true);
  const[cF,setCF]=useState({name:"",desc:"",icon:"🏢"});const[pF,setPF]=useState({name:"",desc:"",priority:3});
  const[frF,setFrF]=useState({name:"",icon:"📌",desc:"",formatId:"reels",typeId:"educativo",stageIds:[],obj:""});
  const[campF,setCampF]=useState({name:"",start:"",end:"",desc:"",benefits:[],productIds:[],priority:3,status:"sugerida",postPlan:[]});
  const[genF,setGenF]=useState({month:"2026-04"});
  const[colF,setColF]=useState({label:"",sub:""});const[eIdx,setEIdx]=useState(null);
  const dragRef=useRef(null);

  const co=cos.find(c=>c.id===aid);
  const up=(id,p)=>setCos(pr=>pr.map(c=>c.id===id?{...c,...p}:c));
  const nav=(pg,id)=>{if(id)setAid(id);setPage(pg);};
  const getAllCards=()=>{if(!co?.kanban)return[];const r=[];for(const k of Object.keys(co.kanban)){if(Array.isArray(co.kanban[k]))r.push(...co.kanban[k].map(c=>({...c,_col:k})));}return r;};
  const getAC=(s,e)=>(co?.campaigns||[]).filter(c=>{const cs=new Date(c.start),ce=new Date(c.end);return cs<=e&&ce>=s;});

  // Regenerate campaign posts when benefits/products change
  const regenCampPosts=(camp)=>{
    const posts=suggestCampaignPosts(camp,co?.products||[]);
    return {...camp,postPlan:posts};
  };

  // === GENERATE MONTH ===
  const generate=()=>{
    if(!co||!genF.month)return;const{products,franchises}=co;if(!products.length)return;
    const[yr,mo]=genF.month.split("-").map(Number);
    const fd=new Date(yr,mo-1,1),ld=new Date(yr,mo,0);
    const activeCamps=getAC(fd,ld);
    const boost=new Set();activeCamps.filter(c=>c.priority>=3).forEach(c=>(c.productIds||[]).forEach(pid=>boost.add(pid)));

    // Campaign posts
    const campCards=[];
    activeCamps.forEach(camp=>{
      (camp.postPlan||[]).forEach((pp,i)=>{
        const format=FORMATS.find(f=>f.id===pp.formatId);
        const ctype=TYPES.find(t=>t.id===pp.typeId);
        const prod=camp.productIds?.length?products.find(p=>p.id===camp.productIds[0])||products[0]:products[0];
        campCards.push({id:`cc-${mid()}-${i}`,title:`📣 ${pp.desc.slice(0,45)}`,stage:STAGES[2],product:prod,franchise:null,format,ctype,briefDesc:pp.desc,campaigns:[camp.name],isCampaignPost:true,script:""});
      });
    });

    // Regular posts fill remaining slots up to 12
    const regCount=Math.max(0,12-campCards.length);
    const selFr=franchises.length?franchises:[];
    const tw=products.reduce((s,p)=>s+p.priority+(boost.has(p.id)?3:0),0);
    const sd={descoberta:.22,consideracao:.24,compra:.22,retencao:.16,expansao:.16};
    const regCards=[];
    for(let i=0;i<regCount;i++){
      let roll=Math.random()*tw,prod=products[0];for(const p of products){roll-=p.priority+(boost.has(p.id)?3:0);if(roll<=0){prod=p;break;}}
      let cm=0;const sr=Math.random();let stg=STAGES[0];for(const s of STAGES){cm+=sd[s.id];if(sr<=cm){stg=s;break;}}
      const fr=selFr.length?pick(selFr):null;
      const format=fr?FORMATS.find(f=>f.id===fr.formatId):pick(FORMATS);
      const ctype=fr?TYPES.find(t=>t.id===fr.typeId):pick(TYPES);
      regCards.push({id:`cr-${mid()}-${i}`,title:`${fr?.icon||format?.icon||"📌"} ${fr?.name||"Post"} — ${prod.name}`,stage:stg,product:prod,franchise:fr,format,ctype,briefDesc:"",campaigns:[],isCampaignPost:false,script:""});
    }

    // Merge + dates
    const all=[...campCards,...regCards];
    const ss=`${yr}-${String(mo).padStart(2,"0")}-01`;
    const dates=pDates(ss,12);
    all.forEach((c,i)=>{
      if(dates[i]){c.postDate=dates[i].toISOString();c.deliveryDate=dDate(dates[i]).toISOString();}
      const pc=activeCamps.filter(camp=>{if(!c.postDate)return false;const s=new Date(camp.start),e=new Date(camp.end),d=new Date(c.postDate);return d>=s&&d<=e;});
      if(!c.campaigns.length)c.campaigns=pc.map(x=>x.name);
      c.script=genScript({prod:c.product,stg:c.stage,fr:c.franchise,format:c.format,ctype:c.ctype,camps:pc,postDate:c.postDate?new Date(c.postDate):new Date(),deliveryDate:c.deliveryDate?new Date(c.deliveryDate):new Date(),briefDesc:c.briefDesc});
    });

    const k={...co.kanban};k.todo=[...all,...(k.todo||[])];up(aid,{kanban:k});setPage("demandas");
  };

  // Kanban
  const moveCard=(cid,from,to)=>{if(!co)return;const k={...co.kanban};const idx=(k[from]||[]).findIndex(c=>c.id===cid);if(idx===-1)return;const[card]=k[from].splice(idx,1);k[to]=[...(k[to]||[]),card];up(aid,{kanban:k});};
  const updateCard=(cid,patch)=>{if(!co)return;const k={...co.kanban};for(const col of Object.keys(k)){const idx=(k[col]||[]).findIndex(c=>c.id===cid);if(idx!==-1){k[col][idx]={...k[col][idx],...patch};up(aid,{kanban:k});return;}}};
  const deleteCard=cid=>{if(!co)return;const k={...co.kanban};for(const c of Object.keys(k)){if(Array.isArray(k[c]))k[c]=k[c].filter(x=>x.id!==cid);}up(aid,{kanban:k});};
  const addCol=()=>{if(!co||!colF.label.trim())return;const id=`col-${mid()}`;up(aid,{kCols:[...co.kCols,{id,label:colF.label,sub:colF.sub}],kanban:{...co.kanban,[id]:[]}});setColF({label:"",sub:""});setModal(null);};
  const removeCol=cid=>{if(!co)return;const cols=co.kCols.filter(c=>c.id!==cid);const k={...co.kanban};const o=k[cid]||[];delete k[cid];if(cols.length)k[cols[0].id]=[...(k[cols[0].id]||[]),...o];up(aid,{kCols:cols,kanban:k});};

  // === SIDEBAR ===
  const Sidebar=()=>(<div style={{width:sideO?232:60,minWidth:sideO?232:60,background:C.side,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",transition:"width .25s,min-width .25s",overflow:"hidden",flexShrink:0}}>
    <div style={{padding:sideO?"16px 16px 12px":"16px 12px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:"10px",cursor:"pointer"}} onClick={()=>setSideO(!sideO)}>
      <svg width="28" height="28" viewBox="0 0 100 100"><defs><linearGradient id="lg" x1="0" y1="0" x2="100" y2="100"><stop offset="0%" stopColor="#c8d8e8"/><stop offset="50%" stopColor="#e0c8f0"/><stop offset="100%" stopColor="#a8e8d8"/></linearGradient></defs><rect width="100" height="100" rx="16" fill="#2a2a2e"/><text x="50" y="42" textAnchor="middle" fontFamily="Poppins" fontWeight="800" fontSize="28" fill="url(#lg)">ALL</text><text x="50" y="72" textAnchor="middle" fontFamily="Poppins" fontWeight="800" fontSize="28" fill="url(#lg)">WIN</text></svg>
      {sideO&&<div><div style={{fontSize:"11px",fontWeight:700,color:C.white}}>GUIA EDITORIAL</div><div style={{fontSize:"9px",color:C.dim}}>Agência All Win</div></div>}
    </div>
    {sideO&&<div style={{padding:"10px 12px",borderBottom:`1px solid ${C.border}`}}>
      {cos.map(c=><div key={c.id} onClick={()=>nav("dash",c.id)} style={{display:"flex",alignItems:"center",gap:"8px",padding:"6px 8px",borderRadius:"6px",cursor:"pointer",background:aid===c.id?C.card2:"transparent",marginBottom:"1px"}} onMouseEnter={e=>{if(aid!==c.id)e.currentTarget.style.background=C.hover}} onMouseLeave={e=>{if(aid!==c.id)e.currentTarget.style.background="transparent"}}><span style={{fontSize:"14px"}}>{c.icon}</span><span style={{fontSize:"11px",fontWeight:aid===c.id?600:400,color:aid===c.id?C.white:C.sub}}>{c.name}</span></div>)}
      <div onClick={()=>{setCF({name:"",desc:"",icon:"🏢"});setModal("new-co")}} style={{display:"flex",alignItems:"center",gap:"8px",padding:"6px 8px",borderRadius:"6px",cursor:"pointer",marginTop:"4px",border:`1px dashed ${C.border}`}}><span style={{fontSize:"11px",color:C.dim}}>+ Nova</span></div>
    </div>}
    {co&&sideO&&<div style={{padding:"10px 12px",flex:1}}>
      {[{id:"dash",icon:"◻",label:"Dashboard"},{id:"cliente",icon:"☰",label:"Cliente"},{id:"conteudos",icon:"📐",label:"Conteúdos"},{id:"campanhas",icon:"📅",label:"Campanhas"},{id:"gerar",icon:"⚡",label:"Gerar Mês"},{id:"demandas",icon:"▦",label:"Demandas",count:co.kanban?Object.keys(co.kanban).reduce((s,k)=>s+(Array.isArray(co.kanban[k])?co.kanban[k].length:0),0):0}].map(item=>(
        <div key={item.id} onClick={()=>setPage(item.id)} style={{display:"flex",alignItems:"center",gap:"8px",padding:"7px 8px",borderRadius:"6px",cursor:"pointer",background:page===item.id?C.card2:"transparent",marginBottom:"1px"}} onMouseEnter={e=>{if(page!==item.id)e.currentTarget.style.background=C.hover}} onMouseLeave={e=>{if(page!==item.id)e.currentTarget.style.background="transparent"}}>
          <span style={{fontSize:"13px",color:page===item.id?C.white:C.dim,width:"18px",textAlign:"center"}}>{item.icon}</span>
          <span style={{fontSize:"11px",fontWeight:page===item.id?600:400,color:page===item.id?C.white:C.sub,flex:1}}>{item.label}</span>
          {item.count>0&&<span style={{fontSize:"9px",fontWeight:600,color:C.white,background:C.dim,borderRadius:"8px",padding:"1px 6px"}}>{item.count}</span>}
        </div>
      ))}
    </div>}
  </div>);

  // === DASHBOARD ===
  const PageDash=()=>{if(!co)return null;const cards=getAllCards();const stageCt={};STAGES.forEach(s=>{stageCt[s.id]=cards.filter(c=>c.stage?.id===s.id).length;});const upcoming=cards.filter(c=>c.postDate&&c._col!=="done").sort((a,b)=>new Date(a.postDate)-new Date(b.postDate)).slice(0,5);const now=new Date();const act=(co.campaigns||[]).filter(c=>now>=new Date(c.start)&&now<=new Date(c.end));
    return(<div style={{padding:"32px 36px",maxWidth:"820px"}}>
      <div style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"24px"}}><span style={{fontSize:"28px"}}>{co.icon}</span><div style={{flex:1}}><h1 style={{fontSize:"20px",fontWeight:700,color:C.white}}>{co.name}</h1><p style={{fontSize:"12px",color:C.muted}}>{co.desc}</p></div></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:"6px",marginBottom:"20px"}}>{[{l:"Posts",v:cards.length,p:"demandas"},{l:"Produtos",v:co.products.length,p:"cliente"},{l:"Franquias",v:co.franchises.length,p:"conteudos"},{l:"Campanhas",v:(co.campaigns||[]).length,p:"campanhas"},{l:"Formatos",v:FORMATS.length,p:"conteudos"}].map(s=>(<div key={s.l} onClick={()=>setPage(s.p)} style={{background:C.card,borderRadius:"10px",padding:"12px",border:`1px solid ${C.border}`,cursor:"pointer",textAlign:"center"}}><div style={{fontSize:"20px",fontWeight:700,color:C.white}}>{s.v}</div><div style={{fontSize:"9px",color:C.muted}}>{s.l}</div></div>))}</div>
      {act.length>0&&<div style={{background:C.orange+"10",border:`1px solid ${C.orange}30`,borderRadius:"10px",padding:"12px",marginBottom:"16px"}}><div style={{fontSize:"11px",fontWeight:600,color:C.orange,marginBottom:"4px"}}>📣 Campanhas ativas</div>{act.map(c=><div key={c.id} style={{fontSize:"11px",color:C.text,marginBottom:"2px"}}><strong>{c.name}</strong> — {benText(c.benefits)||"Institucional"} <Tag color={c.status==="aprovada"?C.lime:C.yellow} s={{fontSize:"8px",marginLeft:"4px"}}>{c.status}</Tag></div>)}</div>}
      <div style={{marginBottom:"20px"}}><div style={{fontSize:"12px",fontWeight:600,color:C.white,marginBottom:"6px"}}>Por Etapa</div><div style={{display:"flex",gap:"4px"}}>{STAGES.map(s=>(<div key={s.id} style={{flex:1,background:C.card,borderRadius:"8px",padding:"8px",border:`1px solid ${C.border}`,textAlign:"center",borderTop:`3px solid ${s.color}`}}><div style={{fontSize:"16px",fontWeight:700,color:C.white}}>{stageCt[s.id]||0}</div><div style={{fontSize:"8px",color:s.color,fontWeight:600}}>{s.obj}</div></div>))}</div></div>
      <div><div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}><span style={{fontSize:"12px",fontWeight:600,color:C.white}}>Próximas</span><Btn v="ghost" onClick={()=>setPage("demandas")} s={{fontSize:"10px",padding:"3px 8px"}}>Ver todas →</Btn></div>{upcoming.length?<div style={{display:"flex",flexDirection:"column",gap:"3px"}}>{upcoming.map(c=>{const stg=c.stage;return(<div key={c.id} style={{background:C.card,borderRadius:"8px",padding:"8px 12px",border:`1px solid ${C.border}`,borderLeft:`3px solid ${stg?.color||C.dim}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",alignItems:"center",gap:"6px"}}><span style={{fontSize:"11px",fontWeight:600,color:C.text}}>{c.title.slice(0,35)}</span><Tag color={stg?.color} s={{fontSize:"8px"}}>{stg?.obj}</Tag>{c.isCampaignPost&&<Tag color={C.orange} s={{fontSize:"8px"}}>📣</Tag>}</div><span style={{fontSize:"10px",color:C.muted}}>📅 {fmt(c.postDate)}</span></div>);})}</div>:<div style={{background:C.card,borderRadius:"8px",padding:"20px",border:`1px dashed ${C.border}`,textAlign:"center",color:C.dim,fontSize:"12px"}}><span style={{cursor:"pointer",textDecoration:"underline"}} onClick={()=>setPage("gerar")}>Gerar roteiros →</span></div>}</div>
    </div>);};

  // === CLIENT ===
  const PageCliente=()=>{if(!co)return null;return(<div style={{padding:"32px 36px",maxWidth:"700px"}}>
    <h2 style={{fontSize:"18px",fontWeight:700,color:C.white,marginBottom:"20px"}}>Área do Cliente</h2>
    <div style={{background:C.card,borderRadius:"10px",padding:"16px",border:`1px solid ${C.border}`,marginBottom:"20px"}}><div style={{display:"grid",gridTemplateColumns:"60px 1fr 1fr",gap:"10px"}}><div><label style={{fontSize:"10px",color:C.sub}}>Ícone</label><div style={{display:"flex",flexWrap:"wrap",gap:"2px",marginTop:"4px"}}>{ICONS.slice(0,10).map(ic=><button key={ic} onClick={()=>up(co.id,{icon:ic})} style={{width:"22px",height:"22px",borderRadius:"4px",border:`1px solid ${co.icon===ic?C.white:C.border}`,background:"transparent",fontSize:"11px",cursor:"pointer"}}>{ic}</button>)}</div></div><Input label="Nome" value={co.name} onChange={v=>up(co.id,{name:v})} s={{marginBottom:0}}/><Input label="Descrição" value={co.desc} onChange={v=>up(co.id,{desc:v})} s={{marginBottom:0}}/></div></div>
    <div><div style={{display:"flex",justifyContent:"space-between",marginBottom:"8px"}}><h3 style={{fontSize:"14px",fontWeight:600,color:C.white}}>Produtos ({co.products.length})</h3><Btn v="secondary" onClick={()=>{setPF({name:"",desc:"",priority:3});setEIdx(null);setModal("product")}} s={{fontSize:"10px",padding:"4px 12px"}}>+ Novo</Btn></div>
      <div style={{display:"flex",flexDirection:"column",gap:"3px"}}>{co.products.map((p,i)=>(<div key={p.id} style={{background:C.card,borderRadius:"8px",padding:"8px 12px",border:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:"8px"}}><div style={{display:"flex",gap:"2px"}}>{[1,2,3,4,5].map(n=><span key={n} style={{width:"5px",height:"5px",borderRadius:"50%",background:n<=p.priority?C.white:C.border}}/>)}</div><span style={{fontWeight:600,fontSize:"12px",color:C.text,flex:1}}>{p.name}<span style={{color:C.dim,fontWeight:400,marginLeft:"6px"}}>{p.desc}</span></span><button onClick={()=>{setPF(p);setEIdx(i);setModal("product")}} style={{background:"none",border:"none",color:C.sub,cursor:"pointer",fontSize:"11px"}}>✎</button><button onClick={()=>up(co.id,{products:co.products.filter(x=>x.id!==p.id)})} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",fontSize:"13px"}}>×</button></div>))}</div>
    </div>
  </div>);};

  // === CONTEÚDOS ===
  const PageConteudos=()=>{if(!co)return null;return(<div style={{padding:"32px 36px",maxWidth:"800px"}}>
    <h2 style={{fontSize:"18px",fontWeight:700,color:C.white,marginBottom:"20px"}}>Conteúdos</h2>
    <div style={{marginBottom:"20px"}}><div style={{fontSize:"13px",fontWeight:600,color:C.white,marginBottom:"6px"}}>Formatos → Tipos → Etapas</div><div style={{display:"flex",gap:"4px",marginBottom:"8px"}}>{FORMATS.map(f=>(<div key={f.id} style={{flex:1,background:C.card,borderRadius:"8px",padding:"10px",border:`1px solid ${C.border}`,textAlign:"center"}}><span style={{fontSize:"20px"}}>{f.icon}</span><div style={{fontSize:"11px",fontWeight:600,color:C.text}}>{f.label}</div></div>))}</div>
      <div style={{display:"flex",gap:"4px",marginBottom:"8px",flexWrap:"wrap"}}>{TYPES.map(t=>(<Tag key={t.id} s={{padding:"4px 10px"}}>{t.icon} {t.label}</Tag>))}</div>
      <div style={{display:"flex",gap:"4px"}}>{STAGES.map(s=>(<div key={s.id} style={{flex:1,background:C.card,borderRadius:"6px",padding:"6px",border:`1px solid ${C.border}`,textAlign:"center",borderTop:`2px solid ${s.color}`}}><div style={{fontSize:"11px",fontWeight:700,color:s.color}}>{s.obj}</div><div style={{fontSize:"9px",color:C.muted}}>{s.label}</div></div>))}</div>
    </div>
    <div><div style={{display:"flex",justifyContent:"space-between",marginBottom:"8px"}}><h3 style={{fontSize:"14px",fontWeight:600,color:C.white}}>Franquias ({co.franchises.length})</h3><Btn v="secondary" onClick={()=>{setFrF({name:"",icon:"📌",desc:"",formatId:"reels",typeId:"educativo",stageIds:[],obj:""});setEIdx(null);setModal("franchise")}} s={{fontSize:"10px",padding:"5px 12px"}}>+ Nova</Btn></div>
      <div style={{display:"flex",flexDirection:"column",gap:"4px"}}>{co.franchises.map((f,i)=>{const format=FORMATS.find(x=>x.id===f.formatId);const ctype=TYPES.find(x=>x.id===f.typeId);return(<div key={f.id} style={{background:C.card,borderRadius:"8px",padding:"12px",border:`1px solid ${C.border}`,display:"flex",gap:"10px"}}>
        <span style={{fontSize:"20px"}}>{f.icon}</span>
        <div style={{flex:1}}><div style={{fontWeight:600,fontSize:"13px",color:C.text,marginBottom:"2px"}}>{f.name}</div><div style={{fontSize:"10px",color:C.muted,marginBottom:"4px"}}>{f.desc}</div><div style={{display:"flex",gap:"3px",flexWrap:"wrap"}}>{format&&<Tag color={C.white} s={{fontSize:"9px"}}>{format.icon} {format.label}</Tag>}{ctype&&<Tag s={{fontSize:"9px"}}>{ctype.icon} {ctype.label}</Tag>}{(f.stageIds||[]).map(sid=>{const st=STAGES.find(x=>x.id===sid);return st?<Tag key={sid} color={st.color} s={{fontSize:"9px"}}>{st.obj}</Tag>:null;})}</div></div>
        <div style={{display:"flex",gap:"2px"}}><button onClick={()=>{setFrF({name:f.name,icon:f.icon,desc:f.desc,formatId:f.formatId,typeId:f.typeId,stageIds:f.stageIds||[],obj:f.obj||""});setEIdx(i);setModal("franchise")}} style={{background:"none",border:"none",color:C.sub,cursor:"pointer",fontSize:"10px"}}>✎</button><button onClick={()=>up(co.id,{franchises:co.franchises.filter(x=>x.id!==f.id)})} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",fontSize:"12px"}}>×</button></div>
      </div>);})}</div>
    </div>
  </div>);};

  // === CAMPANHAS ===
  const PageCamp=()=>{if(!co)return null;return(<div style={{padding:"32px 36px",maxWidth:"740px"}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}><h2 style={{fontSize:"18px",fontWeight:700,color:C.white}}>Campanhas</h2><Btn onClick={()=>{setCampF({name:"",start:"",end:"",desc:"",benefits:[],productIds:[],priority:3,status:"sugerida",postPlan:[]});setEIdx(null);setModal("campaign")}}>+ Nova</Btn></div>
    <p style={{fontSize:"12px",color:C.muted,marginBottom:"16px"}}>Posts de campanha são gerados automaticamente. Cada post de campanha substitui um dos 12 posts regulares do mês.</p>
    <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
      {(co.campaigns||[]).map((camp,ci)=>{const prods=(camp.productIds||[]).map(pid=>co.products.find(p=>p.id===pid)?.name).filter(Boolean);const bt=benText(camp.benefits);const pp=camp.postPlan||[];return(
        <div key={camp.id||ci} style={{background:C.card,borderRadius:"10px",padding:"16px",border:`1px solid ${C.border}`,borderLeft:`3px solid ${camp.priority>=4?C.orange:camp.priority>=3?C.cyan:C.dim}`}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:"8px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"}}>
              <span style={{fontSize:"15px",fontWeight:700,color:C.text}}>{camp.name}</span>
              <Tag color={camp.status==="aprovada"?C.lime:C.yellow} s={{fontSize:"9px",fontWeight:600}}>{camp.status==="aprovada"?"✓ Aprovada":"⏳ Sugerida"}</Tag>
              {(camp.benefits||[]).map((b,bi)=>{const btype=BTYPES.find(t=>t.id===b.type);return <Tag key={bi} color={C.orange} s={{fontSize:"9px"}}>{btype?.icon} {btype?.label}</Tag>;})}
            </div>
            <div style={{display:"flex",gap:"3px"}}>
              <button onClick={()=>{const newStatus=camp.status==="aprovada"?"sugerida":"aprovada";const cs=[...co.campaigns];cs[ci]={...cs[ci],status:newStatus};up(co.id,{campaigns:cs});}} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:"6px",color:camp.status==="aprovada"?C.lime:C.yellow,cursor:"pointer",fontSize:"10px",padding:"2px 8px",fontFamily:ff}}>{camp.status==="aprovada"?"Desaprovar":"Aprovar"}</button>
              <button onClick={()=>{setCampF({...camp,benefits:camp.benefits||[],postPlan:camp.postPlan||[]});setEIdx(ci);setModal("campaign")}} style={{background:"none",border:"none",color:C.sub,cursor:"pointer",fontSize:"11px"}}>✎</button>
              <button onClick={()=>up(co.id,{campaigns:co.campaigns.filter(x=>x.id!==camp.id)})} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",fontSize:"13px"}}>×</button>
            </div>
          </div>
          <div style={{fontSize:"11px",color:C.muted,marginBottom:"4px"}}>{camp.start&&fmt(camp.start)} → {camp.end&&fmt(camp.end)}</div>
          {bt&&<div style={{fontSize:"11px",color:C.text,background:C.card2,padding:"6px 10px",borderRadius:"6px",marginBottom:"6px"}}>🎁 {bt}</div>}
          {prods.length>0&&<div style={{display:"flex",gap:"3px",flexWrap:"wrap",marginBottom:"6px"}}>{prods.map(n=><Tag key={n} color={C.cyan} s={{fontSize:"9px"}}>📦 {n}</Tag>)}</div>}
          {pp.length>0&&<div style={{marginTop:"6px",paddingTop:"6px",borderTop:`1px dashed ${C.border}`}}>
            <div style={{fontSize:"10px",fontWeight:600,color:C.sub,marginBottom:"4px"}}>📋 {pp.length} posts sugeridos (substituem slots dos 12 regulares)</div>
            <div style={{display:"flex",flexDirection:"column",gap:"2px"}}>{pp.map((p,pi)=>{const f=FORMATS.find(x=>x.id===p.formatId);return <div key={pi} style={{fontSize:"10px",color:C.text,display:"flex",gap:"4px",alignItems:"center"}}><Tag s={{fontSize:"8px",padding:"1px 5px"}}>{f?.icon} {f?.label}</Tag><span>{p.desc}</span></div>;})}</div>
          </div>}
        </div>
      );})}
    </div>
  </div>);};

  // === GERAR ===
  const PageGerar=()=>{if(!co)return null;
    const[yr,mo]=genF.month?genF.month.split("-").map(Number):[2026,4];
    const fd=new Date(yr,mo-1,1),ld=new Date(yr,mo,0);
    const mc=genF.month?getAC(fd,ld):[];
    const campPostCount=mc.reduce((s,c)=>s+(c.postPlan?.length||0),0);
    const regCount=Math.max(0,12-campPostCount);
    const preview=genF.month?pDates(`${yr}-${String(mo).padStart(2,"0")}-01`,12):[];
    const dd=preview.length?dDate(preview[0]):null;
    const ml=genF.month?new Date(yr,mo-1).toLocaleDateString("pt-BR",{month:"long",year:"numeric"}):"";

    return(<div style={{padding:"32px 36px",maxWidth:"640px"}}>
      <h2 style={{fontSize:"18px",fontWeight:700,color:C.white,marginBottom:"4px"}}>Gerar Mês</h2>
      <p style={{fontSize:"12px",color:C.muted,marginBottom:"20px"}}>Sempre 12 posts. Posts de campanha preenchem primeiro, o restante é conteúdo regular.</p>

      <div style={{background:C.card,borderRadius:"10px",padding:"16px",border:`1px solid ${C.border}`,marginBottom:"14px"}}>
        <Input label="Mês de postagem" type="month" value={genF.month} onChange={v=>setGenF(f=>({...f,month:v}))} s={{marginBottom:0}}/>
        {dd&&<div style={{marginTop:"10px",fontSize:"11px",color:C.muted,textAlign:"center"}}>📦 Entrega até <strong style={{color:C.orange}}>{fmtF(dd)}</strong> · Seg/Qua/Sex</div>}
      </div>

      {/* Breakdown */}
      <div style={{background:C.card,borderRadius:"10px",padding:"16px",border:`1px solid ${C.border}`,marginBottom:"14px"}}>
        <div style={{fontSize:"13px",fontWeight:700,color:C.white,marginBottom:"10px"}}>12 posts = {campPostCount} campanha + {regCount} regulares</div>
        <div style={{display:"flex",gap:"4px",height:"8px",borderRadius:"4px",overflow:"hidden",marginBottom:"12px",background:C.border}}>
          <div style={{width:`${(campPostCount/12)*100}%`,background:C.orange,borderRadius:"4px"}}/>
          <div style={{width:`${(regCount/12)*100}%`,background:C.white+"40",borderRadius:"4px"}}/>
        </div>

        {mc.length>0&&<div style={{marginBottom:"8px"}}><div style={{fontSize:"10px",fontWeight:600,color:C.orange,marginBottom:"4px"}}>📣 Posts de campanha ({campPostCount})</div>
          {mc.map(c=><div key={c.id} style={{marginBottom:"6px"}}><div style={{fontSize:"11px",color:C.text,fontWeight:600}}>{c.name} <Tag color={c.status==="aprovada"?C.lime:C.yellow} s={{fontSize:"8px"}}>{c.status}</Tag></div>
            {(c.postPlan||[]).map((pp,i)=>{const f=FORMATS.find(x=>x.id===pp.formatId);return <div key={i} style={{fontSize:"10px",color:C.dim,marginLeft:"12px"}}>• {f?.icon} {pp.desc}</div>;})}
          </div>)}
        </div>}

        <div style={{fontSize:"10px",fontWeight:600,color:C.sub}}>📝 Posts regulares ({regCount}) — distribuídos entre produtos e franquias</div>
      </div>

      {/* Dates */}
      {preview.length>0&&<div style={{background:C.card,borderRadius:"10px",padding:"14px",border:`1px solid ${C.border}`,marginBottom:"14px"}}>
        <div style={{fontSize:"11px",fontWeight:600,color:C.white,marginBottom:"6px"}}>Datas (Seg/Qua/Sex)</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"3px"}}>{preview.map((d,i)=><Tag key={i} color={i<campPostCount?C.orange:C.white} s={{fontSize:"9px"}}>{["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"][d.getDay()]} {fmt(d)}</Tag>)}</div>
        <div style={{marginTop:"6px",fontSize:"9px",color:C.dim}}>🟠 = campanha · ⚪ = regular</div>
      </div>}

      <Btn onClick={generate} disabled={!co.products.length||!genF.month} s={{width:"100%",padding:"12px",textAlign:"center"}}>⚡ Gerar 12 Roteiros para {ml}</Btn>
    </div>);};

  // === KANBAN ===
  const PageKanban=()=>{if(!co?.kanban)return null;const k=co.kanban;const cols=co.kCols||DKCOLS;
    const hdS=(e,cid,col)=>{dragRef.current={id:cid,from:col};e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("text/plain",cid);e.currentTarget.style.opacity="0.4";};
    const hdE=e=>{dragRef.current=null;e.currentTarget.style.opacity="1";};
    const hdD=(e,col)=>{e.preventDefault();const d=dragRef.current;if(d&&d.from!==col)moveCard(d.id,d.from,col);dragRef.current=null;};
    return(<div style={{padding:"14px",height:"calc(100vh - 14px)",display:"flex",flexDirection:"column"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}><div><h2 style={{fontSize:"15px",fontWeight:600,color:C.white}}>Demandas</h2><p style={{fontSize:"10px",color:C.muted}}>Arraste entre colunas · Clique para editar</p></div><div style={{display:"flex",gap:"6px"}}><Btn v="secondary" onClick={()=>{setColF({label:"",sub:""});setModal("new-col")}} s={{fontSize:"10px",padding:"5px 10px"}}>+ Coluna</Btn><Btn v="secondary" onClick={()=>setPage("gerar")} s={{fontSize:"10px",padding:"5px 10px"}}>⚡ Gerar</Btn></div></div>
      <div style={{display:"flex",gap:"8px",flex:1,overflowX:"auto"}}>
        {cols.map(col=>{const cards=k[col.id]||[];return(
          <div key={col.id} onDragOver={e=>{e.preventDefault();e.dataTransfer.dropEffect="move";e.currentTarget.style.background=C.card2;e.currentTarget.style.borderColor=C.dim;}} onDragLeave={e=>{e.currentTarget.style.background=C.card;e.currentTarget.style.borderColor=C.border;}} onDrop={e=>{e.currentTarget.style.background=C.card;e.currentTarget.style.borderColor=C.border;hdD(e,col.id);}}
            style={{flex:"1 1 0",minWidth:"180px",background:C.card,borderRadius:"10px",display:"flex",flexDirection:"column",border:`1px solid ${C.border}`,transition:"background .1s"}}>
            <div style={{padding:"10px 12px 8px",borderBottom:`1px solid ${C.border}`}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:"11px",fontWeight:600,color:C.white}}>{col.label}</span><span style={{fontSize:"10px",color:C.sub,background:C.bg,borderRadius:"6px",padding:"1px 6px"}}>{cards.length}</span></div>{col.sub&&<div style={{fontSize:"9px",color:C.dim}}>{col.sub}</div>}</div>
            <div style={{flex:1,overflowY:"auto",padding:"5px",display:"flex",flexDirection:"column",gap:"4px"}}>
              {cards.map(card=>{const stg=card.stage;const format=card.format||FORMATS.find(f=>f.id===card.franchise?.formatId);return(
                <div key={card.id} draggable="true" onDragStart={e=>hdS(e,card.id,col.id)} onDragEnd={hdE} onClick={()=>{setMData({card,col:col.id});setModal("card-detail");}}
                  style={{background:C.bg,borderRadius:"8px",border:`1px solid ${C.border}`,padding:"8px",cursor:"grab",borderLeft:`3px solid ${stg?.color||C.dim}`,userSelect:"none"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.dim} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                  <div style={{fontSize:"10px",fontWeight:600,color:C.text,marginBottom:"3px",lineHeight:1.3}}>{card.title}</div>
                  <div style={{display:"flex",gap:"2px",flexWrap:"wrap",marginBottom:"2px"}}><Tag color={stg?.color} s={{fontSize:"8px"}}>{stg?.obj}</Tag>{format&&<Tag s={{fontSize:"8px"}}>{format.icon}</Tag>}{card.isCampaignPost&&<Tag color={C.orange} s={{fontSize:"8px"}}>📣</Tag>}</div>
                  {card.postDate&&<div style={{fontSize:"9px",color:C.dim}}>📅 {fmt(card.postDate)}</div>}
                </div>
              );})}
              {!cards.length&&<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:C.dim+"40",fontSize:"10px"}}>Arraste aqui</div>}
            </div>
          </div>
        );})}
      </div>
    </div>);};

  // === CARD MODAL ===
  const CardModal=()=>{if(!mData)return null;const{card,col}=mData;const[script,setScript]=useState(card.script||"");const[title,setTitle]=useState(card.title||"");const stg=card.stage;const cols=co?.kCols||DKCOLS;const format=card.format||FORMATS.find(f=>f.id===card.franchise?.formatId);
    const save=()=>{updateCard(card.id,{script,title});setModal(null);setMData(null);};
    return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:1000,backdropFilter:"blur(6px)",paddingTop:"32px",overflowY:"auto"}} onClick={save}>
      <div style={{background:C.card,borderRadius:"12px",width:"720px",maxWidth:"94vw",border:`1px solid ${C.border}`,boxShadow:"0 24px 48px rgba(0,0,0,.6)",marginBottom:"32px"}} onClick={e=>e.stopPropagation()}>
        <div style={{height:"4px",borderRadius:"12px 12px 0 0",background:stg?.color||C.dim}}/>
        <div style={{padding:"20px 24px 0"}}>
          <input value={title} onChange={e=>setTitle(e.target.value)} style={{width:"100%",background:"transparent",border:"none",outline:"none",fontSize:"16px",fontWeight:700,color:C.white,fontFamily:ff,padding:0,marginBottom:"10px",boxSizing:"border-box"}}/>
          <div style={{display:"flex",gap:"4px",flexWrap:"wrap",marginBottom:"10px"}}><Tag color={stg?.color}>{stg?.label} ({stg?.obj})</Tag><Tag>📦 {card.product?.name}</Tag>{card.franchise&&<Tag>{card.franchise.icon} {card.franchise.name}</Tag>}{format&&<Tag>{format.icon} {format.label}</Tag>}{card.postDate&&<Tag color={C.white}>📅 {fmtF(card.postDate)}</Tag>}{card.deliveryDate&&<Tag color={C.orange}>📦 {fmtF(card.deliveryDate)}</Tag>}{card.isCampaignPost&&<Tag color={C.orange}>📣 Campanha</Tag>}{card.campaigns?.map(n=><Tag key={n} color={C.orange} s={{fontSize:"9px"}}>{n}</Tag>)}</div>
          <div style={{display:"flex",alignItems:"center",gap:"4px",marginBottom:"12px",flexWrap:"wrap"}}><span style={{fontSize:"10px",color:C.sub}}>Mover:</span>{cols.map(c2=><button key={c2.id} onClick={()=>{if(c2.id!==col){moveCard(card.id,col,c2.id);setMData({card,col:c2.id})}}} style={{fontSize:"9px",padding:"3px 8px",borderRadius:"6px",border:`1px solid ${c2.id===col?C.white:C.border}`,background:c2.id===col?C.white:"transparent",color:c2.id===col?C.bg:C.sub,cursor:"pointer",fontFamily:ff}}>{c2.label}</button>)}</div>
        </div>
        <div style={{height:"1px",background:C.border}}/>
        <div style={{padding:"14px 24px"}}><textarea value={script} onChange={e=>setScript(e.target.value)} style={{width:"100%",minHeight:"380px",padding:"16px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:"8px",color:C.text,fontSize:"12px",fontFamily:"'Courier New',monospace",lineHeight:1.6,resize:"vertical",outline:"none",boxSizing:"border-box"}} onFocus={e=>e.currentTarget.style.borderColor=C.sub} onBlur={e=>e.currentTarget.style.borderColor=C.border}/></div>
        <div style={{padding:"0 24px 16px",display:"flex",justifyContent:"space-between"}}><Btn v="danger" onClick={()=>{if(confirm("Excluir?")){deleteCard(card.id);setModal(null);setMData(null)}}} s={{fontSize:"11px",padding:"5px 12px"}}>Excluir</Btn><div style={{display:"flex",gap:"6px"}}><Btn v="ghost" onClick={save}>Fechar</Btn><Btn onClick={save}>Salvar</Btn></div></div>
      </div>
    </div>);};

  // === MODALS ===
  const Modals=()=>{if(!modal||modal==="card-detail")return null;const box={background:C.card,borderRadius:"12px",padding:"24px",width:"560px",maxWidth:"92vw",border:`1px solid ${C.border}`,maxHeight:"88vh",overflowY:"auto",boxShadow:"0 24px 48px rgba(0,0,0,.6)"};return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,backdropFilter:"blur(6px)"}} onClick={()=>setModal(null)}>
      <div style={box} onClick={e=>e.stopPropagation()}>
        {modal==="new-co"&&(<><h3 style={{fontSize:"15px",fontWeight:600,color:C.white,marginBottom:"14px"}}>Nova Empresa</h3><Input label="Nome" value={cF.name} onChange={v=>setCF(f=>({...f,name:v}))}/><Input label="Descrição" value={cF.desc} onChange={v=>setCF(f=>({...f,desc:v}))} multiline/><div style={{display:"flex",gap:"6px",justifyContent:"flex-end"}}><Btn v="ghost" onClick={()=>setModal(null)}>Cancelar</Btn><Btn onClick={()=>{if(!cF.name.trim())return;const n={id:mid(),name:cF.name,desc:cF.desc,icon:cF.icon,products:[],franchises:[],campaigns:[],kCols:[...DKCOLS],kanban:{todo:[],doing:[],review:[],fix:[],done:[]}};setCos(p=>[...p,n]);setModal(null);nav("dash",n.id)}} disabled={!cF.name.trim()}>Criar</Btn></div></>)}
        {modal==="product"&&co&&(<><h3 style={{fontSize:"15px",fontWeight:600,color:C.white,marginBottom:"14px"}}>{eIdx!==null?"Editar":"Novo"} Produto</h3><Input label="Nome" value={pF.name} onChange={v=>setPF(f=>({...f,name:v}))}/><Input label="Descrição" value={pF.desc} onChange={v=>setPF(f=>({...f,desc:v}))} multiline/><div style={{marginBottom:"14px"}}><label style={{fontSize:"11px",color:C.sub}}>Prioridade</label><div style={{display:"flex",gap:"4px",marginTop:"4px"}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setPF(f=>({...f,priority:n}))} style={{width:"32px",height:"32px",borderRadius:"6px",border:`1px solid ${n<=pF.priority?C.white:C.border}`,background:n<=pF.priority?C.white:"transparent",color:n<=pF.priority?C.bg:C.dim,fontWeight:600,cursor:"pointer"}}>{n}</button>)}</div></div><div style={{display:"flex",gap:"6px",justifyContent:"flex-end"}}><Btn v="ghost" onClick={()=>setModal(null)}>Cancelar</Btn><Btn onClick={()=>{if(!pF.name.trim())return;if(eIdx!==null){const ps=[...co.products];ps[eIdx]={...ps[eIdx],...pF};up(co.id,{products:ps})}else up(co.id,{products:[...co.products,{...pF,id:mid()}]});setModal(null)}} disabled={!pF.name.trim()}>{eIdx!==null?"Salvar":"Adicionar"}</Btn></div></>)}
        {modal==="franchise"&&co&&(<><h3 style={{fontSize:"15px",fontWeight:600,color:C.white,marginBottom:"14px"}}>{eIdx!==null?"Editar":"Nova"} Franquia</h3><div style={{display:"grid",gridTemplateColumns:"56px 1fr",gap:"8px"}}><div><label style={{fontSize:"11px",color:C.sub}}>Ícone</label><input value={frF.icon} onChange={e=>setFrF(f=>({...f,icon:e.target.value}))} maxLength={2} style={{width:"100%",padding:"8px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:"6px",color:C.text,fontSize:"20px",textAlign:"center",outline:"none",boxSizing:"border-box",marginTop:"4px"}}/></div><Input label="Nome" value={frF.name} onChange={v=>setFrF(f=>({...f,name:v}))}/></div><Input label="Como funciona" value={frF.desc} onChange={v=>setFrF(f=>({...f,desc:v}))} multiline/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"14px"}}><div><label style={{fontSize:"11px",color:C.sub,display:"block",marginBottom:"4px"}}>Formato</label><div style={{display:"flex",gap:"3px",flexWrap:"wrap"}}>{FORMATS.map(f=><Tag key={f.id} color={frF.formatId===f.id?C.white:C.dim} onClick={()=>setFrF(x=>({...x,formatId:f.id}))} s={{cursor:"pointer",border:`1px solid ${frF.formatId===f.id?C.white:C.border}`,padding:"4px 8px"}}>{f.icon} {f.label}</Tag>)}</div></div><div><label style={{fontSize:"11px",color:C.sub,display:"block",marginBottom:"4px"}}>Tipo</label><div style={{display:"flex",gap:"3px",flexWrap:"wrap"}}>{TYPES.map(t=><Tag key={t.id} color={frF.typeId===t.id?C.white:C.dim} onClick={()=>setFrF(x=>({...x,typeId:t.id}))} s={{cursor:"pointer",border:`1px solid ${frF.typeId===t.id?C.white:C.border}`,padding:"4px 8px"}}>{t.icon} {t.label}</Tag>)}</div></div></div><div style={{marginBottom:"14px"}}><label style={{fontSize:"11px",color:C.sub,display:"block",marginBottom:"4px"}}>Etapas</label><div style={{display:"flex",gap:"3px",flexWrap:"wrap"}}>{STAGES.map(s=><Tag key={s.id} color={(frF.stageIds||[]).includes(s.id)?s.color:C.dim} onClick={()=>setFrF(f=>({...f,stageIds:(f.stageIds||[]).includes(s.id)?(f.stageIds||[]).filter(x=>x!==s.id):[...(f.stageIds||[]),s.id]}))} s={{cursor:"pointer",border:`1px solid ${(frF.stageIds||[]).includes(s.id)?s.color:C.border}`,padding:"4px 8px"}}>{s.obj}</Tag>)}</div></div><Input label="Objetivo" value={frF.obj} onChange={v=>setFrF(f=>({...f,obj:v}))} placeholder="Educar, Conhecer..."/><div style={{display:"flex",gap:"6px",justifyContent:"flex-end"}}><Btn v="ghost" onClick={()=>setModal(null)}>Cancelar</Btn><Btn onClick={()=>{if(!frF.name.trim())return;if(eIdx!==null){const fs=[...co.franchises];fs[eIdx]={...fs[eIdx],...frF};up(co.id,{franchises:fs})}else up(co.id,{franchises:[...co.franchises,{...frF,id:`fr-${mid()}`}]});setModal(null)}} disabled={!frF.name.trim()}>{eIdx!==null?"Salvar":"Criar"}</Btn></div></>)}

        {modal==="campaign"&&co&&(<><h3 style={{fontSize:"15px",fontWeight:600,color:C.white,marginBottom:"14px"}}>{eIdx!==null?"Editar":"Nova"} Campanha</h3>
          <Input label="Nome" value={campF.name} onChange={v=>setCampF(f=>({...f,name:v}))}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"8px"}}><Input label="Início" type="date" value={campF.start} onChange={v=>setCampF(f=>({...f,start:v}))}/><Input label="Fim" type="date" value={campF.end} onChange={v=>setCampF(f=>({...f,end:v}))}/><div><label style={{fontSize:"11px",color:C.sub,display:"block",marginBottom:"5px"}}>Status</label><div style={{display:"flex",gap:"4px"}}><Tag color={campF.status==="sugerida"?C.yellow:C.dim} onClick={()=>setCampF(f=>({...f,status:"sugerida"}))} s={{cursor:"pointer",border:`1px solid ${campF.status==="sugerida"?C.yellow:C.border}`,padding:"6px 10px"}}}>⏳ Sugerida</Tag><Tag color={campF.status==="aprovada"?C.lime:C.dim} onClick={()=>setCampF(f=>({...f,status:"aprovada"}))} s={{cursor:"pointer",border:`1px solid ${campF.status==="aprovada"?C.lime:C.border}`,padding:"6px 10px"}}}>✓ Aprovada</Tag></div></div></div>
          <div style={{marginBottom:"14px"}}><label style={{fontSize:"11px",color:C.sub}}>Prioridade</label><div style={{display:"flex",gap:"4px",marginTop:"4px"}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setCampF(f=>({...f,priority:n}))} style={{width:"30px",height:"30px",borderRadius:"6px",border:`1px solid ${n<=campF.priority?C.white:C.border}`,background:n<=campF.priority?C.white:"transparent",color:n<=campF.priority?C.bg:C.dim,fontWeight:600,cursor:"pointer",fontSize:"12px"}}>{n}</button>)}</div></div>
          <div style={{marginBottom:"14px"}}><label style={{fontSize:"11px",color:C.sub,display:"block",marginBottom:"6px"}}>Benefícios</label>
            {(campF.benefits||[]).map((ben,bi)=>{const bt=BTYPES.find(t=>t.id===ben.type);return(<div key={bi} style={{background:C.bg,borderRadius:"8px",padding:"8px",border:`1px solid ${C.border}`,marginBottom:"4px"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}><span style={{fontSize:"11px",fontWeight:600,color:C.text}}>{bt?.icon} {bt?.label}</span><button onClick={()=>setCampF(f=>({...f,benefits:f.benefits.filter((_,j)=>j!==bi)}))} style={{background:"none",border:"none",color:C.dim,cursor:"pointer"}}>×</button></div>{bt?.fields.map(field=>(<div key={field.k} style={{marginBottom:"3px"}}><label style={{fontSize:"10px",color:C.dim}}>{field.l}</label><input value={ben[field.k]||""} onChange={e=>{const nb=[...campF.benefits];nb[bi]={...nb[bi],[field.k]:field.t==="number"?Number(e.target.value):e.target.value};setCampF(f=>({...f,benefits:nb}));}} type={field.t||"text"} placeholder={field.p} style={{width:"100%",padding:"5px 8px",background:C.card,border:`1px solid ${C.border}`,borderRadius:"6px",color:C.text,fontSize:"12px",fontFamily:ff,outline:"none",boxSizing:"border-box",marginTop:"2px"}}/></div>))}</div>);})}
            <div style={{display:"flex",gap:"3px",flexWrap:"wrap"}}>{BTYPES.map(bt=>(<button key={bt.id} onClick={()=>{const nb={type:bt.id};bt.fields.forEach(f=>{nb[f.k]="";});setCampF(f=>({...f,benefits:[...(f.benefits||[]),nb]}));}} style={{fontSize:"10px",padding:"3px 8px",borderRadius:"6px",border:`1px solid ${C.border}`,background:C.card2,color:C.sub,cursor:"pointer",fontFamily:ff}}>{bt.icon} +{bt.label}</button>))}</div>
          </div>
          <div style={{marginBottom:"14px"}}><label style={{fontSize:"11px",color:C.sub,display:"block",marginBottom:"4px"}}>Produtos vinculados</label><div style={{display:"flex",gap:"3px",flexWrap:"wrap"}}>{co.products.map(p=><Tag key={p.id} color={(campF.productIds||[]).includes(p.id)?C.cyan:C.dim} onClick={()=>setCampF(f=>({...f,productIds:(f.productIds||[]).includes(p.id)?(f.productIds||[]).filter(x=>x!==p.id):[...(f.productIds||[]),p.id]}))} s={{cursor:"pointer",border:`1px solid ${(campF.productIds||[]).includes(p.id)?C.cyan:C.border}`,padding:"4px 8px"}}>{p.name}</Tag>)}</div></div>

          {/* Auto-generate posts button */}
          <div style={{marginBottom:"14px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"}}><label style={{fontSize:"11px",color:C.sub}}>📋 Posts da campanha</label><Btn v="secondary" onClick={()=>{const posts=suggestCampaignPosts({...campF},co.products);setCampF(f=>({...f,postPlan:posts}));}} s={{fontSize:"10px",padding:"3px 10px"}}>🤖 Gerar sugestão</Btn></div>
            {(campF.postPlan||[]).map((pp,pi)=>{const f=FORMATS.find(x=>x.id===pp.formatId);return(<div key={pi} style={{background:C.bg,borderRadius:"6px",padding:"6px 8px",border:`1px solid ${C.border}`,marginBottom:"3px",display:"flex",gap:"6px",alignItems:"center"}}>
              <div style={{display:"flex",gap:"2px"}}>{FORMATS.map(fm=><button key={fm.id} onClick={()=>{const np=[...campF.postPlan];np[pi]={...np[pi],formatId:fm.id};setCampF(f=>({...f,postPlan:np}));}} style={{fontSize:"11px",padding:"1px 3px",borderRadius:"3px",border:`1px solid ${pp.formatId===fm.id?C.white:C.border}`,background:pp.formatId===fm.id?"rgba(255,255,255,.1)":"transparent",cursor:"pointer"}} title={fm.label}>{fm.icon}</button>)}</div>
              <input value={pp.desc} onChange={e=>{const np=[...campF.postPlan];np[pi]={...np[pi],desc:e.target.value};setCampF(f=>({...f,postPlan:np}));}} style={{flex:1,padding:"4px 8px",background:C.card,border:`1px solid ${C.border}`,borderRadius:"6px",color:C.text,fontSize:"11px",fontFamily:ff,outline:"none",boxSizing:"border-box"}}/>
              <button onClick={()=>setCampF(f=>({...f,postPlan:f.postPlan.filter((_,j)=>j!==pi)}))} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",fontSize:"12px"}}>×</button>
            </div>);})}
            <button onClick={()=>setCampF(f=>({...f,postPlan:[...(f.postPlan||[]),{desc:"",formatId:"reels",typeId:"promocional"}]}))} style={{fontSize:"10px",padding:"6px",borderRadius:"6px",border:`1px dashed ${C.border}`,background:"transparent",color:C.sub,cursor:"pointer",fontFamily:ff,width:"100%",marginTop:"4px"}}>+ Post manual</button>
          </div>

          <Input label="Observações" value={campF.desc} onChange={v=>setCampF(f=>({...f,desc:v}))} multiline/>
          <div style={{display:"flex",gap:"6px",justifyContent:"flex-end"}}><Btn v="ghost" onClick={()=>setModal(null)}>Cancelar</Btn><Btn onClick={()=>{if(!campF.name.trim())return;const cs=[...(co.campaigns||[])];if(eIdx!==null)cs[eIdx]={...cs[eIdx],...campF};else cs.push({...campF,id:`cm-${mid()}`});up(co.id,{campaigns:cs});setModal(null)}} disabled={!campF.name.trim()}>{eIdx!==null?"Salvar":"Criar"}</Btn></div>
        </>)}

        {modal==="new-col"&&(<><h3 style={{fontSize:"15px",fontWeight:600,color:C.white,marginBottom:"14px"}}>Nova Coluna</h3><Input label="Nome" value={colF.label} onChange={v=>setColF(f=>({...f,label:v}))}/><Input label="Subtítulo" value={colF.sub} onChange={v=>setColF(f=>({...f,sub:v}))}/><div style={{display:"flex",gap:"6px",justifyContent:"flex-end"}}><Btn v="ghost" onClick={()=>setModal(null)}>Cancelar</Btn><Btn onClick={addCol} disabled={!colF.label.trim()}>Criar</Btn></div></>)}
      </div>
    </div>
  );};

  const PageHome=()=>(<div style={{padding:"40px",maxWidth:"720px"}}><h1 style={{fontSize:"28px",fontWeight:700,color:C.white,marginBottom:"4px"}}>Guia Editorial</h1><p style={{color:C.muted,fontSize:"14px",marginBottom:"32px"}}>Selecione uma empresa ou crie uma nova.</p><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:"12px"}}>{cos.map(c=>(<div key={c.id} onClick={()=>nav("dash",c.id)} style={{background:C.card,borderRadius:"10px",padding:"20px",border:`1px solid ${C.border}`,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.dim} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}><div style={{display:"flex",alignItems:"center",gap:"10px"}}><span style={{fontSize:"24px"}}>{c.icon}</span><div><div style={{fontWeight:600,fontSize:"14px",color:C.white}}>{c.name}</div><div style={{fontSize:"11px",color:C.muted}}>{c.products.length} prod · {(c.campaigns||[]).length} camp</div></div></div></div>))}</div></div>);

  return(<div style={{fontFamily:ff,background:C.bg,color:C.text,minHeight:"100vh",display:"flex"}}>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
    <Sidebar/>
    <div style={{flex:1,overflowY:"auto",height:"100vh"}}>
      {(!co||page==="home")&&<PageHome/>}
      {co&&page==="dash"&&<PageDash/>}
      {co&&page==="cliente"&&<PageCliente/>}
      {co&&page==="conteudos"&&<PageConteudos/>}
      {co&&page==="campanhas"&&<PageCamp/>}
      {co&&page==="gerar"&&<PageGerar/>}
      {co&&page==="demandas"&&<PageKanban/>}
    </div>
    <Modals/>
    {modal==="card-detail"&&<CardModal/>}
  </div>);
}
