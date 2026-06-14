/* ═══════════════════════════════════════════════════════════
   MALAGA – admin.js
   Panneau d'administration : Auth, Firestore, IA
═══════════════════════════════════════════════════════════ */

'use strict';

/* ── Email admin autorisé ── */
const ADMIN_EMAIL = 'malaga.gabon@gmail.com';

/* ── Données mock pour démo (remplacées par Firestore) ── */
const MOCK_ANNONCES = [
  { id:'ann001', titre:'Belle villa meublée avec jardin', type:'Villa', ville:'Libreville', quartier:'Akanda', prix:350000, vues:842, statut:'disponible', proprio:'Jean Mbadinga', tel:'+24166580032' },
  { id:'ann002', titre:'Appartement 3 pièces climatisé', type:'Appartement', ville:'Libreville', quartier:'Batterie IV', prix:150000, vues:631, statut:'disponible', proprio:'Marie Ondo', tel:'+24177001122' },
  { id:'ann003', titre:'Studio moderne avec forage', type:'Studio', ville:'Libreville', quartier:'Owendo', prix:65000, vues:287, statut:'disponible', proprio:'Paul Nze', tel:'+24166123456' },
  { id:'ann004', titre:'Maison 5 pièces groupe électrogène', type:'Maison', ville:'Port-Gentil', quartier:'Ozouri', prix:200000, vues:445, statut:'réservé', proprio:'Sophie Moukagni', tel:'+24177654321' },
  { id:'ann005', titre:'Villa standing avec piscine', type:'Villa', ville:'Libreville', quartier:'Angondjé', prix:600000, vues:1203, statut:'disponible', proprio:'Eric Boulingui', tel:'+24166789012' },
  { id:'ann006', titre:'Appartement 2 pièces semi-meublé', type:'Appartement', ville:'Franceville', quartier:'Centre-ville', prix:100000, vues:189, statut:'loué', proprio:'Claire Ibinga', tel:'+24177345678' },
];

const MOCK_USERS = [
  { nom:'KOZANGUE Patrick', email:'malaga.gabon@gmail.com', tel:'+24166580032', role:'admin', date:'12 jan 2026' },
  { nom:'Jean Mbadinga', email:'jean.mbadinga@gmail.com', tel:'+24166111222', role:'proprietaire', date:'15 jan 2026' },
  { nom:'Marie Ondo', email:'marie.ondo@gmail.com', tel:'+24177334455', role:'proprietaire', date:'18 jan 2026' },
  { nom:'Alain Ntoutoume', email:'alain.ntout@gmail.com', tel:'+24166998877', role:'locataire', date:'20 jan 2026' },
  { nom:'Sophie Moukagni', email:'sophie.m@gmail.com', tel:'+24177654321', role:'proprietaire', date:'22 jan 2026' },
];

const MOCK_SIGNALEMENTS = [
  { id:'sig001', date:'12 juin 2026', type:'Fausse annonce', annonce:'ann003', signalePar:'Alain Ntoutoume', desc:'Le bien ne correspond pas aux photos.', traite:false },
  { id:'sig002', date:'10 juin 2026', type:'Numéro frauduleux', annonce:'ann006', signalePar:'Jean Mbadinga', desc:'Le numéro demande de l\'argent à l\'avance.', traite:false },
];

const MOCK_MESSAGES = [
  { date:'13 juin 2026', nom:'Alain Ntoutoume', tel:'+24166998877', sujet:'Question sur une annonce', msg:'Bonjour, est-ce que la villa à Angondjé est encore disponible ?' },
  { date:'11 juin 2026', nom:'Fatou Diallo', tel:'+24177223344', sujet:'Problème technique', msg:'Je n\'arrive pas à publier mon annonce depuis hier soir.' },
];

/* ── État global ── */
let currentUser = null;
let annoncesData = [...MOCK_ANNONCES];
let usersData = [...MOCK_USERS];
let signalementsData = [...MOCK_SIGNALEMENTS];
let messagesData = [...MOCK_MESSAGES];
let theme = localStorage.getItem('malaga_admin_theme') || 'light';

