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



// function e(type, attributes, ...content) {
//     const result = document.createElement(type);

//     for (let [attr, value] of Object.entries(attributes || {})) {
//         if (attr.substring(0, 2) == 'on') {
//             result.addEventListener(attr.substring(2).toLocaleLowerCase(), value);
//         } else {
//             result[attr] = value;
//         }
//     }

//     content = content.reduce((a, c) => a.concat(Array.isArray(c) ? c : [c]), []);

//     content.forEach(e => {
//         if (typeof e == 'string' || typeof e == 'number') {
//             const node = document.createTextNode(e);
//             result.appendChild(node);
//         } else {
//             result.appendChild(e);
//         }
//     });

//     return result;
// }


// const divProfile = e('div', { className: 'profile' },
//             e('img', { className: 'userIcon', src: './iconProfile2.png' }),
//             e('label', {}, 'Lock'),
//             e('input', { type: 'radio', name: `user${idx + 1}Locked`, value: 'lock', checked: 'true' }),
//             e('label', {}, 'Unlock'),
//             e('input', { type: 'radio', name: `user${idx + 1}Unlocked`, value: 'unlock'}),
//             e('br'),
//             e('hr'),
//             e('label', {}, 'Username'),
//             e('input', { type: 'text', name: `user${idx + 1}Username`, value: p.username, disabled: 'true', readonly: 'true' }),
//             e('div', { id: `user${idx + 1}HiddenFields`, style: 'display: none;' },
//                 e('hr'),
//                 e('label', {}, 'Email:'),
//                 e('input', { type: 'email', name: `user${idx + 1}Email`, value: p.email, disabled: 'true', readonly: 'true' }),
//                 e('label', {}, 'Age:'),
//                 e('input', { type: 'email', name: `user${idx + 1}Age`, value: p.email, disabled: 'true', readonly: 'true' }),
//             ),
//             e('button', {}, 'Show more')
//         )