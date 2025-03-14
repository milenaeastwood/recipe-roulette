
import {db} from './db.js';
import { el, create, loadHTML } from "./lib.js";
import {showRecipe} from './show-recipe.js';

// gespeicherte Rezepte anzeigen
export async function showSavedRecipes () {

    // #content-output befüllen mit #saved-data html:
    const html = await loadHTML('data/saved-data.html');
    el('#content-output').innerHTML = html;

    // alle gespeicherten Daten aus db auslesen
    const savedData = await db.readAll();
    // nur Rezepte  filtern anhand von id (muss 'recipe' enthalten)
    const savedRecipes = savedData.filter(data=>data.id.includes('recipe'));

    // Titel
    el('#saved-data h3').innerText = 'Saved Recipes';

    // Tabelle für Rezepte erstellen
    const table = create('table');

    // über jedes Rezept iterieren zum befüllen der Tabelle
    savedRecipes.forEach(rec=>{
        const tr = create('tr');

        // Rezept - name
        const nameTd = create('td');
        const p = create('p');
        p.innerText = rec.data.name;
        p.className = 'saved-recipe-title';
        // mit Klick auf Rezept-name öffnet sich Rezept
        nameTd.addEventListener('click',()=>{showRecipe(rec.data)});
        nameTd.append(p);
        tr.append(nameTd);

        // Rezept - Bewertung
        const myRating = create('td');

        // Überprüfen, ob zu dem Rezept bereits eine Bewertung abgegeben wurde
        // auf Promise von findRating warten und auflösen..
        findRating(rec.data.id).then(rating => {  
            myRating.innerText = `My Rating: ${rating}`; // ..wenn aufgelöst: Zelltext mit Bewertung befüllen
        });        
        tr.append(myRating);

        // button - Rezept löschen
        const btnTd = create('td');
        const deleteBtn = create('button');
        deleteBtn.innerText = 'X';
        // Rezept aus DOM und Datenbank löschen
        deleteBtn.addEventListener('click', ()=>{
            tr.remove();
            db.deleteItem(rec.id)
        })
        btnTd.append(deleteBtn);
        tr.append(btnTd);

        table.append(tr);

    })
    // Tabelle ins DOM einfügen
    el('#data-output').append(table);

}

// Überprüfen, ob Bewertung zum Rezept abgegen wurde
export async function findRating(id){
    // alle gespeicherten Daten aus db auslesen
    const savedData = await db.readAll();
    // nur Bewertungen filtern anhand von id (muss 'rating' enthalten)
    const savedRatings = savedData.filter(data=>data.id.includes('rating'));
    // überprüfen, ob innerhalb der gespeicherten Bewertungen die Eigenschaft data.id eines Bewertungs-Objekts mit der data.id-Eigenschaft des zu vergleichenden Rezept-Objekts übereinstimmt
    const checkRating = savedRatings.find(rating => rating.data.id === id);
        // wenn ja, Text mit entsprechender Bewertung ausgeben
        if (checkRating) {
            return `${checkRating.rating}/5 Stars`;
        } else {
            return '---';
        }
}