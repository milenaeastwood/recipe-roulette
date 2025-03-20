import { el, group, loadJSON, loadHTML } from './lib.js';
import { showRecipe } from './show-recipe.js';

let recipeData;  
let filteredRecipes;

export async function loadRecipes() {
  const data = await loadJSON('https://dummyjson.com/recipes');
  recipeData = data.recipes;
  filteredRecipes = [...recipeData];  // mit allen Daten befüllen, falls Filterfunktion nicht angewendet wird (da an showRecipe() weitergegeben wird s.u.)
  showFilterArea();   // Filterbereich aufrufen
}

// 
export async function showFilterArea () {
  const html = await loadHTML('data/filter-area.html');
  el('#content-output').innerHTML = html;
 
  group('#filter-div select').forEach((sel)=>{
    sel.addEventListener('change', filterRecipes)
  });

  el('#btn-reset').addEventListener('click', resetFilter);

  el('#btn-get-recipe').addEventListener('click', () => {
    if (filteredRecipes.length === 0) {
      showAlert();
      return;
    }
    showRecipe(filteredRecipes);
  });
}

function filterRecipes() {
  filteredRecipes = [...recipeData];

  const selectedMealType = el("#mealType").value;
  const selectedCuisine = el("#cuisine").value;
  const selectedDifficulty = el("#difficulty").value;

  if (selectedMealType) {
    filteredRecipes = filteredRecipes.filter(recipe => recipe.mealType.includes(selectedMealType));
  }

  if (selectedCuisine) {
    filteredRecipes = filteredRecipes.filter(recipe => recipe.cuisine === selectedCuisine);
  }

  if (selectedDifficulty) {
    filteredRecipes = filteredRecipes.filter(recipe => recipe.difficulty === selectedDifficulty);
  }
}

function resetFilter() {
  filteredRecipes = [...recipeData];
}

async function showAlert() {
  const dbArea = el('#db-area');
  dbArea.className = 'area-active';
  const html = await loadHTML('data/popup.html');
  dbArea.innerHTML = html;

  el('#popup-h3').innerText = 'Info'

  el('#popup-p').innerText = `Oops… no recipe could be found - you've selected too many filters! Please remove one or more filters to continue.`;

  const btnChangeFilters = el('#popup-btn-1');
  btnChangeFilters.innerText = 'Go Back and Change Filters';
  btnChangeFilters.style.width = '12rem';
  btnChangeFilters.addEventListener('click', ()=>{
      dbArea.innerHTML = '';
      dbArea.className = 'area-passive';
      showFilterArea()
  });

  el('#popup-btn-2').style.display = 'none';
}

export function serviceWorkerActive(){
  if('serviceWorker' in navigator){
      navigator.serviceWorker.register('../service-worker.js',{
          scope : './'   
      })
  }
}
