import { el, create, loadHTML } from './lib.js';
import { showSaveShoppingItemArea } from './db_save_shopping_item.js';
import { showRatingArea } from './db_save_rating.js';
import { showSaveArea } from './db_save_recipe.js';
import { findRating } from './db_read_recipes.js';
import {showFilterArea} from './main.js';


let recipe;

export async function showRecipe(obj, recId) {

  // #content-output befüllen mit #recipe-area html:
  const html = await loadHTML('data/recipe-card.html');
  el('#content-output').innerHTML = html;

  // überprüfen, ob obj ein Array ist (wenn von main.js übergeben) oder ein Objekt (wenn von db_read_recipes.js übergeben)
  if (Array.isArray(obj)) {
    // wenn ja, dann solange ein zufälliges Rezept aus obj-Array auswählen.. 
    do {
      const randomIndex = Math.floor(Math.random() * obj.length);
      recipe = obj[randomIndex];
    } while ( // ..bis die Bedingung erfüllt ist, dass mehr als ein Rezept im obj-Array vorhanden ist & die Rezept-id mit der aus showInfo() übergebenen Rezept-id übereinstimmt --> sicherstellen, dass nicht 2x hintereinander das gleiche Rezept angezeigt wird
      obj.length > 1 && recipe.id === recId
    );

  } else {
    // wenn nein, dann entspricht Rezept bereits dem obj
    recipe = obj;
  } 
  // Rezept content - ouput generieren
  recipeOutputGenerator(obj);
}


// Rezept content - ouput generieren
function recipeOutputGenerator (object) {
  // Rezept - Bild 
  const img = create('img');
  img.style.maxHeight = '310px';
  img.style.maxWidth = '310px';
  img.src = recipe.image;
  el('.recipe-img').append(img);

  // Rezept - Titel 
  const h3 = create('h3');
  h3.innerText = recipe.name;
  el('.info-title').append(h3);

  // Rezept - Infobox 
  insertInfos();

  // Zutaten - Titel
  const ingredientsTitle = create('h4');
  ingredientsTitle.innerText = 'Ingredients:';
  el('.ingredients-title').append(ingredientsTitle);

  // Zutaten - Tabelle
  const table = create('table');
  recipe.ingredients.forEach((ingr) => {
    const tr = create('tr');

    // checkbox für jede Zutat
    const inputTd = create('td');
    const input = create('input');
    input.type = 'checkbox';
    input.id = ingr;
    input.checked = false;     // checked Status false setzen
    // bei setzen eines checkmarks wird label-text durchgestrichen
    input.addEventListener('change', ()=>{
      if (input.checked){
        label.style.textDecoration = 'line-through'
      } else {
        // wenn checkmark entfernt wird, ist label-text nicht länger durchgestrichen
        label.style.textDecoration = 'none'
      }
    });
    inputTd.append(input);
    tr.append(inputTd);

    // label für jede Zutat
    const labelTd = create('td');
    const label = create('label');
    label.htmlFor = input.id;
    label.innerText = ingr;
    // wenn Zutat Status checked hat...
    if (ingr.checked === true) {
      // ...label-Text durchstreichen
      label.style.textDecoration = 'line-through';
    }
    labelTd.append(label);
    tr.append(labelTd);

    // button - Zutat speichern
    const btnTd = create('td');
    const addBtn = create('button');
    addBtn.innerHTML = `<img src="img/icons/add_icon.png" alt="add to shopping list">`;
  // bei Klick auf button - Maske öffnet sich zum Speichern der Zutat
    addBtn.addEventListener('click', () => {
      showSaveShoppingItemArea(ingr);
    });
    btnTd.append(addBtn);
    tr.append(btnTd);

    table.append(tr);
  });
  el('.ingredients').append(table);

  // Kochanweisungen - Titel
  const instructionsTitle = create('h4');
  instructionsTitle.innerText = 'Instructions:';
  el('.instructions-title').append(instructionsTitle);

  // Kochanweisungen - Arbeitsschritte
  const ol = create('ol');
  recipe.instructions.forEach((instr) => {
    const li = create('li');
    li.innerText = instr;
    ol.append(li);
  });
  el('.instructions').append(ol);

  // Buttons
  // button - Bewertung abgeben
  const rateBtn = create('button');
  rateBtn.innerText = 'Rate Recipe';
  // bei Klick auf button - Maske öffnet sich zur Abgabe der Bewertung
  rateBtn.addEventListener('click', () => {
    showRatingArea(recipe);
  });
  el('.rate-btn').append(rateBtn);

  // überprüfen, ob obj ein Array ist: nur wenn ja, sollen buttons zum Speichern des Rezepts u. erneutem Generieren eines Zufallsrezepts angezeigt werden (beide buttons sollen nicht angezeigt werden, wenn man aus der Ansicht "Saved Recipes" kommt und dort auf ein Rezept geklickt hat)
  if (Array.isArray(object)) {
    // button - Rezept speichern
    const saveBtn = create('button');
    saveBtn.innerText = 'Save Recipe';
    // bei Klick auf button - Maske öffnet sich zum Speichern des Rezepts
    saveBtn.addEventListener('click', () => {
      showSaveArea(recipe);
    });
    el('.save-btn').append(saveBtn);

    // button - neues Zufallsrezept anzeigen (weiterhin basierend auf zuvor gesetzten Filtern)
    const diffRecipeBtn = create('button');
    diffRecipeBtn.innerText = 'Try Different Recipe';
    // bei Klick auf button - neues Zufallsrezept anzeigen
    diffRecipeBtn.addEventListener('click', () => {
      // Hinweis anzeigen, wenn mit den gesetzten Filtern weniger als 5 Rezepte angezeigt werden können
      if (object.length < 5) {
        showInfo(object, object.length, recipe.id);
      } else {
        showRecipe(object);
      }
    });
    el('.diff-recipe-btn').append(diffRecipeBtn);
  }
}


