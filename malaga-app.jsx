import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════
   DONNÉES MOCK MALAGA
═══════════════════════════════════════════ */
const ANNONCES_INIT = [
  { id:"ann001", titre:"Belle villa meublée avec jardin", type:"Villa", ville:"Libreville", quartier:"Akanda", prix:350000, vues:842, statut:"disponible", proprio:"Jean Mbadinga", tel:"+24166580032", surface:180, chambres:4, sdb:2, tags:["Meublé","Climatisé","Jardin","Parking","Clôture"], desc:"Superbe villa meublée dans un quartier résidentiel calme d'Akanda. Équipée de climatiseurs dans chaque pièce, grand jardin arborisé, parking sécurisé, clôture haute. Eau, électricité et forage disponibles.", dateCreation:"2026-01-15", photo:"" },
  { id:"ann002", titre:"Appartement 3 pièces climatisé Batterie IV", type:"Appartement", ville:"Libreville", quartier:"Batterie IV", prix:150000, vues:631, statut:"disponible", proprio:"Marie Ondo", tel:"+24177001122", surface:75, chambres:2, sdb:1, tags:["Climatisé","Fibre optique"], desc:"Appartement lumineux au 2ème étage, vue sur mer, bien entretenu. Réseau électrique stable, accès internet fibre.", dateCreation:"2026-01-18", photo:"" },
  { id:"ann003", titre:"Studio moderne avec forage Owendo", type:"Studio", ville:"Libreville", quartier:"Owendo", prix:65000, vues:287, statut:"disponible", proprio:"Paul Nze", tel:"+24166123456", surface:28, chambres:1, sdb:1, tags:["Forage","Meublé"], desc:"Studio meublé idéal pour jeune professionnel ou étudiant. Forage privé, eau courante garantie.", dateCreation:"2026-02-05", photo:"" },
  { id:"ann004", titre:"Maison 5 pièces groupe électrogène Ozouri", type:"Maison", ville:"Port-Gentil", quartier:"Ozouri", prix:200000, vues:445, statut:"réservé", proprio:"Sophie Moukagni", tel:"+24177654321", surface:120, chambres:3, sdb:2, tags:["Groupe électrogène","Forage","Clôture","Gardiennage"], desc:"Grande maison familiale avec groupe électrogène intégré et forage. Quartier sécurisé avec gardien de nuit.", dateCreation:"2026-02-12", photo:"" },
  { id:"ann005", titre:"Villa standing avec piscine Angondjé", type:"Villa", ville:"Libreville", quartier:"Angondjé", prix:600000, vues:1203, statut:"disponible", proprio:"Eric Boulingui", tel:"+24166789012", surface:250, chambres:5, sdb:3, tags:["Piscine","Meublé","Climatisé","Parking","Jardin","Caméras","Gardiennage","Cuisine équipée"], desc:"Villa de prestige dans le quartier huppé d'Angondjé. Piscine privée, système de surveillance, cuisine entièrement équipée, garage 2 voitures.", dateCreation:"2026-02-20", photo:"" },
  { id:"ann006", titre:"Appartement 2 pièces semi-meublé Franceville", type:"Appartement", ville:"Franceville", quartier:"Centre-ville", prix:100000, vues:189, statut:"loué", proprio:"Claire Ibinga", tel:"+24177345678", surface:55, chambres:2, sdb:1, tags:["Parking"], desc:"Appartement calme en centre-ville de Franceville. Proche des commerces et administrations.", dateCreation:"2026-03-01", photo:"" },
  { id:"ann007", titre:"Chambre meublée climatisée PK12", type:"Chambre", ville:"Libreville", quartier:"PK12", prix:35000, vues:94, statut:"disponible", proprio:"Alain Mabika", tel:"+24166445566", surface:15, chambres:1, sdb:0, tags:["Meublé","Climatisé"], desc:"Chambre confortable dans une maison partagée. Salle de bain commune, cuisine disponible.", dateCreation:"2026-03-10", photo:"" },
  { id:"ann008", titre:"Local commercial 80m² centre Libreville", type:"Local commercial", ville:"Libreville", quartier:"Centre-ville", prix:450000, vues:312, statut:"disponible", proprio:"Bernard Ntoutoume", tel:"+24177889900", surface:80, chambres:0, sdb:1, tags:["Climatisé","Fibre optique","Parking"], desc:"Local idéal pour boutique, bureau ou restaurant. Façade sur avenue principale, grande vitrine.", dateCreation:"2026-03-15", photo:"" },
];

const USERS_INIT = [
  { id:"u1", nom:"KOZANGUE Patrick", email:"malaga.gabon@gmail.com", tel:"+24166580032", role:"admin", date:"12 jan 2026", statut:"actif" },
  { id:"u2", nom:"Jean Mbadinga", email:"jean.mbadinga@gmail.com", tel:"+24166111222", role:"proprietaire", date:"15 jan 2026", statut:"actif" },
  { id:"u3", nom:"Marie Ondo", email:"marie.ondo@gmail.com", tel:"+24177334455", role:"proprietaire", date:"18 jan 2026", statut:"actif" },
  { id:"u4", nom:"Alain Ntoutoume", email:"alain.ntout@gmail.com", tel:"+24166998877", role:"locataire", date:"20 jan 2026", statut:"actif" },
  { id:"u5", nom:"Sophie Moukagni", email:"sophie.m@gmail.com", tel:"+24177654321", role:"proprietaire", date:"22 jan 2026", statut:"actif" },
  { id:"u6", nom:"Fatou Diallo", email:"fatou.d@gmail.com", tel:"+24177223344", role:"locataire", date:"25 jan 2026", statut:"actif" },
];

const SIGNALEMENTS_INIT = [
  { id:"sig001", date:"12 juin 2026", type:"Fausse annonce", annonce:"ann003", signalePar:"Alain Ntoutoume", desc:"Le bien ne correspond pas aux photos.", traite:false },
  { id:"sig002", date:"10 juin 2026", type:"Numéro frauduleux", annonce:"ann006", signalePar:"Jean Mbadinga", desc:"Le numéro demande de l'argent à l'avance.", traite:false },
  { id:"sig003", date:"5 juin 2026", type:"Prix abusif", annonce:"ann007", signalePar:"Fatou Diallo", desc:"Le prix réel est différent de l'annonce.", traite:true },
];

const MESSAGES_INIT = [
  { id:"m1", date:"13 juin 2026", nom:"Alain Ntoutoume", tel:"+24166998877", sujet:"Disponibilité villa", msg:"Bonjour, est-ce que la villa à Angondjé est encore disponible ? Je suis intéressé pour une visite ce weekend.", lu:false },
  { id:"m2", date:"11 juin 2026", nom:"Fatou Diallo", tel:"+24177223344", sujet:"Problème technique", msg:"Je n'arrive pas à publier mon annonce depuis hier soir. Pouvez-vous m'aider ?", lu:true },
  { id:"m3", date:"9 juin 2026", nom:"Roger Kombila", tel:"+24166334455", sujet:"Prix négociable ?", msg:"Bonsoir, le loyer de l'appartement Batterie IV est-il négociable pour un contrat de 12 mois ?", lu:false },
];

const VILLES = ["Libreville","Port-Gentil","Franceville","Oyem","Moanda","Mouila","Lambaréné","Tchibanga","Koulamoutou","Makokou"];
const TYPES = ["Maison","Appartement","Studio","Villa","Chambre","Bureau","Local commercial"];
const TAGS_LIST = ["Meublé","Climatisé","Forage","Groupe électrogène","Parking","Jardin","Piscine","Clôture","Gardiennage","Fibre optique","Caméras","Cuisine équipée"];

/* ═══════════════════════════════════════════
   COULEURS MALAGA (drapeau gabonais)
═══════════════════════════════════════════ */
const C = {
  vert:"#009E60", vertDark:"#007A4A", vertLight:"#E8F5EE",
  jaune:"#FCD116", jauneDark:"#E5BC00", jauneLight:"#FFFBDD",
  bleu:"#3A75C4", bleuDark:"#2C5A96", bleuLight:"#EEF4FF",
  blanc:"#ffffff", gris:"#F5F6FA", grisMid:"#E5E7EB",
  texte:"#1A2332", texte2:"#4B5563", texte3:"#9CA3AF",
  rouge:"#EF4444", rougeLight:"#FEE2E2",
  sidebar:"#0F1E2E",
};

/* ═══════════════════════════════════════════
   STYLES GLOBAUX (CSS-in-JS)
═══════════════════════════════════════════ */
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:${C.gris};color:${C.texte};}
  ::-webkit-scrollbar{width:6px;height:6px;}
  ::-webkit-scrollbar-track{background:#f1f1f1;}
  ::-webkit-scrollbar-thumb{background:#ccc;border-radius:3px;}
  input,select,textarea{font-family:inherit;}
  a{text-decoration:none;}
  @keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
  @keyframes slideIn{from{opacity:0;transform:translateX(-12px);}to{opacity:1;transform:none;}}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.5;}}
  @keyframes countUp{from{transform:scale(.8);opacity:0;}to{transform:none;opacity:1;}}
  .fade{animation:fadeIn .3s ease;}
  @keyframes toastIn{from{transform:translateX(100%);opacity:0;}to{transform:none;opacity:1;}}
