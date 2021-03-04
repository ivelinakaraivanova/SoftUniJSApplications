async function solve() {
    const section = document.querySelector('section');
    const divExample = document.getElementById('accordion');

    const articlesList = await getArticles();
    
    articlesList.forEach(async element => {
        const articleInfo = await getArticleInfo(element._id);
        section.appendChild(
            e('div', { id: 'accordion' },
                e('div', { className: 'head' },
                    element.title,
                    e('span', { className: 'button', onclick: toggle }, 'More')),
                e('div', { id: 'extra' },
                    e('p', {}, articleInfo.content))
            )
        )
    })

    divExample.style.display = 'none';
}

async function getArticles() {
    const url = 'http://localhost:3030/jsonstore/advanced/articles/list';

    const response = await fetch(url);
    const articles = await response.json();

    return articles;
}

async function getArticleInfo(id) {
    const url = 'http://localhost:3030/jsonstore/advanced/articles/details/' + id;

    const response = await fetch(url);
    const articleData = await response.json();

    return articleData;
}

function toggle() {
    const extra = this.parentNode.nextSibling;
    extra.style.display = extra.style.display !== 'block' ? 'block' : 'none';
    this.textContent = this.textContent === 'More' ? 'Less' : 'More';
}

function e(type, attributes, ...content) {
    const result = document.createElement(type);

    for (let [attr, value] of Object.entries(attributes || {})) {
        if (attr.substring(0, 2) == 'on') {
            result.addEventListener(attr.substring(2).toLocaleLowerCase(), value);
        } else {
            result[attr] = value;
        }
    }

    content = content.reduce((a, c) => a.concat(Array.isArray(c) ? c : [c]), []);

    content.forEach(e => {
        if (typeof e == 'string' || typeof e == 'number') {
            const node = document.createTextNode(e);
            result.appendChild(node);
        } else {
            result.appendChild(e);
        }
    });

    return result;
}

solve();