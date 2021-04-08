import {html, render} from '../node_modules/lit-html.js';

const listTemplate = (data) => html `
<ul>
${data.map(t => html`<li>${t}</li>`)}
</ul>
`;

document.getElementById('btnLoadTowns').addEventListener('click', updateList);

function updateList(event) {
    event.preventDefault();
    
    const root = document.getElementById('root');
    const townsAsString = document.getElementById('towns').value;
    const towns = townsAsString.split(', ').map(t => t.trim());
    const result = listTemplate(towns);
    
    render(result, root);
}
