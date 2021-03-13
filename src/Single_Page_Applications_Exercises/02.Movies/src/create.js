import { showDetails } from './details.js';

let main;
let section;

export function setupCreate(targetMain, targetSection) {
    main = targetMain;
    section = targetSection;
    
    const form = targetSection.querySelector('form');

    form.addEventListener('submit', (ev => {
        ev.preventDefault();
        const formData = new FormData(ev.target);
        onSubmit([...formData.entries()].reduce((p, [k, v]) => Object.assign(p, { [k]: v }), {}));
    }));

    async function onSubmit(data) {
        const body = JSON.stringify({
            title: data.title,
            description: data.description,
            img: data.img
        });

        const token = sessionStorage.getItem('authToken');
        if (token == null) {
            return alert('You\'re not logged in!');
        }

        if (data.title = '' || data.description == '' || data.img == '') {
            return alert('All fields are required!');
        }

        try {
            const response = await fetch('http://localhost:3030/data/movies', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': token
                },
                body
            });

            if (response.status == 200) {
                showDetails((await response.json())._id);
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

export function showCreate() {
    
    main.innerHTML = '';
    main.appendChild(section);
}
