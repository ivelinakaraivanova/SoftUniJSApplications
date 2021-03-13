import { e } from './dom.js';
import {showDetails} from './details.js';

async function getMovies() {
    const response = await fetch('http://localhost:3030/data/movies');
    const data = await response.json();

    return data;
}

function createMoviePreview(movie) {
    const result = e('div', { className: 'card mb-4' },
        e('img', { className: 'card-img-top', src: `${movie.img}`, alt: 'Card image cap', width: '400' }),
        e('div', { className: 'card-body' },
            e('h4', { className: 'card-title' }, `${movie.title}`)),
        e('div', { className: 'card-footer' },
            e('button',
                {
                    className: 'btn',
                    className: 'btn-info',
                    className: 'movieDetailsLink',
                    type: 'button',
                    id: `${movie._id}`
                },
                'Details'))
    );
    return result;
}

let main;
let section;
let container;

export function setupHome(targetMain, targetSection) {
    main = targetMain;
    section = targetSection;
    container = section.querySelector('.card-deck.d-flex.justify-content-center');

    container.addEventListener('click', event => {
        if (event.target.classList.contains('movieDetailsLink')) {
            showDetails(event.target.id);
        }
    });

}

export async function showHome() {
    container.innerHTML = 'Loading&hellip;';
    main.innerHTML = '';
    main.appendChild(section);

    const movies = await getMovies();
    const cards = movies.map(createMoviePreview);

    const fragment = document.createDocumentFragment();
    cards.forEach(c => fragment.appendChild(c));

    container.innerHTML = '';
    container.appendChild(fragment);
}
