async function lockedProfile() {
    const main = document.getElementById('main');
    const divProfileExample = main.children[0];

    const url = 'http://localhost:3030/jsonstore/advanced/profiles';

    const response = await fetch(url);
    const profiles = await response.json();

    Object.values(profiles).forEach((p, idx) => {
        const divProfile = divProfileExample.cloneNode(true);
        const divHidden = divProfile.children[9];

        divProfile.children[2].name = `user${idx + 1}Locked`;
        divProfile.children[2].checked = 'true';
        divProfile.children[4].name = `user${idx + 1}Locked`;
        divProfile.children[8].name = `user${idx + 1}Username`;
        divProfile.children[8].value = p.username;
        
        divHidden.id = `user${idx + 1}HiddenFields`;
        divHidden.style.display = 'none';
        divHidden.children[2].name = `user${idx + 1}Email`;
        divHidden.children[2].value = p.email;
        divHidden.children[4].name = `user${idx + 1}Age`;
        divHidden.children[4].value = p.age;

        const btnShow = divProfile.children[10];
        btnShow.addEventListener('click', (e) => {
            let isLocked = e.target.parentNode.querySelector('input[type=radio]:checked').value === 'lock';

            if (!isLocked) {
                const isVisible = divHidden.style.display === 'block';
                divHidden.style.display = isVisible ? 'none' : 'block';
                btnShow.textContent = isVisible ? 'Show more' : 'Hide it';
            }
        })
        main.appendChild(divProfile);
    })

    divProfileExample.remove();
}