`;

/* ═══════════════════════════════════════════
   UTILITAIRES
═══════════════════════════════════════════ */
function fmtPrix(p){ return p ? p.toLocaleString("fr-FR")+" FCFA/mois" : "Prix non défini"; }
function fmtNum(n){ return (n||0).toLocaleString("fr-FR"); }
function photoPlaceholder(type){
  const colors={Villa:"#2E7D32",Appartement:"#1565C0",Studio:"#6A1B9A",Maison:"#E65100","Chambre":"#00838F","Bureau":"#37474F","Local commercial":"#4E342E"};
  const icons={Villa:"🏡",Appartement:"🏢",Studio:"🛏️",Maison:"🏠","Chambre":"🚪","Bureau":"🏗️","Local commercial":"🏪"};
  return {bg:colors[type]||"#455A64", icon:icons[type]||"🏠"};
}

function Badge({statut}){
  const map={
    disponible:{bg:"#D1FAE5",color:"#065F46",label:"🟢 Disponible"},
    "réservé":{bg:"#FEF3C7",color:"#92400E",label:"🟡 Réservé"},
    loué:{bg:"#FEE2E2",color:"#991B1B",label:"🔴 Loué"},
    masqué:{bg:"#F3F4F6",color:"#6B7280",label:"⚫ Masqué"},
  };
  const s=map[statut]||{bg:"#F3F4F6",color:"#6B7280",label:statut};
  return <span style={{background:s.bg,color:s.color,padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{s.label}</span>;
}

function RoleBadge({role}){
  const map={
    admin:{bg:"#D1FAE5",color:"#065F46",label:"Admin"},
    proprietaire:{bg:"#DBEAFE",color:"#1E40AF",label:"Propriétaire"},
    locataire:{bg:"#F3F4F6",color:"#374151",label:"Locataire"},
  };
  const s=map[role]||{bg:"#F3F4F6",color:"#374151",label:role};
  return <span style={{background:s.bg,color:s.color,padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:700}}>{s.label}</span>;
}

function Toast({msg,onClose}){
  useEffect(()=>{const t=setTimeout(onClose,3500);return()=>clearTimeout(t);},[]);
  if(!msg)return null;
  return(
    <div style={{position:"fixed",bottom:24,right:24,background:C.texte,color:"#fff",padding:"12px 20px",borderRadius:10,zIndex:9999,fontSize:14,fontWeight:600,boxShadow:"0 4px 20px rgba(0,0,0,.3)",animation:"toastIn .3s ease",maxWidth:320}}>{msg}</div>
  );
}

function Modal({title,msg,onConfirm,onCancel}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:8000}}>
      <div style={{background:C.blanc,borderRadius:14,padding:28,maxWidth:400,width:"90%",boxShadow:"0 20px 60px rgba(0,0,0,.2)"}}>
        <h3 style={{fontSize:17,fontWeight:700,marginBottom:8}}>{title}</h3>
        <p style={{color:C.texte2,fontSize:14,marginBottom:24}}>{msg}</p>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button onClick={onCancel} style={{padding:"8px 18px",borderRadius:8,border:`1px solid ${C.grisMid}`,background:C.blanc,cursor:"pointer",fontWeight:600}}>Annuler</button>
          <button onClick={onConfirm} style={{padding:"8px 18px",borderRadius:8,border:"none",background:C.rouge,color:"#fff",cursor:"pointer",fontWeight:600}}>Confirmer</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PAGE PUBLIQUE
═══════════════════════════════════════════ */
function PagePublique({annonces,onAdminClick}){
  const [search,setSearch]=useState("");
  const [filtreVille,setFiltreVille]=useState("");
  const [filtreType,setFiltreType]=useState("");
  const [filtrePrixMax,setFiltrePrixMax]=useState("");
  const [selectedAnnonce,setSelectedAnnonce]=useState(null);
  const [showContact,setShowContact]=useState(false);
  const [showFiltres,setShowFiltres]=useState(false);
  const [contactForm,setContactForm]=useState({nom:"",tel:"",msg:""});
  const [contactSent,setContactSent]=useState(false);
  const [iaLoading,setIaLoading]=useState(false);
  const [iaReponse,setIaReponse]=useState("");

  const filtered = annonces.filter(a=>{
    const q=search.toLowerCase();
    const matchQ=!q||(a.titre+a.ville+a.quartier+a.type).toLowerCase().includes(q);
    const matchV=!filtreVille||a.ville===filtreVille;
    const matchT=!filtreType||a.type===filtreType;
    const matchP=!filtrePrixMax||a.prix<=parseInt(filtrePrixMax);
    return matchQ&&matchV&&matchT&&matchP&&a.statut!=="masqué";
  });

  async function askIA(question){
    if(!selectedAnnonce||!question.trim())return;
    setIaLoading(true);
    setIaReponse("");
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        model:"claude-sonnet-4-6",max_tokens:1000,
        system:"Tu es un assistant immobilier gabonais de MALAGA. Réponds en français de manière concise et professionnelle.",
        messages:[{role:"user",content:`Annonce: ${selectedAnnonce.titre} à ${selectedAnnonce.quartier}, ${selectedAnnonce.ville}. Prix: ${fmtPrix(selectedAnnonce.prix)}. Description: ${selectedAnnonce.desc}. Question du client: ${question}`}]
      })});
      const d=await r.json();
      setIaReponse(d.content?.map(c=>c.text||"").join("")||"Désolé, réessayez.");
    }catch{setIaReponse("Erreur de connexion. Réessayez.");}
    setIaLoading(false);
  }

  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      {/* HEADER */}
      <header style={{background:`linear-gradient(135deg,${C.vert} 0%,${C.vertDark} 100%)`,padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 12px rgba(0,0,0,.15)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:42,height:42,background:C.jaune,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🏠</div>
          <div>
            <div style={{fontSize:22,fontWeight:900,color:C.jaune,letterSpacing:2}}>MALAGA</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.8)"}}>Votre maison à louer au Gabon</div>
          </div>
        </div>
        <button onClick={onAdminClick} style={{background:"rgba(255,255,255,.15)",color:"#fff",border:"1px solid rgba(255,255,255,.3)",padding:"7px 14px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"}}>⚙️ Admin</button>
      </header>

      {/* HERO */}
      <section style={{background:`linear-gradient(135deg,${C.bleu} 0%,${C.bleuDark} 100%)`,padding:"32px 20px",color:"#fff",textAlign:"center"}}>
        <h1 style={{fontSize:"clamp(20px,4vw,28px)",fontWeight:800,marginBottom:6}}>Trouvez votre logement idéal au Gabon 🇬🇦</h1>
        <p style={{fontSize:13,opacity:.85,marginBottom:20}}>Maisons, appartements, villas, studios — partout au Gabon</p>
        <div style={{maxWidth:560,margin:"0 auto",display:"flex",gap:8,flexWrap:"wrap"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Ville, quartier, type de bien..." style={{flex:1,minWidth:200,padding:"13px 16px",borderRadius:10,border:"none",fontSize:14,outline:"none"}} />
          <button onClick={()=>setShowFiltres(f=>!f)} style={{padding:"13px 16px",background:"rgba(255,255,255,.2)",color:"#fff",border:"1px solid rgba(255,255,255,.4)",borderRadius:10,fontWeight:700,cursor:"pointer",fontSize:13}}>⚙️ Filtres</button>
          <button style={{padding:"13px 20px",background:C.jaune,color:C.texte,borderRadius:10,border:"none",fontWeight:800,cursor:"pointer",fontSize:14}}>🔍 Chercher</button>
        </div>

        {showFiltres&&(
          <div style={{maxWidth:560,margin:"12px auto 0",background:"rgba(255,255,255,.15)",backdropFilter:"blur(8px)",borderRadius:12,padding:16,display:"flex",gap:8,flexWrap:"wrap"}}>
            <select value={filtreVille} onChange={e=>setFiltreVille(e.target.value)} style={{flex:1,minWidth:140,padding:"9px 12px",borderRadius:8,border:"none",fontSize:13}}>
              <option value="">Toutes les villes</option>
              {VILLES.map(v=><option key={v}>{v}</option>)}
            </select>
            <select value={filtreType} onChange={e=>setFiltreType(e.target.value)} style={{flex:1,minWidth:140,padding:"9px 12px",borderRadius:8,border:"none",fontSize:13}}>
              <option value="">Tous les types</option>
              {TYPES.map(t=><option key={t}>{t}</option>)}
            </select>
            <select value={filtrePrixMax} onChange={e=>setFiltrePrixMax(e.target.value)} style={{flex:1,minWidth:140,padding:"9px 12px",borderRadius:8,border:"none",fontSize:13}}>
              <option value="">Budget max</option>
              <option value="50000">50 000 FCFA</option>
              <option value="100000">100 000 FCFA</option>
              <option value="200000">200 000 FCFA</option>
              <option value="400000">400 000 FCFA</option>
              <option value="1000000">1 000 000 FCFA</option>
            </select>
          </div>
        )}
      </section>

      {/* STATS RAPIDES */}
      <div style={{background:C.blanc,borderBottom:`1px solid ${C.grisMid}`,padding:"12px 20px",display:"flex",justifyContent:"center",gap:32,fontSize:13}}>
        {[
          {icon:"🏠",val:annonces.filter(a=>a.statut==="disponible").length,label:"Disponibles"},
          {icon:"🏙️",val:[...new Set(annonces.map(a=>a.ville))].length,label:"Villes"},
          {icon:"👁️",val:annonces.reduce((s,a)=>s+(a.vues||0),0),label:"Consultations"},
        ].map(s=>(
          <div key={s.label} style={{textAlign:"center"}}>
            <div style={{fontWeight:800,fontSize:18,color:C.vert}}>{fmtNum(s.val)}</div>
            <div style={{color:C.texte3,fontSize:11}}>{s.icon} {s.label}</div>
          </div>
        ))}
      </div>

      {/* ANNONCES */}
      <main style={{flex:1,padding:"20px",maxWidth:1100,margin:"0 auto",width:"100%"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <h2 style={{color:C.vert,fontWeight:800,fontSize:18}}>
            {search||filtreVille||filtreType||filtrePrixMax ? `${filtered.length} résultat(s)` : "Annonces récentes"}
          </h2>
          <span style={{fontSize:12,color:C.texte3}}>{filtered.length} annonce(s)</span>
        </div>

        {filtered.length===0?(
          <div style={{textAlign:"center",padding:60,color:C.texte3}}>
            <div style={{fontSize:48}}>🔍</div>
            <div style={{fontWeight:700,marginTop:8}}>Aucune annonce trouvée</div>
            <div style={{fontSize:13,marginTop:4}}>Modifiez vos critères de recherche</div>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
            {filtered.map(a=>{
              const ph=photoPlaceholder(a.type);
              return(
                <div key={a.id} onClick={()=>setSelectedAnnonce(a)} style={{background:C.blanc,borderRadius:14,overflow:"hidden",boxShadow:"0 2px 10px rgba(0,0,0,.08)",cursor:"pointer",transition:"transform .2s,box-shadow .2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,.14)";}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 2px 10px rgba(0,0,0,.08)";}}>
                  <div style={{height:170,background:`linear-gradient(135deg,${ph.bg} 0%,${ph.bg}cc 100%)`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
                    <div style={{fontSize:56,opacity:.6}}>{ph.icon}</div>
                    <div style={{position:"absolute",top:10,right:10}}><Badge statut={a.statut}/></div>
                    <div style={{position:"absolute",bottom:10,left:10,background:"rgba(0,0,0,.4)",color:"#fff",fontSize:11,padding:"3px 8px",borderRadius:6,fontWeight:600}}>{a.type}</div>
                    <div style={{position:"absolute",bottom:10,right:10,background:"rgba(0,0,0,.4)",color:"#fff",fontSize:11,padding:"3px 8px",borderRadius:6}}>👁️ {fmtNum(a.vues)}</div>
                  </div>
                  <div style={{padding:"14px 15px"}}>
                    <h3 style={{fontSize:14,fontWeight:700,marginBottom:5,lineHeight:1.3}}>{a.titre}</h3>
                    <div style={{color:C.vert,fontWeight:800,fontSize:16,marginBottom:4}}>{fmtPrix(a.prix)}</div>
                    <div style={{color:C.texte3,fontSize:12,marginBottom:8}}>📍 {a.quartier} — {a.ville}</div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",fontSize:11}}>
                      {a.chambres>0&&<span style={{background:C.gris,padding:"2px 7px",borderRadius:5,fontWeight:600}}>🛏️ {a.chambres}</span>}
                      {a.surface>0&&<span style={{background:C.gris,padding:"2px 7px",borderRadius:5,fontWeight:600}}>📐 {a.surface}m²</span>}
                      {a.tags.slice(0,2).map(t=><span key={t} style={{background:C.jauneLight,color:C.jauneDark,padding:"2px 7px",borderRadius:5,fontWeight:600}}>✓ {t}</span>)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer style={{background:C.texte,color:"#fff",textAlign:"center",padding:"24px 20px",fontSize:13,lineHeight:2}}>
        <div style={{marginBottom:8,fontSize:16,fontWeight:800,color:C.jaune,letterSpacing:2}}>MALAGA 🇬🇦</div>
        <div>📞 +241 6 65 80 32 &nbsp;|&nbsp; ✉️ malaga.gabon@gmail.com</div>
        <div style={{color:"rgba(255,255,255,.5)",fontSize:11,marginTop:4}}>MALAGA © 2026 — Développé par PC-INFORMATIQUE — Libreville, Gabon</div>
      </footer>

      {/* MODAL DÉTAIL ANNONCE */}
      {selectedAnnonce&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:5000}} onClick={e=>{if(e.target===e.currentTarget){setSelectedAnnonce(null);setIaReponse(""); setShowContact(false);}}}>
          <div style={{background:C.blanc,borderRadius:"18px 18px 0 0",width:"100%",maxWidth:680,maxHeight:"92vh",overflowY:"auto",animation:"fadeIn .25s ease"}}>
            {/* Header modal */}
            <div style={{background:`linear-gradient(135deg,${photoPlaceholder(selectedAnnonce.type).bg} 0%,${photoPlaceholder(selectedAnnonce.type).bg}bb 100%)`,padding:"28px 20px 20px",position:"relative",color:"#fff"}}>
              <button onClick={()=>{setSelectedAnnonce(null);setIaReponse("");setShowContact(false);}} style={{position:"absolute",top:16,right:16,background:"rgba(255,255,255,.25)",border:"none",color:"#fff",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:16,fontWeight:800}}>✕</button>
              <div style={{fontSize:48,marginBottom:8}}>{photoPlaceholder(selectedAnnonce.type).icon}</div>
              <h2 style={{fontSize:18,fontWeight:800,marginBottom:6,paddingRight:40}}>{selectedAnnonce.titre}</h2>
              <div style={{fontSize:22,fontWeight:900,color:C.jaune,marginBottom:4}}>{fmtPrix(selectedAnnonce.prix)}</div>
              <div style={{opacity:.85,fontSize:13}}>📍 {selectedAnnonce.quartier} — {selectedAnnonce.ville}</div>
              <div style={{marginTop:8}}><Badge statut={selectedAnnonce.statut}/></div>
            </div>

            <div style={{padding:20}}>
              {/* Infos */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
                {[{icon:"🛏️",val:`${selectedAnnonce.chambres||0} chambre(s)`,label:"Pièces"},{icon:"🚿",val:`${selectedAnnonce.sdb||0} SDB`,label:"Salle de bain"},{icon:"📐",val:`${selectedAnnonce.surface||"?"}m²`,label:"Surface"}].map(i=>(
                  <div key={i.label} style={{background:C.gris,borderRadius:10,padding:12,textAlign:"center"}}>
                    <div style={{fontSize:20}}>{i.icon}</div>
                    <div style={{fontWeight:700,fontSize:14}}>{i.val}</div>
                    <div style={{color:C.texte3,fontSize:11}}>{i.label}</div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              {selectedAnnonce.tags.length>0&&(
                <div style={{marginBottom:16}}>
                  <div style={{fontWeight:700,marginBottom:8,fontSize:14}}>🏷️ Équipements</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {selectedAnnonce.tags.map(t=><span key={t} style={{background:C.vertLight,color:C.vertDark,padding:"4px 10px",borderRadius:20,fontSize:12,fontWeight:600}}>✓ {t}</span>)}
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedAnnonce.desc&&(
                <div style={{marginBottom:16}}>
                  <div style={{fontWeight:700,marginBottom:8,fontSize:14}}>📝 Description</div>
                  <p style={{color:C.texte2,fontSize:13,lineHeight:1.7,background:C.gris,borderRadius:10,padding:12}}>{selectedAnnonce.desc}</p>
                </div>
              )}

              {/* IA Assistant */}
              <IAAssistant annonce={selectedAnnonce} />

              {/* Contact */}
              {!showContact?(
                <div style={{display:"flex",gap:10,marginTop:16}}>
                  <a href={`tel:${selectedAnnonce.tel}`} style={{flex:1,background:C.vert,color:"#fff",padding:"14px",borderRadius:12,textAlign:"center",fontWeight:700,fontSize:14,textDecoration:"none",display:"block"}}>📞 Appeler</a>
                  <a href={`https://wa.me/${selectedAnnonce.tel.replace(/[\s+]/g,"")}`} target="_blank" style={{flex:1,background:"#25D366",color:"#fff",padding:"14px",borderRadius:12,textAlign:"center",fontWeight:700,fontSize:14,textDecoration:"none",display:"block"}}>💬 WhatsApp</a>
                  <button onClick={()=>setShowContact(true)} style={{flex:1,background:C.bleu,color:"#fff",padding:"14px",borderRadius:12,fontWeight:700,fontSize:14,border:"none",cursor:"pointer"}}>✉️ Formulaire</button>
                </div>
              ):(
                <div style={{background:C.gris,borderRadius:12,padding:16,marginTop:16}}>
                  {contactSent?(
                    <div style={{textAlign:"center",padding:16,color:C.vert}}>
                      <div style={{fontSize:36}}>✅</div>
                      <div style={{fontWeight:700,marginTop:8}}>Message envoyé !</div>
                      <div style={{fontSize:13,color:C.texte2,marginTop:4}}>Le propriétaire vous contactera bientôt.</div>
                    </div>
                  ):(
                    <>
                      <div style={{fontWeight:700,marginBottom:12}}>Envoyer un message</div>
                      <input value={contactForm.nom} onChange={e=>setContactForm(f=>({...f,nom:e.target.value}))} placeholder="Votre nom" style={{width:"100%",padding:"10px 12px",borderRadius:8,border:`1px solid ${C.grisMid}`,marginBottom:8,fontSize:13}} />
                      <input value={contactForm.tel} onChange={e=>setContactForm(f=>({...f,tel:e.target.value}))} placeholder="Votre téléphone" style={{width:"100%",padding:"10px 12px",borderRadius:8,border:`1px solid ${C.grisMid}`,marginBottom:8,fontSize:13}} />
                      <textarea value={contactForm.msg} onChange={e=>setContactForm(f=>({...f,msg:e.target.value}))} rows={3} placeholder="Votre message..." style={{width:"100%",padding:"10px 12px",borderRadius:8,border:`1px solid ${C.grisMid}`,marginBottom:10,fontSize:13,resize:"vertical"}} />
                      <button onClick={()=>{if(contactForm.nom&&contactForm.tel){setContactSent(true);}}} style={{width:"100%",background:C.bleu,color:"#fff",padding:"12px",borderRadius:8,border:"none",fontWeight:700,cursor:"pointer"}}>Envoyer ✉️</button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* IA ASSISTANT INTÉGRÉ DANS LA FICHE */
function IAAssistant({annonce}){
  const [question,setQuestion]=useState("");
  const [reponse,setReponse]=useState("");
  const [loading,setLoading]=useState(false);
  const [expanded,setExpanded]=useState(false);

  async function ask(){
    if(!question.trim())return;
    setLoading(true);setReponse("");
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        model:"claude-sonnet-4-6",max_tokens:600,
        system:"Tu es un assistant immobilier gabonais de la plateforme MALAGA. Réponds en français, de façon concise et utile.",
        messages:[{role:"user",content:`Contexte de l'annonce MALAGA:\n- Titre: ${annonce.titre}\n- Type: ${annonce.type}\n- Ville: ${annonce.ville}, Quartier: ${annonce.quartier}\n- Prix: ${fmtPrix(annonce.prix)}\n- Surface: ${annonce.surface}m², Chambres: ${annonce.chambres}, SDB: ${annonce.sdb}\n- Équipements: ${annonce.tags.join(", ")||"non précisés"}\n- Description: ${annonce.desc||"non fournie"}\n- Statut: ${annonce.statut}\n\nQuestion du visiteur: ${question}`}]
      })});
      const d=await r.json();
      setReponse(d.content?.map(c=>c.text||"").join("")||"Désolé, réessayez.");
    }catch{setReponse("Erreur de connexion. Réessayez.");}
    setLoading(false);
  }

  const quickQs=["Ce bien est-il toujours disponible ?","Quels documents fournir ?","Y a-t-il l'eau courante et l'électricité ?","Le prix est-il négociable ?"];

  return(
    <div style={{background:`linear-gradient(135deg,${C.bleuLight} 0%,#fff 100%)`,borderRadius:12,padding:14,marginBottom:16,border:`1px solid ${C.bleuDark}22`}}>
      <button onClick={()=>setExpanded(e=>!e)} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",cursor:"pointer",width:"100%",textAlign:"left",fontWeight:700,fontSize:14,color:C.bleuDark}}>
        <span style={{fontSize:20}}>🤖</span> Poser une question à l'IA MALAGA <span style={{marginLeft:"auto"}}>{expanded?"▲":"▼"}</span>
      </button>
      {expanded&&(
        <div style={{marginTop:12}}>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
            {quickQs.map(q=><button key={q} onClick={()=>{setQuestion(q);}} style={{fontSize:11,padding:"5px 10px",borderRadius:20,border:`1px solid ${C.bleu}`,background:C.blanc,color:C.bleu,cursor:"pointer",fontWeight:600}}>{q}</button>)}
          </div>
          <div style={{display:"flex",gap:8}}>
            <input value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>e.key==="Enter"&&ask()} placeholder="Votre question sur ce bien..." style={{flex:1,padding:"9px 12px",borderRadius:8,border:`1px solid ${C.grisMid}`,fontSize:13}} />
            <button onClick={ask} disabled={loading} style={{background:C.bleu,color:"#fff",border:"none",padding:"9px 14px",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:13}}>{loading?"⏳":"➤"}</button>
          </div>
          {reponse&&<div style={{marginTop:10,background:C.blanc,borderRadius:8,padding:12,fontSize:13,lineHeight:1.7,color:C.texte,border:`1px solid ${C.grisMid}`}}>{reponse}</div>}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   ADMIN — LOGIN
═══════════════════════════════════════════ */
function LoginAdmin({onLogin,onBack}){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  function login(){
    if(!email||!password){setError("⚠️ Remplissez tous les champs.");return;}
    setLoading(true);
    setTimeout(()=>{
      if(email==="malaga.gabon@gmail.com"&&password.length>=6){
        onLogin({email,nom:"KOZANGUE Patrick"});
      }else{
        setError("❌ Email ou mot de passe incorrect.");
        setLoading(false);
      }
    },800);
  }

  return(
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${C.sidebar} 0%,#1a3550 100%)`,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:C.blanc,borderRadius:18,padding:36,width:"100%",maxWidth:400,boxShadow:"0 24px 64px rgba(0,0,0,.35)"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:40,marginBottom:8}}>🔐</div>
          <div style={{fontSize:24,fontWeight:900,color:C.vert,letterSpacing:2}}>MALAGA</div>
          <div style={{color:C.texte3,fontSize:13,marginTop:2}}>Panneau d'administration 🇬🇦</div>
        </div>
        <div style={{marginBottom:14}}>
          <label style={{fontSize:12,fontWeight:700,color:C.texte2,display:"block",marginBottom:5}}>Email administrateur</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="malaga.gabon@gmail.com" style={{width:"100%",padding:"11px 14px",borderRadius:9,border:`1.5px solid ${C.grisMid}`,fontSize:14,outline:"none"}} />
        </div>
        <div style={{marginBottom:16}}>
          <label style={{fontSize:12,fontWeight:700,color:C.texte2,display:"block",marginBottom:5}}>Mot de passe</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} placeholder="••••••••" style={{width:"100%",padding:"11px 14px",borderRadius:9,border:`1.5px solid ${C.grisMid}`,fontSize:14,outline:"none"}} />
        </div>
        {error&&<div style={{background:C.rougeLight,color:C.rouge,padding:"9px 12px",borderRadius:8,fontSize:13,marginBottom:12,fontWeight:600}}>{error}</div>}
        <button onClick={login} disabled={loading} style={{width:"100%",background:`linear-gradient(135deg,${C.vert} 0%,${C.vertDark} 100%)`,color:"#fff",padding:"13px",borderRadius:10,border:"none",fontWeight:800,fontSize:15,cursor:"pointer",marginBottom:12}}>
          {loading?"⏳ Connexion...":"Se connecter →"}
        </button>
        <button onClick={onBack} style={{width:"100%",background:"none",border:`1px solid ${C.grisMid}`,padding:"11px",borderRadius:10,cursor:"pointer",color:C.texte2,fontSize:13,fontWeight:600}}>← Retour au site</button>
        <div style={{textAlign:"center",marginTop:14,color:C.texte3,fontSize:11}}>Démo : malaga.gabon@gmail.com / (6+ caractères)</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ADMIN — DASHBOARD COMPLET
═══════════════════════════════════════════ */
function AdminDashboard({annonces,setAnnonces,users,setUsers,signalements,setSignalements,messages,setMessages,onLogout,onBack}){
  const [page,setPage]=useState("dashboard");
  const [toast,setToast]=useState("");
  const [modal,setModal]=useState(null);
  const [sidebarOpen,setSidebarOpen]=useState(false);

  function toast_(msg){setToast(msg);setTimeout(()=>setToast(""),3500);}
  function confirm_(title,msg,cb){setModal({title,msg,cb});}

  const navItems=[
    {id:"dashboard",icon:"📊",label:"Tableau de bord"},
    {id:"annonces",icon:"🏠",label:"Annonces",badge:annonces.length},
    {id:"utilisateurs",icon:"👥",label:"Utilisateurs",badge:users.length},
    {id:"signalements",icon:"🚨",label:"Signalements",badge:signalements.filter(s=>!s.traite).length,danger:true},
    {id:"messages",icon:"✉️",label:"Messages",badge:messages.filter(m=>!m.lu).length},
    {id:"stats",icon:"📈",label:"Statistiques"},
    {id:"publier",icon:"➕",label:"Publier une annonce"},
  ];

  return(
    <div style={{display:"flex",minHeight:"100vh",background:C.gris}}>
      {/* SIDEBAR */}
      <aside style={{width:230,background:C.sidebar,display:"flex",flexDirection:"column",position:"fixed",top:0,left:0,height:"100vh",zIndex:200,transform:sidebarOpen?"translateX(0)":"translateX(-100%)",transition:"transform .25s ease"}} className="sidebar">
        <div style={{padding:"20px 16px 12px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:20,fontWeight:900,color:C.jaune,letterSpacing:2}}>MALAGA</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.4)",marginTop:1}}>Administration 🇬🇦</div>
          </div>
          <button onClick={()=>setSidebarOpen(false)} style={{background:"none",border:"none",color:"rgba(255,255,255,.5)",cursor:"pointer",fontSize:18,padding:4}}>✕</button>
        </div>
        <nav style={{flex:1,padding:"8px 10px",overflowY:"auto"}}>
          {navItems.map(n=>(
            <button key={n.id} onClick={()=>{setPage(n.id);setSidebarOpen(false);}} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:9,border:"none",cursor:"pointer",marginBottom:2,fontWeight:600,fontSize:13,textAlign:"left",background:page===n.id?"rgba(0,158,96,.25)":n.danger&&n.badge>0?"rgba(239,68,68,.1)":"none",color:page===n.id?C.jaune:n.danger&&n.badge>0?C.rouge:"rgba(255,255,255,.75)",transition:"background .2s"}}>
              <span style={{fontSize:16}}>{n.icon}</span>
              <span style={{flex:1}}>{n.label}</span>
              {n.badge>0&&<span style={{background:n.danger?C.rouge:C.vert,color:"#fff",fontSize:10,padding:"1px 7px",borderRadius:20,fontWeight:700}}>{n.badge}</span>}
            </button>
          ))}
          <div style={{borderTop:"1px solid rgba(255,255,255,.08)",marginTop:8,paddingTop:8}}>
            <button onClick={onBack} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:9,border:"none",cursor:"pointer",background:"none",color:"rgba(255,255,255,.55)",fontSize:13,fontWeight:600}}>🌐 Voir le site</button>
            <button onClick={()=>confirm_("Déconnexion","Voulez-vous vous déconnecter ?",onLogout)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:9,border:"none",cursor:"pointer",background:"none",color:"rgba(239,68,68,.8)",fontSize:13,fontWeight:600}}>🚪 Déconnexion</button>
          </div>
        </nav>
        <div style={{padding:"12px 16px",borderTop:"1px solid rgba(255,255,255,.08)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,background:C.vert,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#fff"}}>K</div>
            <div>
              <div style={{color:"#fff",fontSize:12,fontWeight:700}}>KOZANGUE Patrick</div>
              <div style={{color:"rgba(255,255,255,.4)",fontSize:10}}>Administrateur</div>
            </div>
          </div>
        </div>
      </aside>

      {/* OVERLAY MOBILE */}
      {sidebarOpen&&<div onClick={()=>setSidebarOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:199}}/>}

      {/* MAIN */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        {/* TOPBAR */}
        <header style={{background:C.blanc,borderBottom:`1px solid ${C.grisMid}`,padding:"12px 20px",display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 4px rgba(0,0,0,.06)"}}>
          <button onClick={()=>setSidebarOpen(true)} style={{background:"none",border:`1px solid ${C.grisMid}`,padding:"7px 10px",borderRadius:8,cursor:"pointer",fontSize:16}}>☰</button>
          <div style={{flex:1,fontWeight:700,fontSize:16}}>{navItems.find(n=>n.id===page)?.label||"MALAGA Admin"}</div>
          <div style={{fontSize:12,color:C.texte3}}>{new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})}</div>
          {signalements.filter(s=>!s.traite).length>0&&(
            <button onClick={()=>setPage("signalements")} style={{background:C.rougeLight,color:C.rouge,border:"none",padding:"6px 12px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer"}}>🚨 {signalements.filter(s=>!s.traite).length} signalement(s)</button>
          )}
        </header>

        {/* PAGES */}
        <div style={{flex:1,padding:20,overflowY:"auto"}}>
          {page==="dashboard"&&<PageDashboard annonces={annonces} users={users} signalements={signalements} messages={messages} setPage={setPage} onAction={(a,fn)=>confirm_(a.title,a.msg,fn)} toast={toast_} setAnnonces={setAnnonces} />}
          {page==="annonces"&&<PageAnnonces annonces={annonces} setAnnonces={setAnnonces} setPage={setPage} toast={toast_} confirm={confirm_} />}
          {page==="utilisateurs"&&<PageUsers users={users} setUsers={setUsers} toast={toast_} confirm={confirm_} />}
          {page==="signalements"&&<PageSignalements signalements={signalements} setSignalements={setSignalements} annonces={annonces} setAnnonces={setAnnonces} toast={toast_} confirm={confirm_} />}
          {page==="messages"&&<PageMessages messages={messages} setMessages={setMessages} toast={toast_} confirm={confirm_} />}
          {page==="stats"&&<PageStats annonces={annonces} users={users} />}
          {page==="publier"&&<PagePublier annonces={annonces} setAnnonces={setAnnonces} setPage={setPage} toast={toast_} />}
        </div>
      </div>

      {toast&&<Toast msg={toast} onClose={()=>setToast("")}/>}
      {modal&&<Modal title={modal.title} msg={modal.msg} onConfirm={()=>{modal.cb();setModal(null);}} onCancel={()=>setModal(null)} />}
    </div>
  );
}

