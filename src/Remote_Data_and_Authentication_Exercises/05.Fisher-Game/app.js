function attachEvents() {
    const divCatches = document.getElementById('catches');
    divCatches.innerHTML = '';

    const btnLoad = document.querySelector('aside>button');
    btnLoad.addEventListener('click', loadCatches);

    const btnLogin = document.getElementById('guest');
    const btnLogout = document.getElementById('user');

    const btnAdd = document.querySelector('#addForm>button');

    if (sessionStorage.userToken) {
        btnLogin.style.display = 'none';
        btnLogout.style.display = 'inline-block';
        btnAdd.disabled = false;
        btnAdd.addEventListener('click', async (e) => {
            await onCreateSubmit(e);
            await loadCatches();
        });

        btnLogout.addEventListener('click', () => {
            sessionStorage.clear();
        });

    } else {
        btnLogin.style.display = 'inline-block';
        btnLogout.style.display = 'none';
    }
};

attachEvents();

async function onCreateSubmit(event) {
    event.preventDefault();

    const inputs = document.querySelectorAll('#addForm input');
    const angler = inputs[0].value;
    const weight = inputs[1].value;
    const species = inputs[2].value;
    const location = inputs[3].value;
    const bait = inputs[4].value;
    const captureTime = inputs[5].value;

    if (!angler || !Number(weight) || !species || !location || !bait || !Number(captureTime)) {
        return;
    }

    createCatch({
        angler,
        weight: Number(weight),
        species,
        location,
        bait,
        captureTime: Number(captureTime)
    });

    inputs.forEach(i => i.value = '');
}

async function request(url, options) {
    const response = await fetch(url, options);
    if (response.ok == false) {
        const error = await response.json();
        alert(error.message);
        throw new Error(error.message);
    }
    const data = await response.json();
    return data;
}

async function createCatch(catchData) {
    const token = sessionStorage.getItem('userToken');
    const catchCr = await request('http://localhost:3030/data/catches', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token
        },
        body: JSON.stringify(catchData)
    });
    return catchCr;
}

async function getCatches() {
    const catches = await request('http://localhost:3030/data/catches');
    return catches;
}

async function updateCatch(id, catchData) {
    const token = sessionStorage.getItem('userToken');
    const catchUp = await request('http://localhost:3030/data/catches/' + id, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token
        },
        body: JSON.stringify(catchData)
    });
    return catchUp;
}

async function deleteCatch(id) {
    const token = sessionStorage.getItem('userToken');
    const catchDel = await request('http://localhost:3030/data/catches/' + id, {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token
        },
    });
    return catchDel;
}

async function loadCatches() {
    const divCatches = document.getElementById('catches');

    if (divCatches.children.length > 0) {
        divCatches.innerHTML = ''
    };

    const catches = await getCatches();
    console.log(Object.values(catches))
    Object.values(catches).map(c => {

        const divCatch = e('div', { className: 'catch' },
            e('label', {}, 'Angler'),
            e('input', { type: 'text', className: 'angler', value: `${c.angler}` }),
            e('hr'),
            e('label', {}, 'Weight'),
            e('input', { type: 'number', className: 'weight', value: `${c.weight}` }),
            e('hr'),
            e('label', {}, 'Species'),
            e('input', { type: 'text', className: 'species', value: `${c.species}` }),
            e('hr'),
            e('label', {}, 'Location'),
            e('input', { type: 'text', className: 'location', value: `${c.location}` }),
            e('hr'),
            e('label', {}, 'Bait'),
            e('input', { type: 'text', className: 'bait', value: `${c.bait}` }),
            e('hr'),
            e('label', {}, 'Capture Time'),
            e('input', { type: 'number', className: 'captureTime', value: `${c.captureTime}` }),
            e('hr'),
            e('button', { className: 'update', disabled: true }, 'Update'),
            e('button', { className: 'delete', disabled: true }, 'Delete'),
        );

        divCatches.appendChild(divCatch);

        if (c._ownerId == sessionStorage.userId) {
            const btnUpdate = divCatch.querySelector('.update');
            btnUpdate.disabled = false;
            const btnDelete = divCatch.querySelector('.delete');
            btnDelete.disabled = false;

            btnUpdate.addEventListener('click', async (e) => {

                const angler = e.target.parentNode.children[1].value;
                const weight = Number(e.target.parentNode.children[4].value);
                const species = e.target.parentNode.children[7].value;
                const location = e.target.parentNode.children[10].value;
                const bait = e.target.parentNode.children[13].value;
                const captureTime = Number(e.target.parentNode.children[16].value);

                if (!angler || !Number(weight) || !species || !location || !bait || !Number(captureTime)) {
                    return;
                }

                updateCatch(c._id,
                    {
                        angler,
                        weight: Number(weight),
                        species,
                        location,
                        bait,
                        captureTime: Number(captureTime)
                    })

                loadCatches();
            })

            btnDelete.addEventListener('click', async () => {
                const confirmation = confirm('Are you sure you want to delete this catch?');
                if (confirmation) {
                    deleteCatch(c._id);
                    loadCatches();
                }
            });
        }
    });
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