/* ══════════════════════════════
   INITIALISATION
══════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTopbarDate();
  initSidebar();
  checkAuth();
});

/* ══════════════════════════════
   AUTH FIREBASE
══════════════════════════════ */
function checkAuth() {
  if (typeof firebase === 'undefined') {
    // Mode démo sans Firebase
    showLoginIfNeeded();
    return;
  }
  firebase.auth().onAuthStateChanged(user => {
    if (user && user.email === ADMIN_EMAIL) {
      currentUser = user;
      onLoginSuccess(user);
    } else if (user) {
      // Connecté mais pas admin
      firebase.auth().signOut();
      showLoginError('Accès réservé à l\'administrateur MALAGA.');
    } else {
      showLoginIfNeeded();
    }
  });
}

function showLoginIfNeeded() {
  const saved = sessionStorage.getItem('malaga_admin_demo');
  if (saved) {
    onLoginSuccess({ email: saved, displayName: 'Administrateur' });
  } else {
    document.getElementById('loginOverlay').classList.remove('hidden');
  }
}

async function adminLogin() {
  const email = document.getElementById('adminEmail').value.trim();
  const password = document.getElementById('adminPassword').value;
  const btn = document.getElementById('loginBtnText');
  const errEl = document.getElementById('loginError');

  if (!email || !password) {
    errEl.textContent = '⚠️ Remplissez tous les champs';
    errEl.classList.remove('hidden');
    return;
  }

  btn.textContent = '⏳ Connexion...';
  errEl.classList.add('hidden');

  if (typeof firebase !== 'undefined') {
    try {
      const cred = await firebase.auth().signInWithEmailAndPassword(email, password);
      if (cred.user.email !== ADMIN_EMAIL) {
        await firebase.auth().signOut();
        throw new Error('Non autorisé');
      }
      onLoginSuccess(cred.user);
    } catch (err) {
      errEl.textContent = '❌ Email ou mot de passe incorrect';
      errEl.classList.remove('hidden');
      btn.textContent = 'Se connecter';
    }
  } else {
    // Mode démo
    if (email === ADMIN_EMAIL && password.length >= 6) {
      sessionStorage.setItem('malaga_admin_demo', email);
      onLoginSuccess({ email, displayName: 'KOZANGUE Patrick' });
    } else {
      errEl.textContent = '❌ Email ou mot de passe incorrect';
      errEl.classList.remove('hidden');
      btn.textContent = 'Se connecter';
    }
  }
}

function onLoginSuccess(user) {
  document.getElementById('loginOverlay').classList.add('hidden');
  document.getElementById('adminName').textContent = user.displayName || 'Administrateur';
  document.getElementById('adminEmailDisplay').textContent = user.email || '';
  loadDashboard();
}

function showLoginError(msg) {
  const el = document.getElementById('loginError');
  el.textContent = msg;
  el.classList.remove('hidden');
}

function adminLogout() {
  confirmer('Déconnexion', 'Voulez-vous vous déconnecter ?', () => {
    sessionStorage.removeItem('malaga_admin_demo');
    if (typeof firebase !== 'undefined') firebase.auth().signOut();
    location.reload();
  });
}

/* ══════════════════════════════
   NAVIGATION PAGES
══════════════════════════════ */
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const page = document.getElementById(`page-${name}`);
  if (page) page.classList.add('active');

  const navItem = document.querySelector(`[data-page="${name}"]`);
  if (navItem) navItem.classList.add('active');

  const titles = {
    dashboard: 'Tableau de bord',
    annonces: 'Annonces',
    utilisateurs: 'Utilisateurs',
    signalements: 'Signalements',
    messages: 'Messages',
    stats: 'Statistiques',
    publier: 'Publier une annonce',
  };
  document.getElementById('topbarTitle').textContent = titles[name] || name;

  // Charger le contenu de la page
  if (name === 'annonces') renderAnnonces();
  if (name === 'utilisateurs') renderUsers();
  if (name === 'signalements') renderSignalements();
  if (name === 'messages') renderMessages();
  if (name === 'stats') renderStats();

  // Fermer sidebar mobile
  closeSidebarMobile();
}

