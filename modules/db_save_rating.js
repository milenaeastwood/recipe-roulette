import {el, loadHTML} from './lib.js';
import {db} from './db.js';
import { insertInfos } from './show-recipe.js';

const dbArea = el('#db-area');

// Maske - Bewertung abgeben anzeigen
export async function showRatingArea(obj) {
    // popup Maske aktiv setzen und mit html befüllen
    dbArea.className = 'area-active';
    const html = await loadHTML('data/popup.html');
    dbArea.innerHTML = html;

    // popup - Titel
    el('#popup-h3').innerText = ' Save Rating';

    // popup - Infotext
    el('#popup-p').innerText = 'Your rating will be saved in the Indexed DB of your browser.';
    
    // popup - html Struktur mit Auswahlfunktion einfügen 
    el('#popup-div').innerHTML = `
        <div id="rating-wrapper">
            <label for="recipe-rating">My Rating:</label>
            <select name="recipe-rating" id="recipe-rating" required>
                <option value="" selected disabled hidden>***</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="4">5</option>
            </select>
            <span>Stars</span>
        </div>`;


    // button - abbrechen
    const btnCancel = el('#popup-btn-1');
    btnCancel.innerText = 'Cancel';
    btnCancel.addEventListener('click', ()=>{
        // bei Klick auf button Maske entfernen
        dbArea.innerHTML = '';
        dbArea.className = 'area-passive';
    });

    // button - Bewertung speichern
    const btnSave = el('#popup-btn-2');
    btnSave.innerText = 'Save';
    // bei Klick auf button Bewertung in indxedDB speichern
    btnSave.addEventListener('click', ()=>{saveRating(obj)});
}


// Bewertung in indexedDB speichern
function saveRating(obj) {

    // selektierten Wert von select-option entnehmen
    const rating = el('#recipe-rating').value;
    
    // Bewertungs-Objekt zum Speichern anlegen
    const dbObj = {
        id : `rating-${obj.id}`,   // id zur Unterscheidung zw. in db gespeicherten ingredients, recipes, rating
        data : obj,
        rating : rating
    }

    // überprüfen, ob Bewertung abgegeben wurde:
    // wenn ja..
    if (rating) {
        // ..in indexedDB speichern
        db.update(dbObj);
        // Bewertung in Info-Box in recipe card aktualisieren
        insertInfos();
    } else { 
        // andernfalls Infotext ausgeben & speicher-button verstecken
        const info = el('.info');
        info.innerHTML = 'No rating has been given for saving.<br>Please rate between 0 and 5 stars.';
        info.style.fontStyle = 'italic';
        info.style.color = 'red';
        return;
    }
    
    // Maske entfernen:
    dbArea.innerHTML = '';
    dbArea.className = 'area-passive';
}