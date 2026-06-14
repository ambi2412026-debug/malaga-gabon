/* ═══════════════════════════════════════════
   MALAGA – app.js (version sans Firebase)
   Page publique avec annonces mock
═══════════════════════════════════════════ */

'use strict';

// Données mock (remplacer par Firebase si vous voulez)
const ANNONCES_MOCK = [
  { id:'ann001', titre:'Belle villa meublée avec jardin', type:'Villa', ville:'Libreville', quartier:'Akanda', prix:350000, vues:842, statut:'disponible', proprio:'Jean Mbadinga', tel:'+24166580032', surface:180, chambres:4, sdb:2, tags:['Meublé','Climatisé','Jardin','Parking'], desc:'Superbe villa dans un quartier résidentiel calme.' },
  { id:'ann002', titre:'Appartement 3 pièces climatisé Batterie IV', type:'Appartement', ville:'Libreville', quartier:'Batterie IV', prix:150000, vues:631, statut:'disponible', proprio:'Marie Ondo', tel:'+24177001122', surface:75, chambres:2, sdb:1, tags:['Climatisé','Fibre optique'], desc:'Appartement lumineux, bien entretenu.' },
  { id:'ann003', titre:'Studio moderne avec forage Owendo', type:'Studio', ville:'Libreville', quartier:'Owendo', prix:65000, vues:287, statut:'disponible', proprio:'Paul Nze', tel:'+24166123456', surface:28, chambres:1, sdb:1, tags:['Forage','Meublé'], desc:'Studio meublé idéal pour jeune professionnel.' },
  { id:'ann004', titre:'Maison 5 pièces groupe électrogène Ozouri', type:'Maison', ville:'Port-Gentil', quartier:'Ozouri', prix:200000, vues:445, statut:'réservé', proprio:'Sophie Moukagni', tel:'+24177654321', surface:120, chambres:3, sdb:2, tags:['Groupe électrogène','Forage','Clôture'], desc:'Grande maison familiale avec groupe électrogène.' },
  { id:'ann005', titre:'Villa standing avec piscine Angondjé', type:'Villa', ville:'Libreville', quartier:'Angondjé', prix:600000, vues:1203, statut:'disponible', proprio:'Eric Boulingui', tel:'+24166789012', surface:250, chambres:5, sdb:3, tags:['Piscine','Meublé','Climatisé','Parking','Jardin'], desc:'Villa de prestige avec piscine et garage.' },
  { id:'ann006', titre:'Appartement 2 pièces semi-meublé Franceville', type:'Appartement', ville:'Franceville', quartier:'Centre-ville', prix:100000, vues:189, statut:'loué', proprio:'Claire Ibinga', tel:'+24177345678', surface:55, chambres:2, sdb:1, tags:['Parking'], desc:'Appartement calme en centre-ville.' },
];

const VILLES = ['Libreville','Port-Gentil','Franceville','Oyem','Moanda','Mouila'];
const TYPES = ['Maison','Appartement','Studio','Villa','Chambre','Bureau','Local commercial'];

// État global
let annoncesData = [...ANNONCES_MOCK];
let filtresActuels = { ville: '', type: '', prixMax: '' };

