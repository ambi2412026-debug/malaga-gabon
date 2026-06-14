import { db } from './firebase-config.js';
import { collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Charger les annonces récentes
async function chargerAnnonces() {
  const container = document.getElementById('liste-annonces');
  try {
    const q = query(
      collection(db, 'annonces'),
      orderBy('dateCreation', 'desc'),
      limit(12)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      container.innerHTML = '<p style="text-align:center;color:#888;">Aucune annonce disponible pour le moment.</p>';
      return;
    }

    container.innerHTML = '';
    snapshot.forEach(doc => {
      const a = doc.data();
      container.innerHTML += `
        <div class="carte-annonce">
          <img src="${a.photo || 'placeholder.jpg'}" alt="${a.titre}">
          <div class="carte-info">
            <h3>${a.titre}</h3>
            <p class="prix">${a.prix ? a.prix.toLocaleString() + ' FCFA/mois' : 'Prix non défini'}</p>
            <p class="localisation">📍 ${a.ville || ''} — ${a.quartier || ''}</p>
            <span class="badge badge-${a.statut || 'disponible'}">
              ${a.statut === 'disponible' ? '🟢 Disponible' : 
                a.statut === 'reserve' ? '🟡 Réservé' : '🔴 Loué'}
            </span>
          </div>
        </div>
      `;
    });
  } catch (error) {
    container.innerHTML = '<p style="text-align:center;color:#888;">Chargement en cours...</p>';
  }
}

// Recherche
window.rechercherAnnonces = function() {
  const terme = document.getElementById('search-input').value;
  if (terme) {
    alert('Recherche : ' + terme + '\n(Fonctionnalité complète bientôt disponible)');
  }
}

// Lancer au chargement
document.addEventListener('DOMContentLoaded', chargerAnnonces);
