import {db} from './db.js';
import {el, loadHTML} from './lib.js';

const dbArea = el('#db-area');

export async function showSaveShoppingItemArea(ingr) {
    dbArea.className = 'area-active';
    const html = await loadHTML('data/popup.html');
    dbArea.innerHTML = html;

    el('#popup-h3').innerText = 'Add to Shopping List';

    el('#popup-p').innerText = `The item "${ingr}" will be saved in the Indexed DB of your browser.`;

    const btnCancel = el('#popup-btn-1');
    btnCancel.innerText = 'Cancel';
    btnCancel.addEventListener('click', ()=>{
        dbArea.innerHTML = '';
        dbArea.className = 'area-passive';
    });
    
    const btnSave = el('#popup-btn-2');
    btnSave.innerText = 'Save';
    btnSave.addEventListener('click', ()=>{addToShoppingList(ingr)});
}

export async function addToShoppingList(obj) {
    const dbObj = {
        id : `ingredient-${obj}`,  
        ingredient : obj,
        checked : false            
    };
    
    const savedShoppingItems = await db.readAll();
    const duplicate = savedShoppingItems.find(item=>item.id === dbObj.id);
    if (duplicate) {
        const info = el('.info');
        info.innerText = `You have already saved the item "${dbObj.ingredient}" on your shopping list. You cannot save it again.`;
        el('#popup-btn-2').style.display = 'none';
        info.style.fontStyle = 'italic';
        info.style.color = 'red';
        return;
    }

    db.update(dbObj);

    dbArea.innerHTML = '';
    dbArea.className = 'area-passive';
}