/* ══════════════════════════════════════════════════════════
   CHARGEMENT INITIAL
══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  chargerAnnonces();
  initFiltres();
  mettreAJourStats();
});

/* ══════════════════════════════════════════════════════════
   AFFICHAGE DES ANNONCES
══════════════════════════════════════════════════════════ */
function chargerAnnonces() {
  const container = document.getElementById('liste-annonces');
  if (!container) return;
  
  const filtrees = annoncesData.filter(a => {
    const matchVille = !filtresActuels.ville || a.ville === filtresActuels.ville;
    const matchType = !filtresActuels.type || a.type === filtresActuels.type;
    const matchPrix = !filtresActuels.prixMax || a.prix <= parseInt(filtresActuels.prixMax);
    return matchVille && matchType && matchPrix && a.statut !== 'masqué';
  });

  container.innerHTML = '';
  
  if (filtrees.length === 0) {
    container.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#888;padding:40px;">Aucune annonce trouvée. Modifiez vos critères.</p>';
    return;
  }

  filtrees.forEach(a => {
    const badge = a.statut === 'disponible' ? '🟢 Disponible' : 
                  a.statut === 'réservé' ? '🟡 Réservé' : '🔴 Loué';
    const couleur = a.statut === 'disponible' ? '#D1FAE5' : 
                    a.statut === 'réservé' ? '#FEF3C7' : '#FEE2E2';
    
    const carte = document.createElement('div');
    carte.className = 'carte-annonce';
    carte.style.cursor = 'pointer';
    carte.innerHTML = `
      <div style="height:170px;background:#e0e0e0;display:flex;align-items:center;justify-content:center;position:relative;border-radius:12px 12px 0 0;font-size:48px;color:#999;">
        ${getIconeType(a.type)}
        <span style="position:absolute;top:10px;right:10px;background:${couleur};padding:4px 10px;border-radius:20px;font-size:11px;font-weight:bold;">${badge}</span>
        <span style="position:absolute;bottom:10px;left:10px;background:rgba(0,0,0,.4);color:#fff;font-size:11px;padding:3px 8px;border-radius:6px;">${a.type}</span>
        <span style="position:absolute;bottom:10px;right:10px;background:rgba(0,0,0,.4);color:#fff;font-size:11px;padding:3px 8px;border-radius:6px;">👁️ ${a.vues.toLocaleString()}</span>
      </div>
      <div style="padding:15px;">
        <h3 style="font-size:14px;font-weight:700;margin:0 0 8px 0;">${a.titre}</h3>
        <div style="color:#009E60;font-weight:800;font-size:16px;margin-bottom:4px;">${a.prix.toLocaleString()} FCFA/mois</div>
        <div style="color:#999;font-size:12px;margin-bottom:8px;">📍 ${a.quartier} — ${a.ville}</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;font-size:11px;">
          ${a.chambres ? `<span style="background:#f0f0f0;padding:2px 7px;border-radius:5px;">🛏️ ${a.chambres}</span>` : ''}
          ${a.surface ? `<span style="background:#f0f0f0;padding:2px 7px;border-radius:5px;">📐 ${a.surface}m²</span>` : ''}
          ${a.tags.slice(0,2).map(t => `<span style="background:#FFFBDD;color:#B8860B;padding:2px 7px;border-radius:5px;font-weight:600;">✓ ${t}</span>`).join('')}
        </div>
      </div>
    `;
    carte.onclick = () => afficherDetail(a);
    container.appendChild(carte);
  });
}

function getIconeType(type) {
  const icons = {
    'Villa': '🏡',
    'Appartement': '🏢',
    'Studio': '🛏️',
    'Maison': '🏠',
    'Chambre': '🚪',
    'Bureau': '🏗️',
    'Local commercial': '🏪'
  };
  return icons[type] || '🏠';
}

/* ══════════════════════════════════════════════════════════
   FILTRES
══════════════════════════════════════════════════════════ */
function initFiltres() {
  const selectVille = document.getElementById('filterVille');
  const selectType = document.getElementById('filterType');
  const selectPrix = document.getElementById('filterPrix');

  if (selectVille) {
    selectVille.innerHTML = '<option value="">Toutes les villes</option>' + 
      VILLES.map(v => `<option>${v}</option>`).join('');
    selectVille.onchange = () => {
      filtresActuels.ville = selectVille.value;
      chargerAnnonces();
    };
  }

  if (selectType) {
    selectType.innerHTML = '<option value="">Tous les types</option>' + 
      TYPES.map(t => `<option>${t}</option>`).join('');
    selectType.onchange = () => {
      filtresActuels.type = selectType.value;
      chargerAnnonces();
    };
  }

  if (selectPrix) {
    selectPrix.onchange = () => {
      filtresActuels.prixMax = selectPrix.value;
      chargerAnnonces();
    };
  }
}

window.rechercherAnnonces = function() {
  const terme = document.getElementById('search-input').value.toLowerCase();
  if (!terme) {
    chargerAnnonces();
    return;
  }
  
  const container = document.getElementById('liste-annonces');
  const filtrees = annoncesData.filter(a => 
    a.titre.toLowerCase().includes(terme) || 
    a.ville.toLowerCase().includes(terme) || 
    a.quartier.toLowerCase().includes(terme)
  );

  container.innerHTML = '';
  if (filtrees.length === 0) {
    container.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#888;padding:40px;">Aucune annonce trouvée.</p>';
    return;
  }

  filtrees.forEach(a => {
    const badge = a.statut === 'disponible' ? '🟢 Disponible' : 
                  a.statut === 'réservé' ? '🟡 Réservé' : '🔴 Loué';
    const couleur = a.statut === 'disponible' ? '#D1FAE5' : 
                    a.statut === 'réservé' ? '#FEF3C7' : '#FEE2E2';
    
    const carte = document.createElement('div');
    carte.className = 'carte-annonce';
    carte.style.cursor = 'pointer';
    carte.innerHTML = `
      <div style="height:170px;background:#e0e0e0;display:flex;align-items:center;justify-content:center;position:relative;border-radius:12px 12px 0 0;font-size:48px;color:#999;">
        ${getIconeType(a.type)}
        <span style="position:absolute;top:10px;right:10px;background:${couleur};padding:4px 10px;border-radius:20px;font-size:11px;font-weight:bold;">${badge}</span>
      </div>
      <div style="padding:15px;">
        <h3 style="font-size:14px;font-weight:700;margin:0 0 8px 0;">${a.titre}</h3>
        <div style="color:#009E60;font-weight:800;font-size:16px;">${a.prix.toLocaleString()} FCFA/mois</div>
      </div>
    `;
    carte.onclick = () => afficherDetail(a);
    container.appendChild(carte);
  });
};

