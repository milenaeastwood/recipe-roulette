
import { el } from '../modules/lib.js';
import { loadRecipes, showFilterArea, serviceWorkerActive } from "../modules/main.js";
import { showSavedRecipes } from '../modules/db_read_recipes.js';
import { showShoppingList } from '../modules/db_read_shoppingList.js';
import { installButton } from '../modules/install.js';


loadRecipes();

// serviceWorkerActive();
installButton();

el('.btn-start').addEventListener('click', showFilterArea);
el('#btn-saved-recipes').addEventListener('click', showSavedRecipes);
el('#btn-shopping-list').addEventListener('click', showShoppingList);
