import {db} from './db.js';
import { el, create ,loadHTML } from "./lib.js";

export async function showShoppingList () {

    const html = await loadHTML('data/saved-data.html');
    el('#content-output').innerHTML = html;
    
    const savedData = await db.readAll();
    const savedIngredients = savedData.filter(data=>data.id.includes('ingredient'));

    el('#saved-data h3').innerText = 'Shopping List';

    const table = create('table');
    table.className = 'ingredients-table';

    savedIngredients.forEach(ingr=>{
        const tr = create('tr');
        
        const input = create('input');
        input.type = 'checkbox';
        input.id = ingr.ingredient;
        input.checked = ingr.checked; 
        input.addEventListener('change', ()=>{changeCheckedStatus(input, label, ingr)})
        tr.append(input);

        const label = create('label');
        label.htmlFor = input.id;
        label.innerText = ingr.ingredient;

        if (ingr.checked === true) {
            // ...label-Text durchstreichen
            label.style.textDecoration = 'line-through';
        }
    
        tr.append(label);

        const btnTd = create('td');
        const deleteBtn = create('button');
        deleteBtn.innerText = 'X';
        deleteBtn.addEventListener('click', ()=>{
            tr.remove();
            db.deleteItem(ingr.id)
        })
        btnTd.append(deleteBtn);
        tr.append(btnTd);

        table.append(tr);
    });
    el('#data-output').append(table);
}

function changeCheckedStatus(inputStatus, labelStatus, ingredient) {
    if (inputStatus.checked){
        labelStatus.style.textDecoration = 'line-through'} else {
        labelStatus.style.textDecoration = 'none'
    }
    db.update({
        id: `ingredient-${ingredient.ingredient}`,
        ingredient: ingredient.ingredient,
        checked: inputStatus.checked
    });
}
