import { showDetails } from './details.js';

async function getMovieById(id) {
    const response = await fetch('http://localhost:3030/data/movies/' + id);
    const movie = await response.json();

    return movie;
}

let main;
let section;

let movieId;

export function setupEdit(targetMain, targetSection) {
    main = targetMain;
    section = targetSection;
    const form = targetSection.querySelector('form');
    form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const formData = new FormData(ev.target);
        onSubmit([...formData.entries()].reduce((p, [k, v]) => Object.assign(p, { [k]: v }), {}));
    });

    async function onSubmit(data) {
        const body = JSON.stringify({
            title: data.title,
            description: data.description,
            img: data.img,
        });

        const token = sessionStorage.getItem('authToken');
        if (token == null) {
            return alert('You\'re not logged in!');
        }

        try {
            const response = await fetch('http://localhost:3030/data/movies/' + movieId, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': token
                },
                body
            });

            if (response.status == 200) {
                showDetails(movieId);
            } else {
                const error = await response.json();
                throw new Error(error.message);
            }
        } catch (err) {
            alert(err.message);
            console.error(err.message);
        }
    }
}

export async function showEdit(id) {
    main.innerHTML = '';
    main.appendChild(section);

    movieId = id;
    const movie = await getMovieById(movieId);

    section.querySelector('[name="title"]').value = movie.title;
    section.querySelector('[name="description"]').value = movie.description;
    section.querySelector('[name="imageUrl"]').value = movie.img;
}
