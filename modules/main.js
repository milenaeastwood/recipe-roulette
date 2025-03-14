import { el, group, loadJSON, loadHTML } from './lib.js';
import { showRecipe } from './show-recipe.js';

let recipeData;         // alle Rezeptdaten
let filteredRecipes;    // gefilterten Rezeptdaten

// Rezept Daten laden
export async function loadRecipes() {
  const data = await loadJSON('https://dummyjson.com/recipes');
  recipeData = data.recipes;
  filteredRecipes = [...recipeData];  // mit allen Daten befüllen, falls Filterfunktion nicht angewendet wird (da an showRecipe() weitergegeben wird s.u.)
  showFilterArea();   // Filterbereich aufrufen
}

// 
export async function showFilterArea () {
  // #content-output Maske befüllen mit #filter-area html:
  const html = await loadHTML('data/filter-area.html');
  el('#content-output').innerHTML = html;
 
  // select Elemente bekommen Filterfunktion
  group('#filter-div select').forEach((sel)=>{
    sel.addEventListener('change', filterRecipes)
  });

  // button - alle Filter zurücksetzen
  el('#btn-reset').addEventListener('click', resetFilter);

  // button: Zufallsrezept generieren
  el('#btn-get-recipe').addEventListener('click', () => {
    // Meldung, falls zu viele Filter selektiert
    if (filteredRecipes.length === 0) {
      showAlert();
      // alert(`Oops… no recipe could be found - you've selected too many filters! Please remove one or more filters to continue.`);
      return;
    }
    // Zufallsrezept aus gefilterten Rezepten anzeigen
    showRecipe(filteredRecipes);
  });
}

// Rezepte filtern
function filterRecipes() {
  // bei jedem Funktionsaufruf wird filteredRecipes array zurückgesetzt u. mit allen Rezeptdaten neu befüllt
  filteredRecipes = [...recipeData];

  // selektierte Werte von select-option entnehmen
  const selectedMealType = el("#mealType").value;
  const selectedCuisine = el("#cuisine").value;
  const selectedDifficulty = el("#difficulty").value;

  // wenn mealType option-Element ausgewählt..
  if (selectedMealType) {
    // ..filteredRecipes filtern: enthält die mealType-Eigenschaft vom Rezept (Array mit 1-3 Strings) das value vom selektierten option-Element?
    filteredRecipes = filteredRecipes.filter(recipe => recipe.mealType.includes(selectedMealType));
  }

  // wenn cuisine option-Element ausgewählt..
  if (selectedCuisine) {
    // ..filteredRecipes filtern: entspricht die cuisine-Eigenschaft vom Rezept dem value vom selektierten option-Element?
    filteredRecipes = filteredRecipes.filter(recipe => recipe.cuisine === selectedCuisine);
  }

  // wenn difficulty option-Element ausgewählt..
  if (selectedDifficulty) {
    // ..filteredRecipes filtern: entspricht die difficulty-Eigenschaft vom Rezept dem value vom selektierten option-Element?
    filteredRecipes = filteredRecipes.filter(recipe => recipe.difficulty === selectedDifficulty);
  }
}

// alle Filter zurücksetzen
function resetFilter() {
  // filteredRecipes mit allen Rezeptdaten befüllen
  filteredRecipes = [...recipeData];
}

async function showAlert() {
  const dbArea = el('#db-area');
  // popup Maske aktiv setzen und mit html befüllen
  dbArea.className = 'area-active';
  const html = await loadHTML('data/popup.html');
  dbArea.innerHTML = html;

  // popup - Titel
  el('#popup-h3').innerText = 'Info'

  // popup - Infotext
  el('#popup-p').innerText = `Oops… no recipe could be found - you've selected too many filters! Please remove one or more filters to continue.`;

  // popup button - Filter ändern 
  const btnChangeFilters = el('#popup-btn-1');
  btnChangeFilters.innerText = 'Go Back and Change Filters';
  btnChangeFilters.style.width = '12rem';
  // bei Klick auf button..
  btnChangeFilters.addEventListener('click', ()=>{
      // ..Maske entfernen
      dbArea.innerHTML = '';
      dbArea.className = 'area-passive';
      // ..zurück zu Filterbereich 
      showFilterArea()
  });

  // 2. button verstecken
  el('#popup-btn-2').style.display = 'none';
}

// Service worker aktiv setzen
export function serviceWorkerActive(){
  if('serviceWorker' in navigator){
      navigator.serviceWorker.register('../service-worker.js',{
          scope : './'   
      })
  }
}