// Rezept - Infobox befüllen
export async function insertInfos() {
  // Infobox wird jedes Mal entleert und neu gefüllt
  el('.infos').innerHTML = '';

  // Array mit Infos
  const infos = [
    `Meal Type: ${recipe.mealType}`,
    `Cuisine: ${recipe.cuisine}`,
    `Difficulty: ${recipe.difficulty}`,
    `Prep Time: ${recipe.prepTimeMinutes} Minutes`,
    `Cook Time: ${recipe.cookTimeMinutes} Minutes`,
  ];

  // Überprüfen, ob/welche Bewertung bereits zu dem Rezept abgegeben wurde
  const rating = await findRating(recipe.id);
  // Bewertung dem Info-Array hinzufügen
  infos.push(`My Rating: ${rating}`);

  // Infos im DOM ausgeben
  infos.forEach((info) => {
    const p = create('p');
    p.innerText = info;
    el('.infos').append(p);
  });
}


async function showInfo(obj, num, recId) {
    const dbArea = el('#db-area');
    // popup Maske aktiv setzen und mit html befüllen
    dbArea.className = 'area-active';
    const html = await loadHTML('data/popup.html');
    dbArea.innerHTML = html;

    // popup - Titel
    el('#popup-h3').innerText = 'Info'

    // popup - Infotext
    el('#popup-p').innerText = `Only ${num} recipe(s) match your filter selection. You might consider changing your filter selection to display more recipes.`;

    // popup button - Filter ändern 
    const btnChangeFilters = el('#popup-btn-1');
    btnChangeFilters.innerText = 'Change Filters';
    // bei Klick auf button..
    btnChangeFilters.addEventListener('click', ()=>{
        // ..Maske entfernen
        dbArea.innerHTML = '';
        dbArea.className = 'area-passive';
        // ..zurück zu Start/Filterbereich
        showFilterArea()
    });

    // popup button - Filter beibehalten 
    const btnIgnore = el('#popup-btn-2');
    btnIgnore.innerText = 'Ignore';
    // bei Klick auf button..
    btnIgnore.addEventListener('click', ()=>{
        // ..Maske entfernen
        dbArea.innerHTML = '';
        dbArea.className = 'area-passive';
        // ..neues Rezept mit gesetzten Filtern anzeigen
        showRecipe(obj, recId)
    });

    el('#popup-btns').append(btnIgnore)
}