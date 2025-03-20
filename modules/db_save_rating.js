import {el, loadHTML} from './lib.js';
import {db} from './db.js';
import { insertInfos } from './show-recipe.js';

const dbArea = el('#db-area');

export async function showRatingArea(obj) {
    dbArea.className = 'area-active';
    const html = await loadHTML('data/popup.html');
    dbArea.innerHTML = html;

    el('#popup-h3').innerText = ' Save Rating';

    el('#popup-p').innerText = 'Your rating will be saved in the Indexed DB of your browser.';
    
    el('#popup-div').innerHTML = `
        <div id="rating-wrapper">
            <label for="recipe-rating">My Rating:</label>
            <select name="recipe-rating" id="recipe-rating" required>
                <option value="" selected disabled hidden>***</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="4">5</option>
            </select>
            <span>Stars</span>
        </div>`;


    const btnCancel = el('#popup-btn-1');
    btnCancel.innerText = 'Cancel';
    btnCancel.addEventListener('click', ()=>{
        dbArea.innerHTML = '';
        dbArea.className = 'area-passive';
    });

    const btnSave = el('#popup-btn-2');
    btnSave.innerText = 'Save';
    btnSave.addEventListener('click', ()=>{saveRating(obj)});
}

function saveRating(obj) {
    const rating = el('#recipe-rating').value;
    
    const dbObj = {
        id : `rating-${obj.id}`,  
        data : obj,
        rating : rating
    }

    if (rating) {
        db.update(dbObj);
        insertInfos();
    } else { 
        const info = el('.info');
        info.innerHTML = 'No rating has been given for saving.<br>Please rate between 0 and 5 stars.';
        info.style.fontStyle = 'italic';
        info.style.color = 'red';
        return;
    }
    
    dbArea.innerHTML = '';
    dbArea.className = 'area-passive';
}
