import {db} from './db.js';
import {el, loadHTML} from './lib.js';

const dbArea = el('#db-area');

// Maske - Rezept speichern anzeigen
export async function showSaveArea(obj) { 
    // popup Maske aktiv setzen und mit html befüllen
    dbArea.className = 'area-active';
    const html = await loadHTML('data/popup.html');
    dbArea.innerHTML = html;

    // popup - Titel
    el('#popup-h3').innerText = ' Save Recipe';

    // popup - Infotext
    el('#popup-p').innerText = 'Your recipe will be saved in the Indexed DB of your browser.';

    // popup button - abbrechen
    const btnCancel = el('#popup-btn-1');
    btnCancel.innerText = 'Cancel';
    // bei Klick auf button Maske entfernen
    btnCancel.addEventListener('click', ()=>{
        dbArea.innerHTML = '';
        dbArea.className = 'area-passive';
    });
    
    // popup button - Rezept speichern
    const btnSave = el('#popup-btn-2');
    btnSave.innerText = 'Save';
    // bei Klick auf button Rezept auf Merkliste speichern
    btnSave.addEventListener('click', ()=>{saveRecipe(obj)});
}

// Rezept in indexedDB speichern
async function saveRecipe(obj) {

    // Rezept-Objekt zum Speichern anlegen
    const dbObj = {
        id : `recipe-${obj.id}`,   // id zur Unterscheidung zw. in db gespeicherten ingredients, recipes, rating
        data: obj,
        rating : '-'
    }

    // Überprüfen, ob Rezept bereits gespeichert:
    // alle Daten aus db auslesen
    const savedRecipes = await db.readAll();
    // Duplikat anhand von id finden
    const duplicate = savedRecipes.find(rec=>rec.id === dbObj.id);
    // wenn Duplikat vorhanden: Infotext anzeigen & speicher-button verstecken
    if (duplicate) {
        const info = el('.info');
        info.innerText = `You have already saved the recipe "${dbObj.data.name}" in Indexed DB. You cannot save it again.`;
        info.style.fontStyle = 'italic';
        info.style.color = 'red';
        el('#popup-btn-2').style.display = 'none';
        return;
    }

    // in indexedDB speichern
    db.update(dbObj);

    // Maske entfernen:
    dbArea.innerHTML = '';
    dbArea.className = 'area-passive';
}