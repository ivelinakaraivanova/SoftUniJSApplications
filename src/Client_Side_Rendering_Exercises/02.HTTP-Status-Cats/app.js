import { html, render } from '../node_modules/lit-html/lit-html.js';
import { styleMap } from '../node_modules/lit-html/directives/style-map.js';
import { cats } from './catSeeder.js';

const catCardTemplate = (cat) => html`
<li>
    <img src="./images/${cat.imageLocation}.jpg" width="250" height="250" alt="Card image cap">
    <div class="info">
        <button class="showBtn">${cat.info ? 'Hide' : 'Show'} status code</button>
        <div class="status" style=${styleMap(cat.info ? {} : {display: 'none'})} id=${cat.id}>
            <h4>Status Code: ${cat.statusCode}</h4>
            <p>${cat.statusMessage}</p>
        </div>
    </div>
</li>
`;
const main = document.getElementById('allCats');
cats.forEach(c => c.info = false);
update();

function update() {
    const catsCards = html`
    <ul @click=${toggleInfo}>
        ${cats.map(catCardTemplate)}
    </ul>`;
    render(catsCards, main);
}

function toggleInfo(event) {
    const elementId = event.target.parentNode.querySelector('.status').id;
    const cat = cats.find(c => c.id == elementId);
    cat.info = !cat.info;
    update();
}
