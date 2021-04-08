import { render } from '../node_modules/lit-html/lit-html.js';
import page from '../node_modules/page/page.mjs';

import { getUserData } from './utility.js';
import { homePage } from './views/home.js';
import { loginPage } from './views/login.js';
import { registerPage } from './views/register.js';
import {logout} from './api/data.js';
import { addPage } from './views/add.js';
import { detailsPage } from './views/details.js';
import { editPage } from './views/edit.js';

const main = document.querySelector('main');

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await logout();
    setUserNav();
    page.redirect('/login');
});

setUserNav();

page('/', decorateContext, homePage);
page('/login', decorateContext, loginPage);
page('/register', decorateContext, registerPage);
page('/add', decorateContext, addPage);
page('/details/:id', decorateContext, detailsPage);
page('/edit/:id', decorateContext, editPage);

page.start();

function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, main);
    ctx.setUserNav = setUserNav;
    ctx.user = getUserData();
    next();
}

function setUserNav() {
    const user = getUserData();

    if (user) {
        document.getElementById('welcome-msg').textContent = `Welcome, ${user.email}`;
        document.getElementById('user').style.display = 'block';
        document.getElementById('guest').style.display = 'none';
    } else {
        document.getElementById('user').style.display = 'none';
        document.getElementById('guest').style.display = 'block';
    }
}