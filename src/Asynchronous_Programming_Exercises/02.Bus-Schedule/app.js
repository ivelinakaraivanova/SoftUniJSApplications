function solve() {
    const info = document.querySelector('#info>span');
    const btnDepart = document.getElementById('depart');
    const btnArrive = document.getElementById('arrive');

    let stop = {
        next: 'depot'
    };
    
    try {
        async function depart() {

            const url = 'http://localhost:3030/jsonstore/bus/schedule/' + stop.next;

            const response = await fetch(url);
            const stops = await response.json();

            stop = stops;
            info.textContent = `Next stop ${stop.name}`;
            btnArrive.removeAttribute('disabled');
            btnDepart.setAttribute('disabled', 'disabled');

        }

        function arrive() {

            info.textContent = `Arriving at ${stop.name}`;
            btnDepart.removeAttribute('disabled');
            btnArrive.setAttribute('disabled', 'disabled');

        }


        return {
            depart,
            arrive
        };

    } catch (error) {
        info.textContent = 'Error';
        btnDepart.removeAttribute('disabled');
        btnArrive.removeAttribute('disabled');
    }
}

let result = solve();