/* ══════════════════════════════════════════════════════════
   DÉTAIL ANNONCE (MODAL)
══════════════════════════════════════════════════════════ */
function afficherDetail(annonce) {
  // Créer la modal si elle n'existe pas
  let modal = document.getElementById('detailModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'detailModal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:flex-end;justify-content:center;z-index:5000;';
    document.body.appendChild(modal);
  }

  const couleur = annonce.statut === 'disponible' ? '#009E60' : 
                  annonce.statut === 'réservé' ? '#FCD116' : '#EF4444';

  modal.innerHTML = `
    <div style="background:#fff;border-radius:18px 18px 0 0;width:100%;max-width:680px;max-height:92vh;overflow-y:auto;">
      <div style="background:linear-gradient(135deg,${couleur} 0%,${couleur}99 100%);padding:28px 20px 20px;color:#fff;position:relative;">
        <button onclick="document.getElementById('detailModal').style.display='none'" style="position:absolute;top:16px;right:16px;background:rgba(255,255,255,.25);border:none;color:#fff;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:16px;font-weight:bold;">✕</button>
        <div style="font-size:48px;margin-bottom:8px;">${getIconeType(annonce.type)}</div>
        <h2 style="font-size:18px;font-weight:800;margin:0 0 6px 0;padding-right:40px;">${annonce.titre}</h2>
        <div style="font-size:22px;font-weight:900;color:#FCD116;margin-bottom:4px;">${annonce.prix.toLocaleString()} FCFA/mois</div>
        <div style="opacity:.85;font-size:13px;">📍 ${annonce.quartier} — ${annonce.ville}</div>
      </div>

      <div style="padding:20px;">
        <!-- Infos -->
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;">
          ${annonce.chambres ? `<div style="background:#f5f5f5;padding:12px;border-radius:8px;text-align:center;"><div style="font-size:18px;font-weight:700;">🛏️ ${annonce.chambres}</div><div style="font-size:11px;color:#666;">Chambres</div></div>` : ''}
          ${annonce.sdb ? `<div style="background:#f5f5f5;padding:12px;border-radius:8px;text-align:center;"><div style="font-size:18px;font-weight:700;">🚿 ${annonce.sdb}</div><div style="font-size:11px;color:#666;">S. bain</div></div>` : ''}
          ${annonce.surface ? `<div style="background:#f5f5f5;padding:12px;border-radius:8px;text-align:center;"><div style="font-size:18px;font-weight:700;">📐 ${annonce.surface}</div><div style="font-size:11px;color:#666;">m²</div></div>` : ''}
        </div>

        <!-- Description -->
        <div style="margin-bottom:20px;">
          <h3 style="font-size:14px;font-weight:700;margin:0 0 8px 0;">Description</h3>
          <p style="font-size:13px;color:#666;line-height:1.6;margin:0;">${annonce.desc || 'Aucune description disponible.'}</p>
        </div>

        <!-- Tags -->
        ${annonce.tags && annonce.tags.length > 0 ? `
          <div style="margin-bottom:20px;">
            <h3 style="font-size:14px;font-weight:700;margin:0 0 8px 0;">Équipements</h3>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              ${annonce.tags.map(t => `<span style="background:#E8F5EE;color:#009E60;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600;">✓ ${t}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Contact -->
        <div style="background:#f5f5f5;padding:16px;border-radius:12px;margin-bottom:16px;">
          <h3 style="font-size:14px;font-weight:700;margin:0 0 12px 0;">Contacter le propriétaire</h3>
          <div style="font-size:13px;margin-bottom:8px;"><strong>${annonce.proprio}</strong></div>
          <a href="tel:${annonce.tel}" style="background:#009E60;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:700;font-size:13px;">📞 ${annonce.tel}</a>
        </div>
      </div>
    </div>
  `;
  modal.style.display = 'flex';
  modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
}

/* ══════════════════════════════════════════════════════════
   STATISTIQUES
══════════════════════════════════════════════════════════ */
function mettreAJourStats() {
  const disponibles = annoncesData.filter(a => a.statut === 'disponible').length;
  const villes = [...new Set(annoncesData.map(a => a.ville))].length;
  const vues = annoncesData.reduce((s, a) => s + (a.vues || 0), 0);

  const el1 = document.getElementById('statDisponibles');
  const el2 = document.getElementById('statVilles');
  const el3 = document.getElementById('statVues');

  if (el1) el1.textContent = disponibles;
  if (el2) el2.textContent = villes;
  if (el3) el3.textContent = vues.toLocaleString();
}