/* ─── COMPOSANTS ADMIN PARTAGÉS ─── */
function Card({children,style={}}){return <div style={{background:C.blanc,borderRadius:14,padding:20,boxShadow:"0 1px 6px rgba(0,0,0,.07)",marginBottom:16,...style}}>{children}</div>;}
function CardHeader({title,action}){return<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}><h3 style={{fontWeight:800,fontSize:15}}>{title}</h3>{action}</div>;}
function Btn({children,onClick,variant="primary",size="md",disabled=false}){
  const styles={primary:{background:`linear-gradient(135deg,${C.vert},${C.vertDark})`,color:"#fff"},danger:{background:C.rouge,color:"#fff"},outline:{background:C.blanc,color:C.texte,border:`1px solid ${C.grisMid}`},ghost:{background:"none",color:C.bleu}};
  const sizes={md:{padding:"8px 16px",fontSize:13},sm:{padding:"5px 10px",fontSize:12}};
  return<button onClick={onClick} disabled={disabled} style={{...styles[variant],...sizes[size],borderRadius:8,border:styles[variant].border||"none",fontWeight:700,cursor:disabled?"not-allowed":"pointer",fontFamily:"inherit",opacity:disabled?.6:1}}>{children}</button>;
}

/* ─── KPI CARD ─── */
function KpiCard({icon,val,label,color,sub}){
  return(
    <div style={{background:C.blanc,borderRadius:14,padding:"18px 20px",boxShadow:"0 1px 6px rgba(0,0,0,.07)",display:"flex",alignItems:"center",gap:14}}>
      <div style={{width:50,height:50,borderRadius:12,background:color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{icon}</div>
      <div>
        <div style={{fontSize:26,fontWeight:900,color:color,lineHeight:1}}>{fmtNum(val)}</div>
        <div style={{fontSize:12,color:C.texte2,fontWeight:600,marginTop:2}}>{label}</div>
        {sub&&<div style={{fontSize:11,color:C.texte3}}>{sub}</div>}
      </div>
    </div>
  );
}

/* ─── PAGE DASHBOARD ─── */
function PageDashboard({annonces,users,signalements,messages,setPage,toast,confirm,setAnnonces}){
  const actives=annonces.filter(a=>a.statut==="disponible").length;
  const totalVues=annonces.reduce((s,a)=>s+(a.vues||0),0);
  const nonLus=messages.filter(m=>!m.lu).length;
  const pending=signalements.filter(s=>!s.traite);

  return(
    <div className="fade">
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14,marginBottom:16}}>
        <KpiCard icon="🏠" val={actives} label="Annonces actives" color={C.vert} sub={`sur ${annonces.length} total`} />
        <KpiCard icon="👥" val={users.length} label="Utilisateurs inscrits" color={C.bleu} />
        <KpiCard icon="👁️" val={totalVues} label="Consultations totales" color={C.jaune} />
        <KpiCard icon="✉️" val={nonLus} label="Messages non lus" color={C.rouge} />
      </div>

      {/* Activité récente */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card>
          <CardHeader title="📋 Dernières annonces" action={<Btn onClick={()=>setPage("annonces")} variant="outline" size="sm">Voir tout</Btn>} />
          {annonces.slice(0,5).map(a=>(
            <div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.grisMid}`}}>
              <div>
                <div style={{fontWeight:700,fontSize:13}}>{a.titre.substring(0,35)}{a.titre.length>35?"…":""}</div>
                <div style={{fontSize:11,color:C.texte3}}>{a.ville} — {fmtPrix(a.prix)}</div>
              </div>
              <Badge statut={a.statut}/>
            </div>
          ))}
        </Card>

        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <Card>
            <CardHeader title="🚨 Signalements urgents" action={<Btn onClick={()=>setPage("signalements")} variant="outline" size="sm">Voir tout</Btn>} />
            {pending.length===0
              ?<div style={{color:C.vert,fontSize:13,fontWeight:600}}>✅ Aucun signalement en attente</div>
              :pending.slice(0,3).map(s=>(
                <div key={s.id} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:`1px solid ${C.grisMid}`,alignItems:"flex-start"}}>
                  <div style={{fontSize:18}}>🚨</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:12,color:C.rouge}}>{s.type}</div>
                    <div style={{fontSize:11,color:C.texte3}}>Par {s.signalePar} — {s.date}</div>
                  </div>
                </div>
              ))
            }
          </Card>
          <Card>
            <CardHeader title="✉️ Messages récents" action={<Btn onClick={()=>setPage("messages")} variant="outline" size="sm">Voir tout</Btn>} />
            {messages.slice(0,3).map(m=>(
              <div key={m.id} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:`1px solid ${C.grisMid}`,alignItems:"flex-start"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:m.lu?C.texte3:C.rouge,marginTop:5,flexShrink:0}}></div>
                <div>
                  <div style={{fontWeight:700,fontSize:12}}>{m.nom}</div>
                  <div style={{fontSize:11,color:C.texte2}}>{m.msg.substring(0,55)}…</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* Raccourcis rapides */}
      <Card style={{marginTop:0}}>
        <CardHeader title="⚡ Actions rapides" />
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <Btn onClick={()=>setPage("publier")}>➕ Nouvelle annonce</Btn>
          <Btn onClick={()=>setPage("signalements")} variant="outline">🚨 Traiter signalements</Btn>
          <Btn onClick={()=>setPage("messages")} variant="outline">✉️ Voir messages</Btn>
          <Btn onClick={()=>setPage("stats")} variant="outline">📈 Statistiques</Btn>
        </div>
      </Card>
    </div>
  );
}

/* ─── PAGE ANNONCES ─── */
function PageAnnonces({annonces,setAnnonces,setPage,toast,confirm}){
  const [q,setQ]=useState("");
  const [fStatut,setFStatut]=useState("");
  const [fVille,setFVille]=useState("");

  const filtered=annonces.filter(a=>{
    const mQ=!q||(a.titre+a.ville+a.quartier).toLowerCase().includes(q.toLowerCase());
    const mS=!fStatut||a.statut===fStatut;
    const mV=!fVille||a.ville===fVille;
    return mQ&&mS&&mV;
  });

  function changerStatut(id){
    const a=annonces.find(x=>x.id===id);
    const statuts=["disponible","réservé","loué","masqué"];
    const next=statuts[(statuts.indexOf(a.statut)+1)%statuts.length];
    confirm({title:"Changer le statut",msg:`Passer de "${a.statut}" à "${next}" ?`},()=>{
      setAnnonces(prev=>prev.map(x=>x.id===id?{...x,statut:next}:x));
      toast(`✅ Statut changé → ${next}`);
    });
  }

  function supprimer(id){
    const a=annonces.find(x=>x.id===id);
    confirm({title:"Supprimer",msg:`Supprimer "${a.titre}" ?`},()=>{
      setAnnonces(prev=>prev.filter(x=>x.id!==id));
      toast("🗑️ Annonce supprimée");
    });
  }

  return(
    <div className="fade">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontSize:15,fontWeight:700}}>{filtered.length} annonce(s)</div>
        <Btn onClick={()=>setPage("publier")}>➕ Nouvelle annonce</Btn>
      </div>
      <Card>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="🔍 Rechercher..." style={{flex:1,minWidth:180,padding:"9px 12px",borderRadius:8,border:`1px solid ${C.grisMid}`,fontSize:13}} />
          <select value={fStatut} onChange={e=>setFStatut(e.target.value)} style={{padding:"9px 12px",borderRadius:8,border:`1px solid ${C.grisMid}`,fontSize:13}}>
            <option value="">Tous statuts</option>
            <option value="disponible">🟢 Disponible</option>
            <option value="réservé">🟡 Réservé</option>
            <option value="loué">🔴 Loué</option>
            <option value="masqué">⚫ Masqué</option>
          </select>
          <select value={fVille} onChange={e=>setFVille(e.target.value)} style={{padding:"9px 12px",borderRadius:8,border:`1px solid ${C.grisMid}`,fontSize:13}}>
            <option value="">Toutes villes</option>
            {VILLES.map(v=><option key={v}>{v}</option>)}
          </select>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead>
              <tr style={{background:C.gris}}>
                {["Bien","Propriétaire","Ville","Prix","Vues","Statut","Actions"].map(h=>(
                  <th key={h} style={{padding:"10px 12px",textAlign:"left",fontWeight:700,fontSize:12,color:C.texte2,whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(a=>(
                <tr key={a.id} style={{borderBottom:`1px solid ${C.grisMid}`}}>
                  <td style={{padding:"10px 12px"}}>
                    <div style={{fontWeight:700,fontSize:13}}>{a.titre}</div>
                    <div style={{fontSize:11,color:C.texte3}}>{a.type} — {a.quartier}</div>
                  </td>
                  <td style={{padding:"10px 12px"}}>
                    <div style={{fontSize:12}}>{a.proprio}</div>
                    <div style={{fontSize:11,color:C.texte3}}>{a.tel}</div>
                  </td>
                  <td style={{padding:"10px 12px",fontSize:12}}>{a.ville}</td>
                  <td style={{padding:"10px 12px",fontWeight:700,color:C.vert,fontSize:13,whiteSpace:"nowrap"}}>{a.prix.toLocaleString("fr-FR")} <span style={{fontWeight:400,fontSize:11,color:C.texte3}}>FCFA</span></td>
                  <td style={{padding:"10px 12px",fontSize:12}}>👁️ {fmtNum(a.vues)}</td>
                  <td style={{padding:"10px 12px"}}><Badge statut={a.statut}/></td>
                  <td style={{padding:"10px 12px",whiteSpace:"nowrap",display:"flex",gap:6}}>
                    <Btn onClick={()=>changerStatut(a.id)} variant="outline" size="sm">✏️ Statut</Btn>
                    <Btn onClick={()=>supprimer(a.id)} variant="danger" size="sm">🗑️</Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ─── PAGE UTILISATEURS ─── */
function PageUsers({users,setUsers,toast,confirm}){
  const [q,setQ]=useState("");
  const [fRole,setFRole]=useState("");

  const filtered=users.filter(u=>{
    const mQ=!q||(u.nom+u.email).toLowerCase().includes(q.toLowerCase());
    const mR=!fRole||u.role===fRole;
    return mQ&&mR;
  });

  function bannir(id){
    const u=users.find(x=>x.id===id);
    confirm({title:"Bannir l'utilisateur",msg:`Bannir ${u.nom} ? Cette action est irréversible.`},()=>{
      setUsers(prev=>prev.filter(x=>x.id!==id));
      toast(`🚫 ${u.nom} banni(e)`);
    });
  }

  return(
    <div className="fade">
      <Card>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="🔍 Rechercher..." style={{flex:1,minWidth:180,padding:"9px 12px",borderRadius:8,border:`1px solid ${C.grisMid}`,fontSize:13}} />
          <select value={fRole} onChange={e=>setFRole(e.target.value)} style={{padding:"9px 12px",borderRadius:8,border:`1px solid ${C.grisMid}`,fontSize:13}}>
            <option value="">Tous les rôles</option>
            <option value="admin">Admin</option>
            <option value="proprietaire">Propriétaire</option>
            <option value="locataire">Locataire</option>
          </select>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead>
              <tr style={{background:C.gris}}>
                {["Nom","Email","Téléphone","Rôle","Date inscription","Actions"].map(h=><th key={h} style={{padding:"10px 12px",textAlign:"left",fontWeight:700,fontSize:12,color:C.texte2}}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u=>(
                <tr key={u.id} style={{borderBottom:`1px solid ${C.grisMid}`}}>
                  <td style={{padding:"10px 12px",fontWeight:700}}>{u.nom}</td>
                  <td style={{padding:"10px 12px",fontSize:12,color:C.texte2}}>{u.email}</td>
                  <td style={{padding:"10px 12px",fontSize:12}}>{u.tel}</td>
                  <td style={{padding:"10px 12px"}}><RoleBadge role={u.role}/></td>
                  <td style={{padding:"10px 12px",fontSize:11,color:C.texte3}}>{u.date}</td>
                  <td style={{padding:"10px 12px",display:"flex",gap:6}}>
                    <a href={`https://wa.me/${u.tel.replace(/[\s+]/g,"")}`} target="_blank" style={{...{fontSize:12,padding:"5px 10px",borderRadius:8,background:"#25D366",color:"#fff",fontWeight:700,textDecoration:"none"}}}>💬 WA</a>
                    {u.role!=="admin"&&<Btn onClick={()=>bannir(u.id)} variant="danger" size="sm">🚫</Btn>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ─── PAGE SIGNALEMENTS ─── */
function PageSignalements({signalements,setSignalements,annonces,setAnnonces,toast,confirm}){
  function traiter(id){
    confirm({title:"Marquer traité",msg:"Marquer ce signalement comme traité ?"},()=>{
      setSignalements(prev=>prev.map(s=>s.id===id?{...s,traite:true}:s));
      toast("✅ Signalement traité");
    });
  }
  function supprimerAnnonce(annId){
    confirm({title:"Supprimer l'annonce",msg:"Supprimer cette annonce signalée ?"},()=>{
      setAnnonces(prev=>prev.filter(a=>a.id!==annId));
      toast("🗑️ Annonce supprimée");
    });
  }

  return(
    <div className="fade">
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        <div style={{background:C.rougeLight,borderRadius:10,padding:"8px 16px",fontSize:13,fontWeight:700,color:C.rouge}}>{signalements.filter(s=>!s.traite).length} en attente</div>
        <div style={{background:C.vertLight,borderRadius:10,padding:"8px 16px",fontSize:13,fontWeight:700,color:C.vertDark}}>{signalements.filter(s=>s.traite).length} traités</div>
      </div>
      <Card>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {signalements.map(s=>(
            <div key={s.id} style={{display:"flex",gap:12,padding:14,borderRadius:10,background:s.traite?C.gris:C.rougeLight,border:`1px solid ${s.traite?C.grisMid:C.rouge+"33"}`,alignItems:"flex-start"}}>
              <div style={{fontSize:24}}>{s.traite?"✅":"🚨"}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13,color:s.traite?C.texte:C.rouge}}>{s.type}</div>
                <div style={{fontSize:12,color:C.texte2,margin:"3px 0"}}>Par <strong>{s.signalePar}</strong> le {s.date} — Annonce: <code style={{fontSize:11}}>{s.annonce}</code></div>
                <div style={{fontSize:12,color:C.texte2}}>{s.desc}</div>
              </div>
              {!s.traite&&(
                <div style={{display:"flex",gap:6,flexShrink:0}}>
                  <Btn onClick={()=>traiter(s.id)} size="sm">✅ Traiter</Btn>
                  <Btn onClick={()=>supprimerAnnonce(s.annonce)} variant="danger" size="sm">🗑️ Annonce</Btn>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ─── PAGE MESSAGES ─── */
function PageMessages({messages,setMessages,toast,confirm}){
  const [selected,setSelected]=useState(null);

  function marquerLu(id){setMessages(prev=>prev.map(m=>m.id===id?{...m,lu:true}:m));}
  function supprimer(id){
    confirm({title:"Supprimer",msg:"Supprimer ce message ?"},()=>{
      setMessages(prev=>prev.filter(m=>m.id!==id));
      if(selected?.id===id)setSelected(null);
      toast("🗑️ Message supprimé");
    });
  }

  return(
    <div className="fade" style={{display:"flex",gap:16,height:"calc(100vh - 140px)"}}>
      {/* Liste */}
      <Card style={{width:280,flexShrink:0,overflowY:"auto",padding:12,marginBottom:0}}>
        <div style={{fontWeight:700,fontSize:14,marginBottom:10,padding:"0 4px"}}>Messages ({messages.length})</div>
        {messages.map(m=>(
          <div key={m.id} onClick={()=>{setSelected(m);marquerLu(m.id);}} style={{padding:"10px 10px",borderRadius:9,cursor:"pointer",marginBottom:4,background:selected?.id===m.id?C.vertLight:C.blanc,border:`1px solid ${selected?.id===m.id?C.vert:C.grisMid}`,position:"relative"}}>
            {!m.lu&&<div style={{width:8,height:8,background:C.rouge,borderRadius:"50%",position:"absolute",top:10,right:10}}/>}
            <div style={{fontWeight:700,fontSize:12}}>{m.nom}</div>
            <div style={{fontSize:11,color:C.texte3,marginTop:1}}>{m.sujet}</div>
            <div style={{fontSize:10,color:C.texte3}}>{m.date}</div>
          </div>
        ))}
      </Card>
      {/* Détail */}
      <Card style={{flex:1,overflowY:"auto",marginBottom:0}}>
        {!selected?(
          <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:C.texte3}}>
            <div style={{fontSize:48}}>✉️</div>
            <div style={{marginTop:8,fontWeight:600}}>Sélectionnez un message</div>
          </div>
        ):(
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
              <div>
                <div style={{fontWeight:800,fontSize:16}}>{selected.nom}</div>
                <div style={{fontSize:12,color:C.texte3}}>{selected.tel} — {selected.date}</div>
                <div style={{display:"inline-block",background:C.bleuLight,color:C.bleuDark,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,marginTop:6}}>{selected.sujet}</div>
              </div>
              <Btn onClick={()=>supprimer(selected.id)} variant="danger" size="sm">🗑️</Btn>
            </div>
            <div style={{background:C.gris,borderRadius:10,padding:16,fontSize:14,lineHeight:1.8,color:C.texte,marginBottom:20}}>{selected.msg}</div>
            <div style={{display:"flex",gap:10}}>
              <a href={`tel:${selected.tel}`} style={{padding:"10px 18px",background:C.vert,color:"#fff",borderRadius:9,fontWeight:700,fontSize:13,textDecoration:"none"}}>📞 Appeler</a>
              <a href={`https://wa.me/${selected.tel.replace(/[\s+]/g,"")}`} target="_blank" style={{padding:"10px 18px",background:"#25D366",color:"#fff",borderRadius:9,fontWeight:700,fontSize:13,textDecoration:"none"}}>💬 WhatsApp</a>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

/* ─── PAGE STATS ─── */
function PageStats({annonces,users}){
  function barChart(data,color){
    const max=Math.max(...Object.values(data),1);
    return Object.entries(data).map(([label,val])=>(
      <div key={label} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
        <div style={{width:100,fontSize:12,color:C.texte2,textAlign:"right",flexShrink:0}}>{label}</div>
        <div style={{flex:1,background:C.gris,borderRadius:4,height:22,overflow:"hidden"}}>
          <div style={{width:`${Math.round(val/max*100)}%`,height:"100%",background:color,borderRadius:4,transition:"width .6s ease",display:"flex",alignItems:"center",paddingLeft:8}}>
            <span style={{fontSize:11,fontWeight:700,color:"#fff",whiteSpace:"nowrap"}}>{val}</span>
          </div>
        </div>
      </div>
    ));
  }

  const parVille={};annonces.forEach(a=>{parVille[a.ville]=(parVille[a.ville]||0)+1;});
  const parType={};annonces.forEach(a=>{parType[a.type]=(parType[a.type]||0)+1;});
  const parStatut={};annonces.forEach(a=>{parStatut[a.statut]=(parStatut[a.statut]||0)+1;});
  const top5=[...annonces].sort((a,b)=>b.vues-a.vues).slice(0,5);
  const topVues={};top5.forEach(a=>{topVues[a.titre.substring(0,22)+"…"]=a.vues;});
  const revMoyen=annonces.filter(a=>a.statut==="disponible").reduce((s,a)=>s+a.prix,0)/Math.max(1,annonces.filter(a=>a.statut==="disponible").length);

  return(
    <div className="fade">
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12,marginBottom:16}}>
        <KpiCard icon="💰" val={Math.round(revMoyen/1000)+"k"} label="Loyer moyen (FCFA)" color={C.vert}/>
        <KpiCard icon="🏢" val={annonces.filter(a=>a.statut==="loué").length} label="Biens loués" color={C.rouge}/>
        <KpiCard icon="🟢" val={annonces.filter(a=>a.statut==="disponible").length} label="Disponibles" color={C.vert}/>
        <KpiCard icon="🟡" val={annonces.filter(a=>a.statut==="réservé").length} label="Réservés" color={C.jaune}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card><CardHeader title="🏙️ Annonces par ville" />{barChart(parVille,C.bleu)}</Card>
        <Card><CardHeader title="🏠 Types de bien" />{barChart(parType,C.vert)}</Card>
        <Card><CardHeader title="📊 Statuts" />{barChart(parStatut,C.jaune)}</Card>
        <Card><CardHeader title="🔝 Top 5 consultations" />{barChart(topVues,C.rouge)}</Card>
      </div>
    </div>
  );
}

/* ─── PAGE PUBLIER ─── */
function PagePublier({annonces,setAnnonces,setPage,toast}){
  const [form,setForm]=useState({type:"",ville:"",quartier:"",prix:"",surface:"",chambres:"",sdb:"",tel:"",titre:"",desc:"",statut:"disponible",tags:[]});
  const [iaLoading,setIaLoading]=useState(false);

  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const toggleTag=t=>setForm(f=>({...f,tags:f.tags.includes(t)?f.tags.filter(x=>x!==t):[...f.tags,t]}));

  async function genererIA(){
    if(!form.type||!form.ville){toast("⚠️ Choisissez le type et la ville d'abord");return;}
    setIaLoading(true);
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        model:"claude-sonnet-4-6",max_tokens:1000,
        system:"Tu es un expert en immobilier gabonais. Réponds UNIQUEMENT en JSON valide, sans texte avant ou après.",
        messages:[{role:"user",content:`Génère un titre accrocheur (max 60 chars) et une description professionnelle (80-120 mots) pour une annonce immobilière gabonaise.\nType: ${form.type}\nVille: ${form.ville}\nQuartier: ${form.quartier||"non précisé"}\nPrix: ${form.prix?form.prix+" FCFA/mois":"non précisé"}\nSurface: ${form.surface||"?"}m²\nÉquipements: ${form.tags.join(", ")||"standard"}\n\nRéponds UNIQUEMENT en JSON: {"titre":"...","description":"..."}`}]
      })});
      const d=await r.json();
      const text=d.content?.map(c=>c.text||"").join("")||"{}";
      const parsed=JSON.parse(text.replace(/```json|```/g,"").trim());
      if(parsed.titre)set("titre",parsed.titre);
      if(parsed.description)set("desc",parsed.description);
      toast("✨ Titre et description générés par l'IA !");
    }catch{toast("❌ Erreur IA. Réessayez.");}
    setIaLoading(false);
  }

  function publier(){
    if(!form.type||!form.ville||!form.quartier||!form.prix||!form.titre||!form.tel){toast("⚠️ Remplissez tous les champs obligatoires (*)");return;}
    const newA={
      id:"ann"+Date.now(),
      titre:form.titre,type:form.type,ville:form.ville,quartier:form.quartier,
      prix:parseInt(form.prix),surface:parseInt(form.surface||0),chambres:parseInt(form.chambres||0),sdb:parseInt(form.sdb||0),
      tags:form.tags,statut:form.statut,tel:form.tel,proprio:"Admin",desc:form.desc,
      vues:0,dateCreation:new Date().toISOString().split("T")[0],photo:"",
    };
    setAnnonces(prev=>[newA,...prev]);
    toast("✅ Annonce publiée avec succès !");
    setPage("annonces");
  }

  const inputStyle={width:"100%",padding:"10px 13px",borderRadius:9,border:`1.5px solid ${C.grisMid}`,fontSize:13,fontFamily:"inherit",outline:"none"};
  const labelStyle={fontSize:12,fontWeight:700,color:C.texte2,display:"block",marginBottom:5};

  return(
    <div className="fade">
      <Card>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14}}>
          {[
            {k:"type",label:"Type de bien *",el:<select value={form.type} onChange={e=>set("type",e.target.value)} style={inputStyle}><option value="">Choisir</option>{TYPES.map(t=><option key={t}>{t}</option>)}</select>},
            {k:"ville",label:"Ville *",el:<select value={form.ville} onChange={e=>set("ville",e.target.value)} style={inputStyle}><option value="">Choisir</option>{VILLES.map(v=><option key={v}>{v}</option>)}</select>},
            {k:"quartier",label:"Quartier *",el:<input value={form.quartier} onChange={e=>set("quartier",e.target.value)} placeholder="Ex: Akanda, Batterie IV..." style={inputStyle}/>},
            {k:"prix",label:"Prix mensuel (FCFA) *",el:<input type="number" value={form.prix} onChange={e=>set("prix",e.target.value)} placeholder="Ex: 150000" style={inputStyle}/>},
            {k:"surface",label:"Surface (m²)",el:<input type="number" value={form.surface} onChange={e=>set("surface",e.target.value)} placeholder="Ex: 80" style={inputStyle}/>},
            {k:"chambres",label:"Chambres",el:<input type="number" value={form.chambres} onChange={e=>set("chambres",e.target.value)} placeholder="Ex: 2" style={inputStyle}/>},
            {k:"sdb",label:"Salles de bain",el:<input type="number" value={form.sdb} onChange={e=>set("sdb",e.target.value)} placeholder="Ex: 1" style={inputStyle}/>},
            {k:"tel",label:"Tél. propriétaire *",el:<input value={form.tel} onChange={e=>set("tel",e.target.value)} placeholder="+241 6 XX XX XX" style={inputStyle}/>},
          ].map(f=>(
            <div key={f.k}><label style={labelStyle}>{f.label}</label>{f.el}</div>
          ))}
          <div style={{gridColumn:"1/-1"}}><label style={labelStyle}>Titre de l'annonce *</label><input value={form.titre} onChange={e=>set("titre",e.target.value)} placeholder="Ex: Belle villa meublée avec jardin à Akanda" style={inputStyle}/></div>
          <div style={{gridColumn:"1/-1"}}><label style={labelStyle}>Description</label><textarea value={form.desc} onChange={e=>set("desc",e.target.value)} rows={4} placeholder="Décrivez le bien : équipements, accès, particularités..." style={{...inputStyle,resize:"vertical"}}/></div>
          <div style={{gridColumn:"1/-1"}}>
            <label style={labelStyle}>Équipements / Tags</label>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {TAGS_LIST.map(t=>(
                <label key={t} style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",background:form.tags.includes(t)?C.vertLight:C.gris,borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:600,color:form.tags.includes(t)?C.vertDark:C.texte2,border:`1px solid ${form.tags.includes(t)?C.vert:C.grisMid}`,transition:"all .15s"}}>
                  <input type="checkbox" checked={form.tags.includes(t)} onChange={()=>toggleTag(t)} style={{display:"none"}}/>
                  {form.tags.includes(t)?"✓ ":""}{t}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label style={labelStyle}>Statut initial</label>
            <select value={form.statut} onChange={e=>set("statut",e.target.value)} style={inputStyle}>
              <option value="disponible">🟢 Disponible</option>
              <option value="réservé">🟡 Réservé</option>
              <option value="masqué">⚫ Masqué (brouillon)</option>
            </select>
          </div>
        </div>

        {/* IA */}
        <div style={{marginTop:20,padding:16,background:`linear-gradient(135deg,${C.jauneLight} 0%,#fff 100%)`,borderRadius:12,border:`1px solid ${C.jaune}44`}}>
          <div style={{fontWeight:700,fontSize:13,marginBottom:6}}>✨ Génération automatique par l'IA</div>
          <div style={{fontSize:12,color:C.texte2,marginBottom:10}}>L'IA génère un titre accrocheur et une description professionnelle à partir des informations du bien.</div>
          <button onClick={genererIA} disabled={iaLoading} style={{background:`linear-gradient(135deg,${C.jaune},${C.jauneDark})`,color:C.texte,border:"none",padding:"10px 20px",borderRadius:9,fontWeight:700,fontSize:13,cursor:iaLoading?"not-allowed":"pointer",opacity:iaLoading?.6:1}}>
            {iaLoading?"⏳ Génération en cours...":"✨ Générer titre et description avec l'IA"}
          </button>
        </div>

        <div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}>
          <Btn onClick={()=>setPage("annonces")} variant="outline">← Annuler</Btn>
          <Btn onClick={publier}>📤 Publier l'annonce</Btn>
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════
   APP PRINCIPALE
═══════════════════════════════════════════ */
export default function App(){
  const [view,setView]=useState("public"); // public | login | admin
  const [adminUser,setAdminUser]=useState(null);
  const [annonces,setAnnonces]=useState(ANNONCES_INIT);
  const [users,setUsers]=useState(USERS_INIT);
  const [signalements,setSignalements]=useState(SIGNALEMENTS_INIT);
  const [messages,setMessages]=useState(MESSAGES_INIT);

  return(
    <>
      <style>{globalCSS}</style>
      {view==="public"&&<PagePublique annonces={annonces} onAdminClick={()=>setView("login")}/>}
      {view==="login"&&<LoginAdmin onLogin={u=>{setAdminUser(u);setView("admin");}} onBack={()=>setView("public")}/>}
      {view==="admin"&&<AdminDashboard annonces={annonces} setAnnonces={setAnnonces} users={users} setUsers={setUsers} signalements={signalements} setSignalements={setSignalements} messages={messages} setMessages={setMessages} onLogout={()=>{setAdminUser(null);setView("public");}} onBack={()=>setView("public")}/>}
    </>
  );
}
