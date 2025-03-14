import {db} from './db.js';
import { el, create ,loadHTML } from "./lib.js";

// Einkaufsliste anzeigen
export async function showShoppingList () {

    // #content-output befüllen mit #shopping-list html:
    const html = await loadHTML('data/saved-data.html');
    el('#content-output').innerHTML = html;
    
    // alle gespeicherten Daten aus db auslesen
    const savedData = await db.readAll();

    // nur Zutaten filtern anhand von id (muss 'ingredient' enthalten)
    const savedIngredients = savedData.filter(data=>data.id.includes('ingredient'));

    // Titel
    el('#saved-data h3').innerText = 'Shopping List';

    // Tabelle für Zutaten erstellen
    const table = create('table');
    table.className = 'ingredients-table';

    // über jede Zutat iterieren zum befüllen der Tabelle
    savedIngredients.forEach(ingr=>{
        const tr = create('tr');
        
        // checkbox für jede Zutat
        const input = create('input');
        input.type = 'checkbox';
        input.id = ingr.ingredient;
        input.checked = ingr.checked;   // checked-Status in Tabelle entspricht dem in db gespeicherten Zutaten-checked-Status
        // bei Klick auf checkbox verändert sich checked-Status
        input.addEventListener('change', ()=>{changeCheckedStatus(input, label, ingr)})
        tr.append(input);

        // label - Zutat
        const label = create('label');
        label.htmlFor = input.id;
        label.innerText = ingr.ingredient;

        // wenn Zutat Status checked hat...
        if (ingr.checked === true) {
            // ...label-Text durchstreichen
            label.style.textDecoration = 'line-through';
        }
    
        tr.append(label);

        // button - Zutat löschen
        const btnTd = create('td');
        const deleteBtn = create('button');
        deleteBtn.innerText = 'X';
        // Zutat aus DOM und Datenbank löschen
        deleteBtn.addEventListener('click', ()=>{
            tr.remove();
            db.deleteItem(ingr.id)
        })
        btnTd.append(deleteBtn);
        tr.append(btnTd);

        table.append(tr);
    });
    // Tabelle ins DOM einfügen
    el('#data-output').append(table);
}

// checked-Status verändern
function changeCheckedStatus(inputStatus, labelStatus, ingredient) {
    // wenn checked Status (inputStatus) true ist, dann label (labelStytus) durchstreichen - wenn false, dann nicht durchstreichen
    if (inputStatus.checked){
        labelStatus.style.textDecoration = 'line-through'} else {
        labelStatus.style.textDecoration = 'none'
    }
    // Zutaten-Objekt mit checked Status in db aktualisieren
    db.update({
        id: `ingredient-${ingredient.ingredient}`,
        ingredient: ingredient.ingredient,
        checked: inputStatus.checked
    });
}