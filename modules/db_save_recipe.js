import {db} from './db.js';
import {el, loadHTML} from './lib.js';

const dbArea = el('#db-area');

export async function showSaveArea(obj) { 
    dbArea.className = 'area-active';
    const html = await loadHTML('data/popup.html');
    dbArea.innerHTML = html;

    el('#popup-h3').innerText = ' Save Recipe';

    el('#popup-p').innerText = 'Your recipe will be saved in the Indexed DB of your browser.';

    const btnCancel = el('#popup-btn-1');
    btnCancel.innerText = 'Cancel';
    btnCancel.addEventListener('click', ()=>{
        dbArea.innerHTML = '';
        dbArea.className = 'area-passive';
    });
    
    const btnSave = el('#popup-btn-2');
    btnSave.innerText = 'Save';
    btnSave.addEventListener('click', ()=>{saveRecipe(obj)});
}

async function saveRecipe(obj) {
    const dbObj = {
        id : `recipe-${obj.id}`,   // id zur Unterscheidung zw. in db gespeicherten ingredients, recipes, rating
        data: obj,
        rating : '-'
    }

    const savedRecipes = await db.readAll();
    const duplicate = savedRecipes.find(rec=>rec.id === dbObj.id);
    if (duplicate) {
        const info = el('.info');
        info.innerText = `You have already saved the recipe "${dbObj.data.name}" in Indexed DB. You cannot save it again.`;
        info.style.fontStyle = 'italic';
        info.style.color = 'red';
        el('#popup-btn-2').style.display = 'none';
        return;
    }

    db.update(dbObj);

    dbArea.innerHTML = '';
    dbArea.className = 'area-passive';
}
