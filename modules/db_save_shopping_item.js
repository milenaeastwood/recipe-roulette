import {db} from './db.js';
import {el, loadHTML} from './lib.js';

const dbArea = el('#db-area');

// Maske - Zutat speichern anzeigen
export async function showSaveShoppingItemArea(ingr) {
    // popup Maske aktiv setzen und mit html befüllen
    dbArea.className = 'area-active';
    const html = await loadHTML('data/popup.html');
    dbArea.innerHTML = html;

    // popup - Titel
    el('#popup-h3').innerText = 'Add to Shopping List';

    // popup- Infotext: Hinweis, dass Zutat gespeichert werden soll
    el('#popup-p').innerText = `The item "${ingr}" will be saved in the Indexed DB of your browser.`;

    // popup button - abbrechen
    const btnCancel = el('#popup-btn-1');
    btnCancel.innerText = 'Cancel';
    // bei Klick auf button Maske entfernen
    btnCancel.addEventListener('click', ()=>{
        dbArea.innerHTML = '';
        dbArea.className = 'area-passive';
    });
    
    // popup button - Zutat speichern
    const btnSave = el('#popup-btn-2');
    btnSave.innerText = 'Save';
    // bei Klick auf button - auf Einkaufsliste speichern
    btnSave.addEventListener('click', ()=>{addToShoppingList(ingr)});
}


// Zutat in indexedDB speichern
export async function addToShoppingList(obj) {

    // Zutaten-Objekt zum Speichern erstellen
    const dbObj = {
        id : `ingredient-${obj}`,   // id zur Unterscheidung zw. in db gespeicherten ingredients, recipes, rating
        ingredient : obj,
        checked : false             // checked-Status setzen
    };

    // Überprüfen, ob Zutat bereits gespeichert:
    // alle Daten aus db auslesen
    const savedShoppingItems = await db.readAll();
    // Duplikat anhand von id finden
    const duplicate = savedShoppingItems.find(item=>item.id === dbObj.id);
    // wenn Duplikat vorhanden: Infotext ausgeben & speicher-button verstecken
    if (duplicate) {
        const info = el('.info');
        info.innerText = `You have already saved the item "${dbObj.ingredient}" on your shopping list. You cannot save it again.`;
        el('#popup-btn-2').style.display = 'none';
        info.style.fontStyle = 'italic';
        info.style.color = 'red';
        return;
    }

    // in indexedDB speichern
    db.update(dbObj);

    // Maske entfernen:
    dbArea.innerHTML = '';
    dbArea.className = 'area-passive';
}