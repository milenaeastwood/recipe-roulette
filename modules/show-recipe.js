import { el, create, loadHTML } from './lib.js';
import { showSaveShoppingItemArea } from './db_save_shopping_item.js';
import { showRatingArea } from './db_save_rating.js';
import { showSaveArea } from './db_save_recipe.js';
import { findRating } from './db_read_recipes.js';
import {showFilterArea} from './main.js';


let recipe;

export async function showRecipe(obj, recId) {

  const html = await loadHTML('data/recipe-card.html');
  el('#content-output').innerHTML = html;

  if (Array.isArray(obj)) {
    do {
      const randomIndex = Math.floor(Math.random() * obj.length);
      recipe = obj[randomIndex];
    } while ( 
      obj.length > 1 && recipe.id === recId
    );

  } else {
    recipe = obj;
  } 
  recipeOutputGenerator(obj);
}

function recipeOutputGenerator (object) {
  const img = create('img');
  img.style.maxHeight = '310px';
  img.style.maxWidth = '310px';
  img.src = recipe.image;
  el('.recipe-img').append(img);

  const h3 = create('h3');
  h3.innerText = recipe.name;
  el('.info-title').append(h3);

  insertInfos();

  const ingredientsTitle = create('h4');
  ingredientsTitle.innerText = 'Ingredients:';
  el('.ingredients-title').append(ingredientsTitle);

  const table = create('table');
  recipe.ingredients.forEach((ingr) => {
    const tr = create('tr');

    const inputTd = create('td');
    const input = create('input');
    input.type = 'checkbox';
    input.id = ingr;
    input.checked = false;    
    input.addEventListener('change', ()=>{
      if (input.checked){
        label.style.textDecoration = 'line-through'
      } else {
        label.style.textDecoration = 'none'
      }
    });
    inputTd.append(input);
    tr.append(inputTd);

    const labelTd = create('td');
    const label = create('label');
    label.htmlFor = input.id;
    label.innerText = ingr;
    if (ingr.checked === true) {
      label.style.textDecoration = 'line-through';
    }
    labelTd.append(label);
    tr.append(labelTd);

    const btnTd = create('td');
    const addBtn = create('button');
    addBtn.innerHTML = `<img src="img/icons/add_icon.png" alt="add to shopping list">`;
    addBtn.addEventListener('click', () => {
      showSaveShoppingItemArea(ingr);
    });
    btnTd.append(addBtn);
    tr.append(btnTd);

    table.append(tr);
  });
  el('.ingredients').append(table);

  const instructionsTitle = create('h4');
  instructionsTitle.innerText = 'Instructions:';
  el('.instructions-title').append(instructionsTitle);

  const ol = create('ol');
  recipe.instructions.forEach((instr) => {
    const li = create('li');
    li.innerText = instr;
    ol.append(li);
  });
  el('.instructions').append(ol);

  const rateBtn = create('button');
  rateBtn.innerText = 'Rate Recipe';
  rateBtn.addEventListener('click', () => {
    showRatingArea(recipe);
  });
  el('.rate-btn').append(rateBtn);

  if (Array.isArray(object)) {
    const saveBtn = create('button');
    saveBtn.innerText = 'Save Recipe';
    saveBtn.addEventListener('click', () => {
      showSaveArea(recipe);
    });
    el('.save-btn').append(saveBtn);

    const diffRecipeBtn = create('button');
    diffRecipeBtn.innerText = 'Try Different Recipe';
    diffRecipeBtn.addEventListener('click', () => {
      if (object.length < 5) {
        showInfo(object, object.length, recipe.id);
      } else {
        showRecipe(object);
      }
    });
    el('.diff-recipe-btn').append(diffRecipeBtn);
  }
}

export async function insertInfos() {
  el('.infos').innerHTML = '';

  const infos = [
    `Meal Type: ${recipe.mealType}`,
    `Cuisine: ${recipe.cuisine}`,
    `Difficulty: ${recipe.difficulty}`,
    `Prep Time: ${recipe.prepTimeMinutes} Minutes`,
    `Cook Time: ${recipe.cookTimeMinutes} Minutes`,
  ];

  const rating = await findRating(recipe.id);
  infos.push(`My Rating: ${rating}`);

  infos.forEach((info) => {
    const p = create('p');
    p.innerText = info;
    el('.infos').append(p);
  });
}


async function showInfo(obj, num, recId) {
    const dbArea = el('#db-area');
    dbArea.className = 'area-active';
    const html = await loadHTML('data/popup.html');
    dbArea.innerHTML = html;

    el('#popup-h3').innerText = 'Info'

    el('#popup-p').innerText = `Only ${num} recipe(s) match your filter selection. You might consider changing your filter selection to display more recipes.`;

    const btnChangeFilters = el('#popup-btn-1');
    btnChangeFilters.innerText = 'Change Filters';
    btnChangeFilters.addEventListener('click', ()=>{
        dbArea.innerHTML = '';
        dbArea.className = 'area-passive';
        showFilterArea()
    });

    const btnIgnore = el('#popup-btn-2');
    btnIgnore.innerText = 'Ignore';
    btnIgnore.addEventListener('click', ()=>{
        dbArea.innerHTML = '';
        dbArea.className = 'area-passive';
        showRecipe(obj, recId)
    });

    el('#popup-btns').append(btnIgnore)
}
