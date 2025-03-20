
import {db} from './db.js';
import { el, create, loadHTML } from "./lib.js";
import {showRecipe} from './show-recipe.js';

export async function showSavedRecipes () {

    const html = await loadHTML('data/saved-data.html');
    el('#content-output').innerHTML = html;

    const savedData = await db.readAll();
    const savedRecipes = savedData.filter(data=>data.id.includes('recipe'));

    el('#saved-data h3').innerText = 'Saved Recipes';

    const table = create('table');

    savedRecipes.forEach(rec=>{
        const tr = create('tr');

        const nameTd = create('td');
        const p = create('p');
        p.innerText = rec.data.name;
        p.className = 'saved-recipe-title';
        nameTd.addEventListener('click',()=>{showRecipe(rec.data)});
        nameTd.append(p);
        tr.append(nameTd);

        const myRating = create('td');

        findRating(rec.data.id).then(rating => {  
            myRating.innerText = `My Rating: ${rating}`; 
        });        
        tr.append(myRating);

        const btnTd = create('td');
        const deleteBtn = create('button');
        deleteBtn.innerText = 'X';
        deleteBtn.addEventListener('click', ()=>{
            tr.remove();
            db.deleteItem(rec.id)
        })
        btnTd.append(deleteBtn);
        tr.append(btnTd);

        table.append(tr);

    })
    el('#data-output').append(table);

}

export async function findRating(id){
    const savedData = await db.readAll();
    const savedRatings = savedData.filter(data=>data.id.includes('rating'));
    const checkRating = savedRatings.find(rating => rating.data.id === id);
        if (checkRating) {
            return `${checkRating.rating}/5 Stars`;
        } else {
            return '---';
        }
}
