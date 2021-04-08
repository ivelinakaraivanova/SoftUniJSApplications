import { html } from '../../node_modules/lit-html/lit-html.js';
import { getArticleById, editArticle } from '../api/data.js';

const editTemplate = (article, onSubmit) => html`
<section id="edit-page" class="content">
    <h1>Edit Article</h1>

    <form @submit=${onSubmit} id="edit" action="#" method="">
        <fieldset>
            <p class="field title">
                <label for="title">Title:</label>
                <input type="text" name="title" id="title" .value=${article.title} placeholder="Enter article title">
            </p>

            <p class="field category">
                <label for="category">Category:</label>
                <input type="text" name="category" id="category" .value=${article.category} placeholder="Enter article category">
            </p>
            <p class="field">
                <label for="content">Content:</label>
                <textarea name="content" .value=${article.content} id="content"></textarea>
            </p>

            <p class="field submit">
                <input class="btn submit" type="submit" value="Save Changes">
            </p>

        </fieldset>
    </form>
</section>`;

export async function editPage(ctx) {
    const articleId = ctx.params.id;
    const article = await getArticleById(articleId);
    ctx.render(editTemplate(article, onSubmit));

    async function onSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        const title = formData.get('title').trim();
        const category = formData.get('category').trim();
        const content = formData.get('content').trim();

        if (!title || !category || !content) {
            return alert('All fields are required!');
        }

        const categories = ['JavaScript', 'C#', 'Java', 'Python'];

        if (!categories.includes(category)) {
            return alert('Category must be one of "JavaScript", "C#", "Java", or "Python"!');
        }

        await editArticle(article._id, {title, category, content});
        event.target.reset();
        ctx.page.redirect('/details/' + articleId);
    }
}