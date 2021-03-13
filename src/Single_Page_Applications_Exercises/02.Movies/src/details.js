import { e } from './dom.js';
import { showHome } from './home.js';
import { showEdit } from './edit.js';

async function getLikesByMovieId(movieId) {
    const response = await fetch(`http://localhost:3030/data/likes?where=movieId%3D%22${movieId}%22&distinct=_ownerId&count`);
    const likes = await response.json();

    return likes;
}

async function getOwnLikeByMovieId(movieId) {
    const userId = sessionStorage.getItem('userId')
    const response = await fetch(`http://localhost:3030/data/likes?where=movieId%3D%22${movieId}%22%20and%20_ownerId%3D%22${userId}%22`);
    const ownLike = await response.json();

    return ownLike;
}

async function getMovieById(id) {
    const response = await fetch('http://localhost:3030/data/movies/' + id);
    const movie = await response.json();

    return movie;
}

async function deleteMovieById(id) {
    const token = sessionStorage.getItem('authToken');

    try {
        const response = await fetch('http://localhost:3030/data/movies/' + id, {
            method: 'delete',
            headers: {
                'X-Authorization': token
            }
        });

        if (response.ok) {
            alert('Movie deleted');
            showHome();
        } else {
            const error = await response.json();
            throw new Error(error.message);
        }
    } catch (err) {
        alert(err.message);
    }
}

async function onDelete(ev, id) {
    ev.preventDefault();
    const confirmed = confirm(`Are you sure you want to delete this movie?`);
    if (confirmed) {
        deleteMovieById(id);
    }
}

function createMovieCard(movie, likes, ownLike) {
    const userId = sessionStorage.getItem('userId');
    const controls = [];
    if (userId != null) {
        if (userId == movie._ownerId) {
            controls.push(e('a', { className: 'btn btn-danger', href: '#', onClick: (e) => onDelete(e, movie._id) }, 'Delete'));
            controls.push(e('a', { className: 'btn btn-warning', href: '#', onClick: () => showEdit(movie._id) }, 'Edit'));
        } else if (ownLike.length == 0) {
            controls.push(e('a', { className: 'btn btn-primary', href: '#', onClick: likeMovie }, 'Like'))
        }
    }

    const likesSpan = e('span', { className: 'enrolled-span' }, likes + ' like' + (likes == 1 ? '' : 's'));
    controls.push(likesSpan);

    const result = e('div', { className: 'container' },
        e('div', { className: 'row bg-light text-dark' },
            e('h1', {}, `Movie title: ${movie.title}`),
            e('div', { className: 'col-md-8' },
                e('img', { className: 'img-thumbnail', src: `${movie.img}`, alt: 'Movie' })),
            e('div', { className: 'col-md-4 text-center' },
                e('h3', { className: 'my-3' }, 'Movie Description'),
                e('p', {}, `${movie.description}`),
                controls
            )
        )
    );
    return result;

    async function likeMovie(event) {
        const response = await fetch('http://localhost:3030/data/likes', {
            method: 'post',
            headers: {
                'Content-Type': 'application/jason',
                'X-Authorization': sessionStorage.getItem('authToken')
            },
            body: JSON.stringify({ movieId: movie._id })
        });

        if (response.ok) {
            event.target.remove();
            likes += 1;
            likesSpan.textContent = likes + ' like' + (likes == 1 ? '' : 's');
        }
    }
}

let main;
let section;

export function setupDetails(targetMain, targetSection) {
    main = targetMain;
    section = targetSection;

}

export async function showDetails(id) {
    section.innerHTML = '';
    main.innerHTML = '';
    main.appendChild(section);

    const [movie, likes, ownLike] = await Promise.all([
        getMovieById(id),
        getLikesByMovieId(id),
        getOwnLikeByMovieId(id)
    ]);
    const card = createMovieCard(movie, likes, ownLike);
    section.appendChild(card);
}