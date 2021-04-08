import { html } from '../../node_modules/lit-html/lit-html.js';
import { getRecentArticles } from '../api/data.js';

const homeTemplate = (articles) => html`
<section id="home-page" class="content">
    <h1>Recent Articles</h1>
    ${categoryTemplate('recent js', 'JavaScript', articles.filter(a => a.category == 'JavaScript'))}
    ${categoryTemplate('recent csharp', 'C#', articles.filter(a => a.category == 'C#'))}
    ${categoryTemplate('recent java', 'Java', articles.filter(a => a.category == 'Java'))}
    ${categoryTemplate('recent python', 'Python', articles.filter(a => a.category == 'Python'))}
</section>`;

const articleTemplate = (article) => html`
<article>
    <h3>${article.title}</h3>
    <p>${article.content}</p>
    <a href="/details/${article._id}" class="btn details-btn">Details</a>
</article>`;

const categoryTemplate = (className, category, articles) => html`
<section class=${className}>
    <h2>${category}</h2>
    ${articles.length == 0 ? html`<h3 class="no-articles">No articles yet</h3>` : articles.map(articleTemplate)}
</section>`;

export async function homePage(ctx) {
    const articles = await getRecentArticles();
    ctx.render(homeTemplate(articles));
}