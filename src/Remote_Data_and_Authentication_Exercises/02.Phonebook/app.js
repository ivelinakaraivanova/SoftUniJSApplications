function attachEvents() {
    const btnLoad = document.getElementById('btnLoad');
    const btnCreate = document.getElementById('btnCreate');
    const inputPerson = document.getElementById('person');
    const inputPhone = document.getElementById('phone');
    const ulLoad = document.getElementById('phonebook');

    btnLoad.addEventListener('click', loadPhones);

    btnCreate.addEventListener('click', async () => {
        const person = inputPerson.value;
        const phone = inputPhone.value;

        await createPhone({ person, phone });

        inputPerson.value = '';
        inputPhone.value = '';

        await loadPhones();
    })

    async function loadPhones() {
        if (ulLoad.children.length > 0) {
            ulLoad.innerHTML = ''
        };

        const phones  = await getPhones();

        Object.values(phones).map(p => {
            const liElement = document.createElement('li');
            liElement.textContent = `${p.person}: ${p.phone}`;
    
            const btnDelete = document.createElement('button');
            btnDelete.textContent = 'Delete';
    
            liElement.appendChild(btnDelete);
            ulLoad.appendChild(liElement);
    
            btnDelete.addEventListener('click', async () => {
                await deletePhone(p._id);
                await loadPhones();
            });
        })
    }
}

attachEvents();

async function getPhones() {
    const response = await fetch('http://localhost:3030/jsonstore/phonebook');
    const phones = await response.json();

    return phones;
}

async function deletePhone(key) {
    const response = await fetch('http://localhost:3030/jsonstore/phonebook/' + key, {
        method: 'delete',
    });

    const result = await response.json();
}

async function createPhone(phone) {
    const response = await fetch('http://localhost:3030/jsonstore/phonebook', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(phone)
    });
}
