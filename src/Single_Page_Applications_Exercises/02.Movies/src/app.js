import { setupHome, showHome } from './home.js';
import { setupDetails } from './details.js';
import { setupLogin, showLogin } from './login.js';
import { setupRegister, showRegister } from './register.js';
import { setupCreate, showCreate } from './create.js';
import { setupEdit } from './edit.js';

const main = document.querySelector('main');

const links = {
    'homeLink': showHome,
    'loginLink': showLogin,
    'registerLink': showRegister,
    'createLink': showCreate
}

setupSection('home-page', setupHome);
setupSection('add-movie', setupCreate);
setupSection('movie-details', setupDetails);
setupSection('edit-movie', setupEdit);
setupSection('form-login', setupLogin);
setupSection('form-sign-up', setupRegister);

/*
setupHome(main, document.getElementById('home-page'));
setupCreate(main, document.getElementById('add-movie'));
setupDetails(main, document.getElementById('movie-details'));
setupEdit(main, document.getElementById('edit-movie'));
setupLogin(main, document.getElementById('form-login'));
setupRegister(main, document.getElementById('form-sign-up'));
*/


setupNavigation();

showHome();

function setupSection(sectionId, setup) {
    const section = document.getElementById(sectionId);
    setup(main, section);
}

function setupNavigation() {
    const email = sessionStorage.getItem('email');
    if (email != null) {
        document.getElementById('welcome-msg').textContent = `Welcome, ${email}`;
        [...document.querySelectorAll('nav .user')].forEach(link => link.style.display = 'block');
        [...document.querySelectorAll('nav .guest')].forEach(link => link.style.display = 'none');
    } else {
        [...document.querySelectorAll('nav .user')].forEach(link => link.style.display = 'none');
        [...document.querySelectorAll('nav .guest')].forEach(link => link.style.display = 'block');
    }

    document.querySelector('nav').addEventListener('click', (event) => {
        const view = links[event.target.id];
        if (typeof view == 'function') {
            event.preventDefault();
            view();
        }
    });

    document.getElementById('createLink').addEventListener('click', (event) => {
        event.preventDefault();
        showCreate();
    });

    document.getElementById('logoutBtn').addEventListener('click', logout);
}

async function logout() {
    const token = sessionStorage.getItem('authToken');
    const response = await fetch('http://localhost:3030/users/logout', {
        method: 'get',
        headers: {
            'X-Authorization': token
        },
    });
    if (response.ok) {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('userEmail');
        [...document.querySelectorAll('nav .user')].forEach(link => link.style.display = 'none');
        [...document.querySelectorAll('nav .guest')].forEach(link => link.style.display = 'block');
        showHome();
    } else {
        const error = await response.json();
        alert(error.message);
    }
}
