import { html } from '../../node_modules/lit-html/lit-html.js';
import { cardTemplate } from './common/card.js';
import { search } from '../api/data.js';

const searchTemplate = (articles, title) => html`
<section id="search-page" class="content">
    <h1>Search</h1>
    <form id="search-form">
        <p class="field search">
            <input id="search-input" type="text" placeholder="Search by article title" name="search" .value=${title || ''}>
        </p>
        <p class="field submit">
            <input class="btn submit" type="submit" value="Search">
        </p>
    </form>
    <div class="search-container">

    ${title != '' 
        ? articles.length == 0 
                ? html`<p class="no-cars">No matching articles</p>` 
                : articles.map(cardTemplate)
        : undefined
    }

    </div>
</section>`;

export async function searchPage(ctx) {
    let articles = [];
    let title = '';
    if (ctx.querystring) {

        title = ctx.querystring.split('=')[1];
        articles = await search(title);
    }
    ctx.render(searchTemplate(articles, title));
    
    // function onSearch(event) {
    //     ctx.page.redirect('/search?query=' + query);
    // }
}