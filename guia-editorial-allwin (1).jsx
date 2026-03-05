import { useState, useRef } from "react";

const C={bg:"#0e0e10",side:"#141416",card:"#18181b",card2:"#1f1f23",border:"#27272a",hover:"#2a2a2e",white:"#fafafa",text:"#e4e4e7",sub:"#a1a1aa",muted:"#71717a",dim:"#52525b",lime:"#bbdb4e",cyan:"#09add5",yellow:"#fef009",orange:"#fe6b21",purple:"#c501ff"};
const ff="'Poppins',sans-serif";

const mid=()=>`${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
const pick=a=>a[Math.floor(Math.random()*a.length)];

const fmt=d=>new Date(d).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"});
const fmtF=d=>new Date(d).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"});
const fmtM=d=>new Date(d).toLocaleDateString("pt-BR",{month:"long",year:"numeric"});

function pDates(s,n){
const st=new Date(s+"T12:00:00"),vd=[1,3,5],ds=[];
let c=new Date(st);
while(!vd.includes(c.getDay()))c.setDate(c.getDate()+1);
while(ds.length<n){
if(vd.includes(c.getDay()))ds.push(new Date(c));
c.setDate(c.getDate()+1);
}
return ds;
}

function dDate(pd){
const d=new Date(pd),m=d.getMonth(),y=d.getFullYear();
return m===0?new Date(y-1,11,20):new Date(y,m-1,20);
}

const FORMATS=[
{id:"reels",label:"Reels",icon:"🎬"},
{id:"carrossel",label:"Carrossel",icon:"📚"},
{id:"estatico",label:"Estático",icon:"🖼️"},
{id:"stories",label:"Stories",icon:"📱"}
];

const TYPES=[
{id:"educativo",label:"Educativo",icon:"📖"},
{id:"entretenimento",label:"Entretenimento",icon:"😂"},
{id:"promocional",label:"Promocional",icon:"🔥"},
{id:"autoridade",label:"Autoridade",icon:"🏆"},
{id:"prova-social",label:"Prova Social",icon:"⭐"},
{id:"institucional",label:"Institucional",icon:"🏛️"},
{id:"consultivo",label:"Consultivo",icon:"🧭"}
];

const STAGES=[
{id:"descoberta",label:"Descoberta",color:C.lime,tc:"#000",obj:"Conhecer",strat:"Atrair quem não conhece. Conteúdo leve e curioso."},
{id:"consideracao",label:"Consideração",color:C.cyan,tc:"#fff",obj:"Educar",strat:"Mostrar autoridade e diferenciais."},
{id:"compra",label:"Compra",color:C.yellow,tc:"#000",obj:"Converter",strat:"Cliente decidiu. Facilitar e criar urgência."},
{id:"retencao",label:"Retenção",color:C.orange,tc:"#fff",obj:"Manter",strat:"Manter engajado. Valor contínuo."},
{id:"expansao",label:"Expansão",color:C.purple,tc:"#fff",obj:"Indicar",strat:"Transformar em promotor."}
];

const DKCOLS=[
{id:"todo",label:"A Fazer",sub:"Prioridade"},
{id:"doing",label:"Em Produção",sub:"Designer"},
{id:"review",label:"Em Análise",sub:"Aprovação"},
{id:"fix",label:"Correções",sub:"Ajustes"},
{id:"done",label:"Aprovados",sub:"Pronto"}
];

const ICONS=["🏢","🔧","🏥","🍽️","💼","🎓","🏋️","✈️","🛒","💅","🏠","📱","🐾","🌿","⚖️","🎨","🚗","💻"];

const BTYPES=[
{id:"desconto",label:"Desconto",icon:"💰",fields:[{k:"percent",l:"% desconto",t:"number",p:"30"},{k:"on",l:"Em quê?",p:"revisão"}]},
{id:"brinde",label:"Brinde",icon:"🎁",fields:[{k:"what",l:"O que ganha?",p:"Check-up"},{k:"condition",l:"Condição",p:"Na troca de óleo"}]},
{id:"cashback",label:"Cashback",icon:"💳",fields:[{k:"percent",l:"%",t:"number",p:"10"},{k:"who",l:"Para quem?",p:"Pai"}]},
{id:"sorteio",label:"Sorteio",icon:"🎰",fields:[{k:"what",l:"Prêmio",p:"Prêmios"},{k:"rule",l:"Regra",p:"1 número/R$100"}]},
{id:"evento",label:"Evento",icon:"🎉",fields:[{k:"what",l:"O quê?",p:"Pipoca, espaço kids"}]},
{id:"institucional",label:"Institucional",icon:"🏛️",fields:[{k:"message",l:"Mensagem",p:"Celebração..."}]}
];

function benText(bs){
if(!bs?.length)return"";
return bs.map(function(b){
if(b.type==="desconto")return(b.percent||"?")+"% OFF "+(b.on||"");
if(b.type==="brinde")return(b.what||"Brinde")+(b.condition?" ("+b.condition+")":"");
if(b.type==="cashback")return(b.percent||"?")+"% cashback"+(b.who?" - "+b.who:"");
if(b.type==="sorteio")return(b.what||"")+(b.rule?" - "+b.rule:"");
if(b.type==="evento")return b.what||"Evento";
if(b.type==="institucional")return b.message||"Institucional";
return"";
}).filter(Boolean).join(" + ");
}

const Input=({label,value,onChange,placeholder,multiline,type="text",s={}})=>(
<div style={{marginBottom:"14px",...s}}>
{label&&<label style={{display:"block",fontSize:"11px",fontWeight:500,color:C.sub,marginBottom:"5px",fontFamily:ff}}>{label}</label>}
{multiline?
<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={3} style={{width:"100%",padding:"10px 14px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:"8px",color:C.text,fontSize:"13px",fontFamily:ff}}/>:
<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:"10px 14px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:"8px",color:C.text,fontSize:"13px",fontFamily:ff}}/>
}
</div>
);

const Btn=({children,onClick,v="primary",disabled,s={}})=>{
const vs={
primary:{background:C.white,color:C.bg},
secondary:{background:"transparent",color:C.sub,border:`1px solid ${C.border}`},
ghost:{background:"transparent",color:C.dim},
danger:{background:"#dc2626",color:"#fff"}
};

return(
<button
onClick={disabled?undefined:onClick}
style={{
padding:"8px 18px",
borderRadius:"8px",
fontWeight:600,
fontSize:"12px",
fontFamily:ff,
cursor:disabled?"not-allowed":"pointer",
border:"none",
transition:"all .15s",
opacity: disabled ? 0.3 : 1,
...vs[v],
...s
}}>
{children}
</button>
);
};

export default function App(){
const[cos,setCos]=useState([]);
const[page,setPage]=useState("home");
const dragRef=useRef(null);

return(
<div style={{
background:C.bg,
color:C.text,
minHeight:"100vh",
fontFamily:ff,
padding:"40px"
}}>
<h1>Guia Editorial</h1>
<p>Sistema carregado com sucesso.</p>
<Btn onClick={()=>alert("Sistema funcionando!")}>
Testar botão
</Btn>
</div>
);
}
