import { render } from '../node_modules/lit-html/lit-html.js';
import page from '../node_modules/page/page.mjs';

import { homePage } from './views/home.js';
import { loginPage } from './views/login.js';
import { registerPage } from './views/register.js';
import { logout } from './api/data.js';
import { listingPage } from './views/listing.js';
import { createPage } from './views/create.js';
import { detailsPage } from './views/details.js';
import { editPage } from './views/edit.js';
import { myListingPage } from './views/myListing.js';
import { searchPage } from './views/search.js';

const main = document.getElementById('site-content');

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await logout();
    setUserNav();
    page.redirect('/');
});

setUserNav();

page('/', decorateContext, guestUsersOnly, homePage);
page('/login', decorateContext, loginPage);
page('/register', decorateContext, registerPage);
page('/listing', decorateContext, listingPage);
page('/create', decorateContext, createPage);
page('/details/:id', decorateContext, detailsPage);
page('/edit/:id', decorateContext, editPage);
page('/myListing', decorateContext, myListingPage);
page('/search', decorateContext, searchPage);

page.start();

function guestUsersOnly(ctx, next) {
    const token = sessionStorage.getItem('authToken');
    if (token != null) {
        return ctx.page.redirect('/catalog');
    }
    next();
}

function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, main);
    ctx.setUserNav = setUserNav;

    next();
}

function setUserNav() {
    const username = sessionStorage.getItem('username');

    if (username != null) {
        document.querySelector('div#profile > a').textContent = `Welcome ${username}`;
        document.getElementById('profile').style.display = 'block';
        document.getElementById('guest').style.display = 'none';
    } else {
        document.getElementById('profile').style.display = 'none';
        document.getElementById('guest').style.display = 'block';
    }
}