/* ══════════════════════════════
   DASHBOARD
══════════════════════════════ */
function loadDashboard() {
  // KPIs
  const totalVues = annoncesData.reduce((s, a) => s + (a.vues || 0), 0);
  const actives = annoncesData.filter(a => a.statut === 'disponible').length;

  animCount('kpiAnnonces', actives);
  animCount('kpiUsers', usersData.length);
  animCount('kpiVues', totalVues);
  animCount('kpiSignal', signalementsData.filter(s => !s.traite).length);

  // Badges nav
  document.getElementById('badgeAnnonces').textContent = annoncesData.length;
  document.getElementById('badgeUsers').textContent = usersData.length;
  const pendingSignal = signalementsData.filter(s => !s.traite).length;
  const badgeSignal = document.getElementById('badgeSignal');
  badgeSignal.textContent = pendingSignal;
  badgeSignal.style.display = pendingSignal > 0 ? '' : 'none';

  // Tableau dernières annonces
  renderDashAnnonces();

  // Signalements récents
  renderDashSignalements();
}

function animCount(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let current = 0;
  const step = Math.ceil(target / 30);
  const iv = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString('fr-FR');
    if (current >= target) clearInterval(iv);
  }, 30);
}

function renderDashAnnonces() {
  const tbody = document.getElementById('dashAnnoncesBody');
  if (!tbody) return;
  const recents = annoncesData.slice(0, 5);
  tbody.innerHTML = recents.map(a => `
    <tr>
      <td><strong>${a.titre}</strong><br/><small style="color:var(--text-3)">${a.type}</small></td>
      <td>${a.ville}</td>
      <td>${a.prix.toLocaleString('fr-FR')} FCFA</td>
      <td>${statutBadge(a.statut)}</td>
      <td>
        <button class="action-btn" onclick="changerStatut('${a.id}')">✏️ Statut</button>
        <button class="action-btn danger" onclick="supprimerAnnonce('${a.id}')">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function renderDashSignalements() {
  const el = document.getElementById('dashSignalements');
  if (!el) return;
  const pending = signalementsData.filter(s => !s.traite);
  if (pending.length === 0) {
    el.innerHTML = '<p class="table-empty">✅ Aucun signalement en attente</p>';
    return;
  }
  el.innerHTML = pending.map(s => `
    <div class="signal-item">
      <div class="signal-icon">🚨</div>
      <div class="signal-content">
        <div class="signal-type">${s.type}</div>
        <div class="signal-meta">Par ${s.signalePar} — ${s.date}</div>
        <div style="font-size:.82rem;margin-top:3px">${s.desc}</div>
      </div>
      <button class="action-btn" onclick="traiterSignalement('${s.id}')">✅ Traiter</button>
    </div>
  `).join('');
}

/* ══════════════════════════════
   ANNONCES
══════════════════════════════ */
function renderAnnonces(data = annoncesData) {
  const tbody = document.getElementById('annoncesTableBody');
  if (!tbody) return;
  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="table-empty">Aucune annonce trouvée</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(a => `
    <tr>
      <td><small style="color:var(--text-3);font-family:monospace">${a.id}</small></td>
      <td>
        <strong>${a.titre}</strong><br/>
        <small style="color:var(--text-3)">${a.type} — ${a.quartier}</small>
      </td>
      <td>${a.proprio || '—'}<br/><small style="color:var(--text-3)">${a.tel}</small></td>
      <td>${a.ville}</td>
      <td><strong>${a.prix.toLocaleString('fr-FR')}</strong> FCFA</td>
      <td>👁️ ${(a.vues||0).toLocaleString('fr-FR')}</td>
      <td>${statutBadge(a.statut)}</td>
      <td style="white-space:nowrap">
        <button class="action-btn" onclick="changerStatut('${a.id}')">✏️</button>
        <button class="action-btn danger" onclick="supprimerAnnonce('${a.id}')">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function filtrerAnnonces() {
  const q = document.getElementById('filterAnnonce')?.value.toLowerCase() || '';
  const statut = document.getElementById('filterStatut')?.value || '';
  const ville = document.getElementById('filterVille')?.value || '';

  const result = annoncesData.filter(a => {
    const matchQ = !q || a.titre.toLowerCase().includes(q) || a.ville.toLowerCase().includes(q);
    const matchS = !statut || a.statut === statut;
    const matchV = !ville || a.ville === ville;
    return matchQ && matchS && matchV;
  });
  renderAnnonces(result);
}

function changerStatut(id) {
  const annonce = annoncesData.find(a => a.id === id);
  if (!annonce) return;
  const statuts = ['disponible', 'réservé', 'loué', 'masqué'];
  const idx = statuts.indexOf(annonce.statut);
  const next = statuts[(idx + 1) % statuts.length];
  confirmer('Changer le statut', `Passer l'annonce de "${annonce.statut}" à "${next}" ?`, () => {
    annonce.statut = next;
    // Firestore : firebase.firestore().collection('annonces').doc(id).update({ statut: next })
    renderAnnonces();
    renderDashAnnonces();
    afficherToast(`✅ Statut changé : ${next}`);
  });
}

function supprimerAnnonce(id) {
  const annonce = annoncesData.find(a => a.id === id);
  if (!annonce) return;
  confirmer('Supprimer l\'annonce', `Supprimer définitivement "${annonce.titre}" ?`, () => {
    annoncesData = annoncesData.filter(a => a.id !== id);
    // Firestore : firebase.firestore().collection('annonces').doc(id).delete()
    renderAnnonces();
    renderDashAnnonces();
    loadDashboard();
    afficherToast('🗑️ Annonce supprimée');
  });
}

/* ══════════════════════════════
   UTILISATEURS
══════════════════════════════ */
function renderUsers(data = usersData) {
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;
  tbody.innerHTML = data.map(u => `
    <tr>
      <td><strong>${u.nom}</strong></td>
      <td>${u.email}</td>
      <td>${u.tel}</td>
      <td>${roleBadge(u.role)}</td>
      <td><small>${u.date}</small></td>
      <td>
        <button class="action-btn" onclick="afficherToast('Fonctionnalité bientôt disponible')">✉️ Contacter</button>
        ${u.role !== 'admin' ? `<button class="action-btn danger" onclick="afficherToast('Bannir : bientôt disponible')">🚫</button>` : ''}
      </td>
    </tr>
  `).join('');
}

function filtrerUsers() {
  const q = document.getElementById('filterUser')?.value.toLowerCase() || '';
  const role = document.getElementById('filterRole')?.value || '';
  const result = usersData.filter(u => {
    const matchQ = !q || u.nom.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchR = !role || u.role === role;
    return matchQ && matchR;
  });
  renderUsers(result);
}

/* ══════════════════════════════
   SIGNALEMENTS
══════════════════════════════ */
function renderSignalements() {
  const tbody = document.getElementById('signalementsBody');
  if (!tbody) return;
  if (signalementsData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="table-empty">Aucun signalement</td></tr>';
    return;
  }
  tbody.innerHTML = signalementsData.map(s => `
    <tr>
      <td><small>${s.date}</small></td>
      <td><span class="badge badge-red">${s.type}</span></td>
      <td><small style="font-family:monospace">${s.annonce}</small></td>
      <td>${s.signalePar}</td>
      <td style="max-width:200px;font-size:.82rem">${s.desc}</td>
      <td>
        ${s.traite
          ? '<span class="badge badge-green">✅ Traité</span>'
          : `<button class="action-btn" onclick="traiterSignalement('${s.id}')">✅ Traiter</button>
             <button class="action-btn danger" onclick="supprimerAnnonce('${s.annonce}')">🗑️ Suppr. annonce</button>`
        }
      </td>
    </tr>
  `).join('');
}

function traiterSignalement(id) {
  const sig = signalementsData.find(s => s.id === id);
  if (!sig) return;
  confirmer('Marquer comme traité', `Marquer le signalement "${sig.type}" comme traité ?`, () => {
    sig.traite = true;
    renderSignalements();
    renderDashSignalements();
    loadDashboard();
    afficherToast('✅ Signalement traité');
  });
}

/* ══════════════════════════════
   MESSAGES
══════════════════════════════ */
function renderMessages() {
  const tbody = document.getElementById('messagesBody');
  if (!tbody) return;
  if (messagesData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="table-empty">Aucun message</td></tr>';
    return;
  }
  tbody.innerHTML = messagesData.map((m, i) => `
    <tr>
      <td><small>${m.date}</small></td>
      <td><strong>${m.nom}</strong></td>
      <td>${m.tel}</td>
      <td><span class="badge badge-blue">${m.sujet}</span></td>
      <td style="max-width:220px;font-size:.82rem">${m.msg}</td>
      <td>
        <a class="action-btn" href="https://wa.me/${m.tel.replace(/\s/g,'')}" target="_blank">💬 WA</a>
        <button class="action-btn danger" onclick="supprimerMessage(${i})">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function supprimerMessage(i) {
  confirmer('Supprimer le message', 'Supprimer définitivement ce message ?', () => {
    messagesData.splice(i, 1);
    renderMessages();
    afficherToast('🗑️ Message supprimé');
  });
}

/* ══════════════════════════════
   STATISTIQUES
══════════════════════════════ */
function renderStats() {
  // Par ville
  const villes = {};
  annoncesData.forEach(a => { villes[a.ville] = (villes[a.ville]||0) + 1; });
  renderBarChart('chartVilles', villes, 'green');

  // Par type
  const types = {};
  annoncesData.forEach(a => { types[a.type] = (types[a.type]||0) + 1; });
  renderBarChart('chartTypes', types, 'blue');

  // Par statut
  const statuts = {};
  annoncesData.forEach(a => { statuts[a.statut] = (statuts[a.statut]||0) + 1; });
  renderBarChart('chartStatuts', statuts, 'yellow');

  // Top vues
  const top5 = [...annoncesData].sort((a,b) => b.vues - a.vues).slice(0,5);
  const topObj = {};
  top5.forEach(a => { topObj[a.titre.substring(0,20)+'…'] = a.vues; });
  renderBarChart('chartTop', topObj, 'green');
}

function renderBarChart(elId, data, color) {
  const el = document.getElementById(elId);
  if (!el) return;
  const max = Math.max(...Object.values(data), 1);
  el.innerHTML = Object.entries(data).map(([label, val]) => `
    <div class="chart-row">
      <span class="chart-label">${label}</span>
      <div class="chart-bar-wrap">
        <div class="chart-bar ${color}" style="width:${Math.round(val/max*100)}%"></div>
      </div>
      <span class="chart-val">${val}</span>
    </div>
  `).join('');
}

/* ══════════════════════════════
   PUBLICATION ANNONCE
══════════════════════════════ */
async function publierAnnonce() {
  const type     = document.getElementById('pubType')?.value;
  const ville    = document.getElementById('pubVille')?.value;
  const quartier = document.getElementById('pubQuartier')?.value?.trim();
  const prix     = parseInt(document.getElementById('pubPrix')?.value || '0');
  const titre    = document.getElementById('pubTitre')?.value?.trim();
  const tel      = document.getElementById('pubTel')?.value?.trim();
  const statut   = document.getElementById('pubStatut')?.value || 'disponible';

  if (!type || !ville || !quartier || !prix || !titre || !tel) {
    afficherToast('⚠️ Remplissez tous les champs obligatoires (*)');
    return;
  }

  const tags = [...document.querySelectorAll('#tagsPicker input:checked')].map(i => i.value);
  const desc = document.getElementById('pubDesc')?.value?.trim() || '';
  const surface = parseInt(document.getElementById('pubSurface')?.value || '0');
  const chambres = parseInt(document.getElementById('pubChambres')?.value || '0');
  const sdb = parseInt(document.getElementById('pubSdb')?.value || '0');

  const btn = document.getElementById('pubBtnText');
  btn.textContent = '⏳ Publication en cours...';

  const newAnnonce = {
    id: 'ann' + Date.now(),
    titre, type, ville, quartier, prix,
    surface, chambres, sallesDeau: sdb,
    tags, statut, tel, proprio: 'Admin',
    desc, vues: 0,
    dateCreation: new Date().toLocaleDateString('fr-FR'),
  };

  try {
    if (typeof firebase !== 'undefined' && firebase.firestore) {
      await firebase.firestore().collection('annonces').doc(newAnnonce.id).set(newAnnonce);
    }
    annoncesData.unshift(newAnnonce);
    loadDashboard();
    afficherToast('✅ Annonce publiée avec succès !');
    resetForm();
    showPage('annonces');
  } catch (err) {
    afficherToast('❌ Erreur lors de la publication');
    console.error(err);
  } finally {
    btn.textContent = '📤 Publier l\'annonce';
  }
}

async function genererTitreIA() {
  const type     = document.getElementById('pubType')?.value;
  const ville    = document.getElementById('pubVille')?.value;
  const quartier = document.getElementById('pubQuartier')?.value?.trim();
  const prix     = document.getElementById('pubPrix')?.value;
  const surface  = document.getElementById('pubSurface')?.value;
  const chambres = document.getElementById('pubChambres')?.value;
  const tags = [...document.querySelectorAll('#tagsPicker input:checked')].map(i => i.value);

  if (!type || !ville) {
    afficherToast('⚠️ Choisissez au moins le type et la ville');
    return;
  }

  const btn = document.querySelector('.btn-ia-gen');
  btn.textContent = '⏳ Génération en cours...';

  const prompt = `Génère un titre accrocheur et une description professionnelle pour une annonce immobilière gabonaise.
Type de bien : ${type}
Ville : ${ville}
Quartier : ${quartier || 'non précisé'}
Prix : ${prix ? prix + ' FCFA/mois' : 'non précisé'}
Surface : ${surface ? surface + ' m²' : 'non précisée'}
Chambres : ${chambres || 'non précisé'}
Équipements : ${tags.length ? tags.join(', ') : 'non précisés'}

Réponds UNIQUEMENT en JSON avec ce format exact :
{"titre": "...", "description": "..."}
Le titre doit faire max 60 caractères. La description doit faire 80-120 mots. Sois précis et professionnel.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: 'Tu es un expert en immobilier gabonais. Réponds UNIQUEMENT en JSON valide, sans aucun texte avant ou après.',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const text = data.content?.map(c => c.text || '').join('') || '{}';
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    if (parsed.titre) document.getElementById('pubTitre').value = parsed.titre;
    if (parsed.description) document.getElementById('pubDesc').value = parsed.description;
    afficherToast('✨ Titre et description générés par l\'IA !');
  } catch (err) {
    afficherToast('❌ Erreur IA. Réessayez.');
    console.error(err);
  } finally {
    btn.textContent = '✨ Générer titre et description avec l\'IA';
  }
}

function resetForm() {
  ['pubType','pubVille','pubQuartier','pubPrix','pubSurface','pubChambres','pubSdb','pubTel','pubTitre','pubDesc'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.querySelectorAll('#tagsPicker input').forEach(i => i.checked = false);
}

/* ══════════════════════════════
   HELPERS UI
══════════════════════════════ */
function statutBadge(statut) {
  const map = {
    'disponible': '<span class="badge badge-green">🟢 Disponible</span>',
    'réservé':    '<span class="badge badge-yellow">🟡 Réservé</span>',
    'loué':       '<span class="badge badge-red">🔴 Loué</span>',
    'masqué':     '<span class="badge badge-gray">⚫ Masqué</span>',
  };
  return map[statut] || `<span class="badge badge-gray">${statut}</span>`;
}

function roleBadge(role) {
  const map = {
    admin:        '<span class="badge badge-green">Admin</span>',
    proprietaire: '<span class="badge badge-blue">Propriétaire</span>',
    locataire:    '<span class="badge badge-gray">Locataire</span>',
  };
  return map[role] || `<span class="badge badge-gray">${role}</span>`;
}

/* ══════════════════════════════
   THÈME
══════════════════════════════ */
function initTheme() {
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeBtn();
}

function toggleTheme() {
  theme = theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('malaga_admin_theme', theme);
  updateThemeBtn();
}

function updateThemeBtn() {
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

/* ══════════════════════════════
   SIDEBAR MOBILE
══════════════════════════════ */
function initSidebar() {
  document.getElementById('burgerAdmin')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('open');
  });
  document.getElementById('sidebarClose')?.addEventListener('click', closeSidebarMobile);
}

function closeSidebarMobile() {
  document.getElementById('sidebar')?.classList.remove('open');
}

/* ══════════════════════════════
   TOPBAR DATE
══════════════════════════════ */
function initTopbarDate() {
  const el = document.getElementById('topbarDate');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
}

/* ══════════════════════════════
   MODAL CONFIRMATION
══════════════════════════════ */
let confirmCallback = null;

function confirmer(title, msg, callback) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalMsg').textContent = msg;
  document.getElementById('modalOverlay') || (document.getElementById('modalConfirm').id = 'modalConfirm');
  document.getElementById('modalConfirm').classList.remove('hidden');
  confirmCallback = callback;
  document.getElementById('modalConfirmBtn').onclick = () => {
    fermerModal();
    if (confirmCallback) confirmCallback();
  };
}

function fermerModal() {
  document.getElementById('modalConfirm').classList.add('hidden');
  confirmCallback = null;
}

/* ══════════════════════════════
   TOAST
══════════════════════════════ */
let toastTimer;
function afficherToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 3000);
}
